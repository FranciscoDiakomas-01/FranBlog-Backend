import cors from "cors"
import dotenv from "dotenv"
import db from "./db.js"
import express from "express"
import userRouter from "./routes/UserRoute.js"
import path from "path"
import LoginRoute from "./routes/loginRoute.js"
import CategoryPostRouter from "./routes/categoryRoute.js"
import PostRouter from "./routes/postRoute.js"

dotenv.config()
const server = express();
const port = process.env.SERVER_PORT || 3000

//global middlewares
server.use(cors())
server.use(express.json());

//routes
server.use(userRouter)
server.use(LoginRoute);
server.use(CategoryPostRouter);
server.use(PostRouter);

const curDir = path.join(path.join(process.cwd(), "src/uploads"));
server.use(express.static(curDir));

//db connection
db.connect();

//server listening
server.listen(port, () => {
    try {
        console.log(`Server runnig on ${process.env.SERVER_PATH}`);
    } catch (error) {
        throw new Error(`Error : ${error}`);
    }
})