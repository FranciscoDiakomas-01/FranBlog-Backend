import { Router } from 'express'
import CategoryPostController from '../controllers/categoryPostontroller.js'

const CategoryPostRouter = Router()
CategoryPostRouter.post("/categoryPost", CategoryPostController.register);
CategoryPostRouter.put("/categoryPost", CategoryPostController.update);
CategoryPostRouter.get("/categoryPosts", CategoryPostController.get);
CategoryPostRouter.get("/categoryPost/:id", CategoryPostController.getOne);
CategoryPostRouter.delete("/categoryPost/:id", CategoryPostController.deleteOne);
export default CategoryPostRouter