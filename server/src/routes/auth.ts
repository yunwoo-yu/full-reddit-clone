import { Request, Response, Router } from 'express';

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  console.log('email', email);
};

const authRouter = Router();

authRouter.post('/register', register);

export default authRouter;
