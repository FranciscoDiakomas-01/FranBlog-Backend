import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export async function CreateToken(userId) {
    if (userId) {
        const token = jwt.sign(userId, process.env.JWT)
        return token
    } else {
        return 'No userI'
    }
}