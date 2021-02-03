import { NextFunction, Request, Response, Router } from 'express';
import { connect } from 'http2';
import { FieldPacket } from 'mysql2/promise';
import { pool } from '..';
import { Book, Item, Shift } from '../domains/Item';
import { wrap } from '../test';
import { User } from '../domains/User';

export const itemsRouter = Router();

itemsRouter.get(
  '/',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const connection = await pool.getConnection();
    const [items, fields2]: [Item[], FieldPacket[]] = await connection.execute(
      'SELECT * FROM items',
      []
    );
    connection.release();
    res.json(items);
  })
);

itemsRouter.post(
  '/calender',
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body.shift;
    const year = req.body.year;
    const month = req.body.month;
    const userid = req.user_id;
    console.log(data.length);
    const conection = await pool.getConnection();
    let d = 0;
    for (let step = 1; step < data.length; step++) {
      const [shift, fields]: [Shift[], FieldPacket[]] = await conection.execute(
        `INSERT INTO staff (year,month,data,shift,staffId) VALUES ("${year}","${month}","${step}","${data[d]}","${userid}")`,
        []
      );
      //日付け合わせ
      d++;
    }
    conection.release();
    return res.json('sunsecc');
  }
);

itemsRouter.post(
  '/approval',
  async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.body.userid;
    console.log(req.body);

    const conection = await pool.getConnection();
    const [shift, fildes]: [User[], FieldPacket[]] = await conection.execute(
      `SELECT * FROM user WHERE id="${userid}"`,
      []
    );
    conection.release();

    if (shift.length === 0) {
      return res.status(420).send('該当なし');
    }
    return res.json(shift);
  }
);

itemsRouter.get(
  '/reserve',
  async (req: Request, res: Response, next: NextFunction) => {
    const conenction = await pool.getConnection();
    const [shift, fields]: [Shift[], FieldPacket[]] = await conenction.execute(
      'SELECT * FROM staff WHERE shift="work"'
    );
    conenction.release();
    return res.json(shift);
  }
);

itemsRouter.post(
  '/add',
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const year = req.body.year;
    const data = req.body.data;
    const month = req.body.month;
    const staffId = req.body.staffid;
    const time = req.body.time;
    const conection = await pool.getConnection();
    const [book, filelds]: [Book[], FieldPacket[]] = await conection.execute(
      `INSERT INTO book (year,data,month,staffid,time) VALUES ("${year}","${data}","${month}","${staffId}","${time}")`,
      []
    );
    conection.release();
    return res.json(book);
  }
);
itemsRouter.post(
  '/getshift',
  async (req: Request, res: Response, next: NextFunction) => {
    const staffid = req.body;
    const conection = await pool.getConnection();
    const [book, fields]: [Book[], FieldPacket[]] = await conection.execute(
      `SELECT * FROM BOOK WHERE staffid="${staffid}`,
      []
    );
    conection.release();
    return res.json(book);
  }
);

itemsRouter.get(
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

itemsRouter.post(
  '/staffshift',
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body;
    const conection = await pool.getConnection();
    const book = await conection.execute(
      `SELECT * FROM book INNER JOIN user on user.id=book.staffid WHERE id="${id}"`,
      []
    );
    conection.release();
    res.json(book);
  }
);
