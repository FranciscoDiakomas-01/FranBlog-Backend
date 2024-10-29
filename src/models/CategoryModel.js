import db from "../db.js";
db.connect();
export default class CategoryPost {
  #querySql = "";
  #values = [];
  createCatgoryPost(category) {
    return new Promise((resolve, reject) => {
      if (category.title.length > 2) {
        this.querySql =
          "insert into categoryPost (title, description , created_at , status) value(?);";
        let date = new Date().toLocaleDateString("pt-BR");
        this.#values = [
          category.title,
          category.description,
          (category.created_at = date),
          (category.status = 1),
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
        reject("invalid title or status");
      }
    });
  }
  updateCategory(category) {
    return new Promise((resolve, reject) => {
      if (category.title.length > 2) {
        this.querySql =
          "update categoryPost set title = ?, description = ? , status = ? where id = ? limit 1;";
        db.query(
          this.querySql,
          [category.title, category.description, category.status, category.id],
          (err, result) => {
            if (err) {
              if (err.message.includes("Duplicate entry")) {
                return reject("already exist");
              }
              reject(err.message);
            } else {
              resolve(result.affectedRows > 0 ? "updated" : "not found");
            }
          }
        );
      } else {
        reject("invalid name");
      }
    });
  }
  getCategoryDetails(categoryId) {
    return new Promise((resolve, reject) => {
      //total Post , Comment, APt E N
      if (typeof categoryId == "number" && categoryId > 0) {
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
              this.querySql =
                "select count(*) as totalPost from post where categoryId = ?;";
              db.query(this.querySql, [categoryId], (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  const totalCategory =
                    result.length > 0 ? result[0].total : "not found";
                  if (totalCategory === "not found") {
                    reject("not found post");
                  } else {
                    //pegando o total de post / categoria / estado / apto ou não apto
                    this.querySql =
                      "select count(*) as total from post where categoryId = ? group by status ;";
                    db.query(this.querySql, [categoryId], (err, result) => {
                      if (err) {
                        reject(err);
                      } else {
                        const postPerCategory =
                          result.length > 0 ? result[0] : "not found";
                        if (postPerCategory == "not found") {
                          reject("not found");
                        } else {
                          const result = {
                            totalCategory: totalCategory,
                            postPerCategory: postPerCategory,
                            categoryData: categoryData,
                          };
                          resolve(result);
                        }
                      }
                    });
                  }
                }
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
      if (typeof categoryId == "number" && categoryId > 0) {
        this.querySql = "delete from categoryPost where id = ? limit 1;";
        db.query(this.querySql, [categoryId], (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(result.affectedRows > 0 ? "deleted" : "not found");
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