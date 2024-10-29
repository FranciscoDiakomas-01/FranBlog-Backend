import validator from "validator";
import db from "../db.js";
db.connect();

export default class Post {
  #querySql = "";
  #values = [];
  createPost(post) {
    return new Promise((resolve, reject) => {
      if (!post.title.length <= 1 && typeof post.categoryId == "number") {
        //verificando se existe uma categoria com esse id

        this.#querySql = "select id from categoryPost where id = ?";
        db.query(this.#querySql, [post.categoryId], (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result[0]?.id) {
              this.querySql =
                "insert into post(title, description , categoryId ,cover , created_at , status) value(?);";
              this.#values = [
                post.title,
                post.description,
                post.categoryId,
                post.cover,
                (post.created_at = new Date().toLocaleDateString()),
                (post.status = "1"),
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
              reject("category not found");
            }
          }
        });
      } else {
        reject("invalid title , categoryId  or status");
      }
    });
  }
  updatePost(post) {
    return new Promise((resolve, reject) => {
      if (
        !post.title.length <= 1 &&
        typeof post.categoryId == "number" &&
        typeof post.id == "number" &&
        post.status
      ) {
        //verificando se existe uma categoria com esse id
        this.#querySql = "select id from categoryPost where id = ?";
        db.query(this.#querySql, [post.categoryId], (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result[0]?.id) {
              this.querySql =
                "update post set title = ?, description = ? , categoryId = ? , cover = ? , status = ? where id = ? limit 1;";
              db.query(
                this.querySql,
                [
                  post.title,
                  post.description,
                  post.categoryId,
                  post.cover,
                  post.status,
                  post.id,
                ],
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
              reject("category not found");
            }
          }
        });
      } else {
        reject("invalid title , categoryId  or status");
      }
    });
  }
  getPostDetails(postId) {
    return new Promise((resolve, reject) => {
      if (typeof postId == "number" && postId > 0) {
        this.querySql =
          "select post.id as postId ,post.title as postTitle , post.cover , post.description as text, post.created_at as date , post.status , categorypost.title CategoryTitle , categorypost.id CategoryId from post join categorypost on post.id = categorypost.id where post.categoryId = ? limit 1;";
        db.query(this.querySql, [postId], (err, result) => {
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
  getAllPost() {
    return new Promise((resolve, reject) => {
      this.querySql =
        "select post.id as postId ,post.title as postTitle , post.cover , post.description as text, post.created_at as date , post.status , categorypost.title CategoryTitle , categorypost.id CategoryId from post join categorypost on post.categoryId = categorypost.id;";
      db.query(this.querySql, (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result.length > 0 ? result : "not found");
        }
      });
    });
  }
  deletePost(postId) {
    return new Promise((resolve, reject) => {
      if (typeof postId == "number" && postId > 0) {
        this.querySql = "delete from post where id = ? limit 1;";
        db.query(this.querySql, [postId], (err, result) => {
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
  countPost() {
    return new Promise((resolve, reject) => {
        this.querySql = "select count(*) as total from post;";
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