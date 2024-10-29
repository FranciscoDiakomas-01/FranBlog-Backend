import cors from "cors"
import dotenv from "dotenv"
import db from "./db.js"
import express from "express"
import userRouter from "./routes/UserRoute.js"
import path from "path"

dotenv.config()
const server = express();
const port = process.env.SERVER_PORT || 3000
server.use(cors())
server.use(express.json());
const curDir = path.join(path.join(process.cwd() , "src/uploads" ));
server.use(express.static(curDir));
console.log(curDir)
server.use(userRouter)
db.connect();
server.listen(port, () => {
    try {
        console.log(`Server runnig on port http://localhost:${port}`);
    } catch (error) {
        throw new Error(`Error : ${error}`);
    }
})