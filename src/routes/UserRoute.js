import { Router } from 'express'
import userController from '../controllers/UserController.js'
import upload from '../middlewares/upload.js'
const userRouter = Router()

userRouter.get("/users" , userController.get)
userRouter.post("/user",upload.single("file"),userController.register);
userRouter.get("/user/:id" , userController.getOne)
userRouter.delete("/user/:id",userController.deleteOne)
userRouter.put("/user/:id" , upload.single("file") , userController.update)

export default userRouter