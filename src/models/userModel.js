import validator from "validator";
import db from "../db.js";
import fs from 'node:fs'
import path from "node:path";
import dotenv from "dotenv";
dotenv.config()
db.connect();


export default class User {

  #querySql = "";
  #values = [];

  createUser(user) {
    return new Promise((resolve, reject) => {
      if (validator.isEmail(user.email) && user.pass.length >= 6) {
        if (user.name.length <= 1) {
          reject("missing name , profile or status");
        } else {
          this.querySql ="insert into user(name, profile , status ,email , type , pass) value(?);";
          this.#values = [
            user.name,
            user.profile,
            user.status = "1",
            user.email,
            user.type = "0",
            user.pass
          ];
          db.query(this.querySql, [this.#values], (err, result) => {
            if (err) {
              if (err.message.includes("Duplicate entry")) {
                return reject("already exist");
              }
              reject(err.message);
            } else {
              resolve(result.insertId);
            }
          });
        }
      } else {
        reject("invalid email or not strong password");
      }
    });
  }
  updateUser(user) {
    return new Promise((resolve, reject) => {
      if (validator.isEmail(user.email) && user.pass.length >= 6 && !isNaN(user.id)) {
        if (user.name.length <= 1 || !user.status) {
          reject("missing name , profile or status");
        } else {
          //verificar se existe alguem no banco de dados com pass , id e email
          this.querySql = "select pass from user where id = ?;";
            db.query(this.querySql,[user?.id] ,(err, result) => {
                if (err) {
                  reject(err.message);
                } else {
                  if (result[0]?.pass == user?.pass) {
                    this.querySql = "update user set name = ?, profile = ? , status = ? , email = ? , pass = ? where id = ?;";
                    const pass = user.newPass ? user?.newPass : user?.pass
                    console.log(pass)
                      db.query(this.querySql,[user.name,user.profile,user.status,user.email,pass,user.id,],(err, result) => {
                          if (err) {
                            if (err.message.includes("Duplicate entry")) {
                              return reject("already exist");
                            }
                            reject(err.message);
                          } else {
                            resolve(result.affectedRows > 0 ? "updated" : result);
                          }
                        }
                      );
                  } else {
                    reject('user not found')
                  }
                }
              }
            );
          
        }
      } else {
        reject("invalid email or not strong password or userId");
      }
    });
  }
  getUserDetails(userId) {
    return new Promise((resolve, reject) => {
      if (!isNaN(userId) && userId > 0) {
        this.querySql = "select * from user where id = ?;";
        db.query(this.querySql,[userId], (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(result.length > 0 ? result : "not found");
          }
        });
      } else {
        reject("invalid userId");
      }
    });
  }
  getAllUsers() {
    return new Promise((resolve, reject) => {
      this.querySql = "select * from user;";
      db.query(this.querySql, (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result.length > 0 ? result : "not found");
        }
      });
    });
  }
  deleteUser(userId) {
    return new Promise((resolve, reject) => {
      if (!isNaN(userId)) {
        //selecionar no banco de dados o perfil do usuário para depois ser removido!
          this.querySql = "select profile , id from user where id = ? limit 1;";
          db.query(this.querySql, [userId], (err, result) => {
            if (err) {
              console.log(err)
            } else {
              //eliminar no banco de dados caso o seu perfil existe
              if (!result.length > 0) {
                reject("user not found")
              } else {
                //lendo a pasta de arquivos de uploads
                fs.readdir(path.join(process.cwd() + '/src/uploads'), (FileError, Files) => {
                  if (FileError){
                    reject("erro ao ler a pasta de uploads");
                  }
                  else {
                        Files.length > 0 && Files.forEach(file => {
                          const x = process.env.SERVER_PATH + file;
                          //eliminar o perfil do usário caso existir um perfil dele
                          if (x == result[0].profile) {
                            try {
                              fs.unlinkSync(path.join(process.cwd() + "/src/uploads/" + file));
                            } catch (error) {
                              console.log("error")
                            }
                            return
                        }
                    })
                  }
                })
                //eliminar no banco de dados
                  this.querySql = "delete from user where id = ? limit 1;";
                  db.query(this.querySql, [userId], (err, result) => {
                    if (err) {
                      reject(err.message);
                    } else {
                      try {
                        //escrever no arquivo de logging
                        const contetLogg = `\nRemoção de Usuário\nUserId : ${userId}\nDate : ${new Date().toLocaleDateString("pt-BR")}\n\n`;
                        fs.appendFileSync(path.join(process.cwd() + "/src/logger/userLoggin.txt"), contetLogg)
                        resolve(result.affectedRows > 0 ? "deleted" : "not found");
                      } catch (error) {
                        reject("logginError")
                      }
                    }
                  });
              }
            }
          });
      } else {
        reject("invalid userId");
      }
    });
  }
  countUser() {
    return new Promise((resolve, reject) => {
      this.querySql = "select count(*) as total from user;";
      db.query(this.querySql,  (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result.total);
        }
      });
    });
  }
}