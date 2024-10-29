import db from "../db.js"
import validator from 'validator'
import { CreateToken } from "../middlewares/jwt.js"

db.connect()
const logginController = {
    login(req, res) {
        const { email, pass } = req.body
        if (req.body) {
            try {
                //validação do emaile da pass
                if (validator.isEmail(email) && pass.length >= 6) {
                  const sqlQuery = "select * from user where email = ? and pass = ? limit 1;";
                  db.query(sqlQuery, [email, pass], async (err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      //verificar se existe o usuário
                      if (result.length > 0) {
                        const token = await CreateToken(result[0].id);
                        res.status(200).json({
                          message: "logged sucessly",
                            token,
                          data : result[0]
                        });
                      } else {
                        return res.status(401).json({
                          error: "user not found",
                        });
                      }
                    }
                  });
                } 
            } catch (error) {
                return res.status(400).json({
                error: "invalid credentials",
            });
            }
            
        } else {
            req.status(400).json({
                error : 'not body'
            })
        }
    }
}

export default logginController