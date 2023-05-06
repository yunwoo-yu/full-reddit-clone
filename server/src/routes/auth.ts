import { Request, Response, Router } from 'express';
import { User } from '../entities/User';
import { isEmpty, validate } from 'class-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const mapError = (errors: Object[]) => {
  return errors.reduce((acc: any, cur: any) => {
    acc[cur.property] = Object.entries(cur.constraints)[0][1];
    return acc;
  }, {});
};

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    let errors: any = {};

    // 이메일과 유저이름이 이미 있는지 DB확인
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    // 이미 있을 경우 errors 객체에 넣어줌

    if (emailUser) errors.email = '이미 해당 이메일 주소가 사용되었습니다.';
    if (usernameUser) errors.username = '이미 이 사용자 이름이 사용되었습니다.';

    // 에러가 있을경우 retrun 으로 에러를 response로 보내줌.
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();

    user.email = email;
    user.username = username;
    user.password = password;

    // 엔티티에 정한 조건으로 유저의 유효성 검사 진행

    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(mapError(errors));

    // 유저 정보를 user table에 저장.
    await user.save();
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

interface LoginErrors {
  username: string;
  password: string;
}

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const errors: Partial<LoginErrors> = {};
    // 비워져 있으면 에러를 클라이언트로 전송
    if (isEmpty(username)) errors.username = '사용자 이름을 작성해 주세요.';
    if (isEmpty(password)) errors.password = '비밀번호를 작성해 주세요.';

    // 에러가 있다면 400 에러와 함께 에러를 전달
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // DB에 유저 찾기
    const user = await User.findOneBy({ username });

    if (!user) return res.status(404).json({ username: '사용자 이름이 등록되지 않았습니다.' });

    // 유저가 있으면 비밀번호 비교

    const passowrdMatches = await bcrypt.compare(password, user.password);

    // 비밀번호가 다르면 에러 보내기
    if (!passowrdMatches) {
      return res.status(401).json({ passowrd: '비밀번호가 잘못되었습니다.' });
    }

    // 비밀번호가 맞으면 토큰 생성
    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    );

    return res.json({ user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

export default authRouter;
