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
        reject("invalid title or status");
      }
    });
  }
  updateCategory(category) {
    return new Promise((resolve, reject) => {
      if (category.title.length > 2) {
        this.querySql ="update categoryPost set title = ?, description = ? , status = ? where id = ? limit 1;";
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
              resolve(result.affectedRows > 0 ? 'updated' : 'not found');
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
        this.querySql = "select * from categoryPost where id = ?;";
        db.query(this.querySql, [categoryId], (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(result.length > 0 ? result : "not found");
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
          reject(err.message);
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
}


let category = new CategoryPost()

let data = {
  title: 'Dev Web',
  description: 'Desencolvimento de Software',
  status: '0',
  id : 1
}

category.getUserDetails(1).then(result => {
  console.log(result)
}).catch(err => {
  console.log(err)
})