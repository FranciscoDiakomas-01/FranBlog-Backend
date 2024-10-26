import validator from "validator";
import db from "../db.js";
db.connect();
export default class User {

  #querySql = "";
  #values = [];
  createUser(user) {
    return new Promise((resolve, reject) => {
      if (
        validator.isEmail(user.email) &&
        validator.isStrongPassword(user.pass)
      ) {
        if (user.name.length <= 1 || user.profile.length <= 0 || !user.status) {
          reject("missing name , profile or status");
        } else {
          this.querySql =
            "insert into user(name, profile , status ,email , type) value(?);";
          this.#values = [
            user.name,
            user.profile,
            user.status,
            user.email,
            user.type,
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
      if (
        validator.isEmail(user.email) &&
        validator.isStrongPassword(user.pass) &&typeof user.id ===  'number' && user.id > 0
      ) {
        if (user.name.length <= 1 || user.profile.length <= 0 || !user.status) {
          reject("missing name , profile or status");
        } else {
          this.querySql = "update user set name = ?, profile = ? , status = ? , email = ? , type = ? where id = ?;";
          db.query(this.querySql , [user.name ,user.profile, user.status, user.email, user.type, user.id,],
            (err, result) => {
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
        }
      } else {
        reject("invalid email or not strong password or userId");
      }
    });
  }
  getUserDetails(userId) {
    return new Promise((resolve, reject) => {
      if (typeof userId == "number" && userId > 0) {
        this.querySql = "select * from user;";
        db.query(this.querySql, (err, result) => {
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
      if (typeof userId == "number" && userId > 0) {
        this.querySql = "delete from user where id = ? limit 1;";
        db.query(this.querySql, [userId], (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(result.affectedRows > 0 ? "deleted" : "not found");
          }
        });
      } else {
        reject("invalid userId");
      }
    });
  }
}