import cors from "cors"
import dotenv from "dotenv"
import db from "./db.js"
import express from "express"
dotenv.config()
const server = express();
const port = process.env.SERVER_PORT || 3000
server.use(cors())
server.use(express.json())
db.connect();

server.listen(port, () => {
    try {
        console.log(`Server runnig on port ${port}`);
    } catch (error) {
        throw new Error(`Error : ${error}`);
    }
})