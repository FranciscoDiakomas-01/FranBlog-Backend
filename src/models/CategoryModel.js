import db from "../db.js";
import path from 'node:path'
import dotenv from 'dotenv'
import fs from 'node:fs'

dotenv.config()
db.connect();

export default class CategoryPost {
  #querySql = "";
  #values = [];
  createCatgoryPost(category) {
    return new Promise((resolve, reject) => {
      if (category.title.length >= 2) {
        this.querySql ="insert into categoryPost (title, description , created_at , status) value(?);";
        let date = new Date().toLocaleDateString("pt-BR");
        this.#values = [
          category.title,
          category.description,
          category.created_at = date,
          category.status = 1,
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
      } else {
        reject("invalid title");
      }
    });
  }
  updateCategory(category) {
    return new Promise((resolve, reject) => {
      if (category.title.length >= 2 && !isNaN(category.id) && category.status) {
        this.querySql ="update categoryPost set title = ?, description = ? , status = ? where id = ? limit 1;";
        db.query(
          this.querySql,[category.title, category.description, category.status, category.id],(err, result) => {
            if (err) {
              if (err.message.includes("Duplicate entry")) {
                return reject("already exist");
              }
              reject(err.message);
            } else if (result.affectedRows <= 0) {
              reject("not found")
            }
            else {
              resolve("updated");
            }
          }
        );
      } else {
        reject("invalid name , status or id");
      }
    });
  }
  getCategoryDetails(categoryId) {
    return new Promise((resolve, reject) => {
      //total Post , Comment, APt E N
      if (!isNaN(categoryId)) {
        //pegando os dados da categoria
        this.querySql = "select * from categoryPost where id = ?;";
        db.query(this.querySql, [categoryId], (err, result) => {
          if (err) {
            reject(err);
          } else {
            const categoryData = result.length > 0 ? result : "not found";
            if (categoryData === "not found") {
              reject("not found");
            } else {
              //pegando o número de post dessa categoria
              this.querySql ="select count(*) as totalPost from post where categoryId = ?;";
              db.query(this.querySql, [categoryId], (err, result1) => {
                const totalCategory = result1[0].totalPost
                //pegando o total de post / categoria / estado / apto ou não apto
                console.log(totalCategory)
                    this.querySql ="select count(*) as total from post where categoryId = ? group by status ;";
                    db.query(this.querySql, [categoryId], (err, result) => {
                      if (err) {
                        reject(err);
                      } else {
                          const postPerCategory = result.length > 0 ? result[0] : 0;
                          const result2 = {
                            totalCategory: totalCategory,
                            postPerCategory: postPerCategory,
                            categoryData: categoryData,
                        };
                        resolve(result2);
                      }
                    });
              });
            }
          }
        });
      } else {
        reject("invalid categoryId");
      }
    });
  }
  getAllCategory() {
    return new Promise((resolve, reject) => {
      this.querySql = "select * from categoryPost;";
      db.query(this.querySql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.length > 0 ? result : "not found");
        }
      });
    });
  }
  deleteCategory(categoryId) {
    return new Promise((resolve, reject) => {
      if (!isNaN(categoryId)) {
        this.querySql = "delete from categoryPost where id = ? limit 1;";
        db.query(this.querySql, [categoryId], (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            if (result.affectedRows > 0) {
              //eliminar os arquivos dos post dessa categoria
              //deletando todos os post dessa categoria
              this.#querySql = "select cover from post where categoryId = ?";
              db.query(this.#querySql, [categoryId], (err, result) => {
                result.forEach(cover => {
                  console.log(cover)
                })
                fs.readdir(path.join(process.cwd() + '/src/uploads'), (err, files) => {
                  if (err) {
                    reject(err)
                  } else {
                    files.forEach(file => {
                      console.log(file)
                    })
                  }
                })
                  //deletando todos os post dessa categoria caso exista 
                  this.#querySql = "delete from post where categoryId = ?";
                  db.query(this.#querySql, [categoryId], (err, result) => {
                    if (err) {
                      reject(err.message);
                    }
                  });
              });
              resolve("deted")
            } else {
              reject("not found")
            }
          }
        });
      } else {
        reject("invalid categoryId");
      }
    });
  }
  countCategoryPost() {
    return new Promise((resolve, reject) => {
      this.querySql = "select count(*) as total from categoryPost;";
      db.query(this.querySql, (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result.total);
        }
      });
    });
  }
}