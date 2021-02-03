import { compare } from 'bcrypt';
import { Router, Request, Response, NextFunction } from 'express';
import { sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { FieldPacket } from 'mysql2/promise';
import { ALLOW_ORIGINS, pool } from '../index';
import { User } from '../domains/User';
import { JWT_SECRET } from '../secrets';
import {
  badRequestException,
  unAuthorizedException,
} from '../_classes/errorException';
import { wrap } from '../test';

export const authRouter = Router();

authRouter.post(
  '/login',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const param: {
      email: string;
      password: string;
    } = req.body;

    const connection = await pool.getConnection();
    const [email_match_users, fields2]: [
      User[],
      FieldPacket[]
    ] = await connection.execute('SELECT * FROM user WHERE email = ?', [
      param.email,
    ]);
    connection.release();
    if (email_match_users.length == 0) throw unAuthorizedException();

    const user_info = email_match_users[0];

    const { token, refresh_token } = create_token(user_info.id);
    await res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 1month
      path: '/auth/refresh',
    });
    res.json(token);
  })
);

authRouter.post(
  '/refresh',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    console.log('DEBUG', req.cookies);

    if (req.headers.origin && ALLOW_ORIGINS.includes(req.headers.origin)) {
      if (!req.cookies.refresh_token)
        throw unAuthorizedException('no token provided.');
      const provided_token = req.cookies.refresh_token.replace(/^Bearer\s/, '');
      console.log('DEBUG', provided_token);

      try {
        const decoded_token = await (<{ user_id: number }>(
          verify(provided_token, JWT_SECRET)
        ));
        const { token, refresh_token } = create_token(decoded_token.user_id);
        await res.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          //maxAge: 1000 * 60 * 60 * 24 * 30,   // 1month
          maxAge: 1000 * 600, // 1minute
          path: '/auth/refresh',
        });
        res.json(token);
      } catch (e) {
        if (e instanceof TokenExpiredError)
          throw unAuthorizedException('token expired.');
        throw e;
      }
    } else {
      throw badRequestException('unauthorized origin.');
    }
  })
);

const create_token = (user_id: number) => {
  const token = sign(
    {
      type: 'access',
      user_id,
    },
    JWT_SECRET,
    {
      expiresIn: '10m',
    }
  );
  const refresh_token = sign(
    {
      type: 'refresh',
      user_id,
    },
    JWT_SECRET,
    {
      expiresIn: '10m',
    }
  );
  return {
    token,
    refresh_token,
  };
};
