import { Router } from "express";
import PostController from "../controllers/postController.js";
import upload from "../middlewares/upload.js";
const PostRouter = Router();
PostRouter.post("/post", upload.single("file") , PostController.register);
PostRouter.put("/post", upload.single("file"), PostController.update);
PostRouter.get("/posts", PostController.get);
PostRouter.get("/post/:id", PostController.getOne);
PostRouter.delete("/post/:id",PostController.deleteOne);
export default PostRouter;
