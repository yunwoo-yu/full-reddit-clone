import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import Sub from "../entities/Subs";
import Post from "../entities/Post";
import Comment from "../entities/Comment";

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  try {
    const post = await Post.findOneOrFail({
      where: { identifier, slug },
      relations: ["sub", "votes"],
    });

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }

    return res.send(post);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
  }
};

const createPost = async (req: Request, res: Response) => {
  const { title, sub, body } = req.body;

  if (title.trim() === "") {
    return res.status(400).json({ title: "제목은 비워둘 수 없습니다." });
  }

  const user = res.locals.user;

  try {
    const subRecord = await Sub.findOneByOrFail({ name: sub });
    const post = new Post();

    (post.title = title), (post.body = body);
    (post.user = user), (post.sub = subRecord);

    await post.save();

    res.json(post);
  } catch (error) {
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const getPostComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneByOrFail({ identifier, slug });
    const comments = await Comment.find({
      where: { postId: post.id },
      order: { createdAt: "DESC" },
      relations: ["votes"],
    });

    if (res.locals.user) {
      comments.forEach((el) => el.setUserVote(res.locals.user));
    }

    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ error: "에러가 발생했습니다." });
  }
};

const createPostComment = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const body = req.body.body;

  try {
    const post = await Post.findOneByOrFail({ identifier, slug });
    const comment = new Comment();
    comment.body = body;
    comment.user = res.locals.user;
    comment.post = post;

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }

    await comment.save();
    return res.json(comment);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
  }
};

const postRouter = Router();

postRouter.get("/:identifier/:slug/comments", userMiddleware, getPostComments);
postRouter.get("/:identifier/:slug", userMiddleware, getPost);
postRouter.post("/", userMiddleware, authMiddleware, createPost);
postRouter.post(
  "/:identifier/:slug/comments",
  userMiddleware,
  createPostComment
);

export default postRouter;
