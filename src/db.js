import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()


const db = mysql.createConnection({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
});


db.connect((error) => {
    if (error) {
        throw new Error(error.message)
    } else {
        console.log('connected sucessly')
    }
})

export default db
