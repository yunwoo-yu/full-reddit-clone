import { Request, Response, Router } from 'express';
import { User } from '../entities/User';
import { validate } from 'class-validator';

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

const authRouter = Router();

authRouter.post('/register', register);

export default authRouter;
