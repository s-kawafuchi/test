import { compare, hashSync } from 'bcrypt';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import {
  JsonWebTokenError,
  sign,
  TokenExpiredError,
  verify,
} from 'jsonwebtoken';
import { createPool, FieldPacket, Pool } from 'mysql2/promise';
import { authRouter } from './routes/auth';
import { DB_CONFIG, JWT_SECRET } from './secrets';
import {
  HttpException,
  unAuthorizedException,
} from './_classes/errorException';
import { itemsRouter } from './routes/items';
import { wrap } from './test';
import { Book } from './domains/Item';

const LISTEN_PORT = 3000;
export const ALLOW_ORIGINS = ['http://localhost:4200'];

const app = express();

// Requestを拡張し、user_idを持てるように
declare global {
  namespace Express {
    export interface Request {
      // user_id: { some: number }
      user_id: number;
    }
  }
}

// リクエストボディをJSONに変える
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cookieを扱うための設定
app.use(cookieParser());
// CORS
app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Authorization, Accept, Content-Type'
  );
  // res.header("Access-Control-Allow-Headers", "*");
  res.header('Access-Control-Allow-Credentials', 'true');

  // OPTIONSリクエスト(プリフライトリクエスト)への応答
  // 参考: https://developer.mozilla.org/ja/docs/Web/HTTP/CORS#preflighted_requests
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

// MYSQL
export let pool: Pool;
(async () => {
  pool = await createPool(DB_CONFIG);
})()
  .catch((err) => {
    console.log('Mysql connect error.');
    console.log(err);
    process.exit();
  })
  .finally(() => {
    console.log('Mysql connect success.');
  });

app.listen(LISTEN_PORT, () => {
  console.log(`api running on port ${LISTEN_PORT}`);
});

app.get(
  '/getreserve',
  async (req: Request, res: Response, next: NextFunction) => {
    const conection = await pool.getConnection();
    const [book, filelds]: [Book[], FieldPacket[]] = await conection.execute(
      'SELECT * FROM book'
    );
    conection.release();
    res.json(book);
  }
);

app.get(
  '/staff_shift',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const staffs: {
      id: number;
      name: string;
      email: string;
      date: number;
      shift: string;
    }[] = await (<any>pool.query(
      `
        SELECT
        user.id AS id,
        user.name AS name,
        user.email AS email,
        staff.data AS date,
        staff.shift AS shift
        FROM user
        INNER JOIN staff ON (user.id = staff.staffId)
        WHERE
        staff.year = ?
        AND
        staff.month = ?
    `,
      [2021, 1]
    ));
    const formattedStaffs: {
      id: number;
      name: string;
      email: string;
      shifts: {
        date: number;
        shift: string;
      }[];
    }[] = [];
    staffs.map((staff) => {
      const exist_data = formattedStaffs.find((v) => v.id === staff.id);
      if (exist_data) {
        exist_data.shifts.push({
          date: staff.date,
          shift: staff.shift,
        });
      } else {
        formattedStaffs.push({
          id: staff.id,
          name: staff.name,
          email: staff.email,
          shifts: [
            {
              date: staff.date,
              shift: staff.shift,
            },
          ],
        });
      }
    });
    res.json({ staffs });
  })
);

// '/auth'配下のpathはToken検証ミドルウェアより上に記載しているため、Token検証を行わない
app.use('/auth', authRouter);

// Token検証ミドルウェア
app.use(
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization)
      throw unAuthorizedException('no token provided.');
    const token = req.headers.authorization.replace(/^Bearer\s/, '');
    try {
      const decoded_token = await (<
        { user_id: number; type: 'access' | 'refresh' }
      >verify(token, JWT_SECRET));
      if (decoded_token.type !== 'access')
        throw unAuthorizedException('token type not access.');
      req.user_id = decoded_token.user_id;
    } catch (e) {
      if (e instanceof JsonWebTokenError)
        throw unAuthorizedException('token expired.');
      throw e;
    }
    next();
  })
);

app.use('/items', itemsRouter);

// Error処理ミドルウェア
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Error handler');
  console.log(err);

  if (err instanceof HttpException) {
    res.status(err.statusCode || 500).send(err.message);
  } else {
    res.status(500).json({ message: 'その他のエラー' });
  }
});
