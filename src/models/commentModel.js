import db from "../db.js";
db.connect();
export default class Comment {
  #querySql = "";
  #values = [];
  createComment(comment) {
    return new Promise((resolve, reject) => {
      if (comment.userId && comment.postId) {
        //verificando se o usuario existe
        this.#querySql = "select id , status from user where id = ?;";
        db.query(this.#querySql, [comment.userId], (err, result) => {
          if (err) {
            reject(err);
          }

          if (result[0]?.id == comment?.userId && result[0]?.status == "1") {
            //verificando se o post existe
            this.#querySql = "select id , status from post where id = ?;";
            db.query(this.#querySql, [comment.postId], (err, result) => {
              if (err) {
                reject(err.message);
              } else if (result[0]?.id && result[0]?.status == 1) {
                //se existir o id e o status do post for 1 entao  cadastra o comment
                this.querySql =
                  "insert into comment (userId, postId , comment , status , created_at) value(?);";
                this.#values = [
                  comment.userId,
                  comment.postId,
                  comment.comment,
                  (comment.status = "0"),
                  (comment.created_at = new Date().toLocaleDateString("pt-BR")),
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
              } else if (result[0]?.id && result[0].status == 0) {
                reject("not allowed");
              } else {
                reject("post not found");
              }
            });
          } else {
            reject("user not found");
          }
        });
      } else {
        reject("invalid postId or UserId");
      }
    });
  }
  toggleCheckPost(commentId, status) {
    return new Promise((resolve, reject) => {
      if ((commentId && status) || status == "1" || status == "0") {
        //alterando o status de um post
        this.#querySql = "update comment set status = ? where id = ? limit 1;";
        db.query(
          this.#querySql,
          [(status = status == "1" ? "0" : "1"), commentId],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(
                result.affectedRows > 0 ? "updated" : "comment not found"
              );
            }
          }
        );
      }
    });
  }
  updateConentComment(commentId, comment) {
    return new Promise((resolve, reject) => {
      if (comment.length > 0) {
        //alterando o comment de um post
        this.#querySql = "update comment set comment = ? where id = ? limit 1;";
        db.query(this.#querySql, [comment, commentId], (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(result.affectedRows > 0 ? "updated" : "comment not found");
          }
        });
      } else {
        reject("no comment");
      }
    });
  }
  getComment(commentId) {
    return new Promise((resolve, reject) => {
      if (!commentId || isNaN(commentId)) {
        reject("not comment id");
      }
      this.querySql =
        "select comment.id as commentId , comment.comment as commentText, comment.postId as CommentPostId , comment.userId as CommentUserId , comment.status as CommentStatus , comment.created_at as CommentDate , user.name as UserName , user.email as UserEmail from comment join user on comment.userId = user.id where comment.id = ?;";
      db.query(this.querySql, [commentId], (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result.length > 0 ? result : "not found");
        }
      });
    });
  }
  getAllComment() {
    return new Promise((resolve, reject) => {
      this.querySql =
        "select comment.id as commentId , comment.comment as commentText, comment.postId as CommentPostId , comment.userId as CommentUserId , comment.status as CommentStatus , comment.created_at as CommentDate , user.name as UserName , user.email as UserEmail from comment join user on comment.userId = user.id and comment.status = '1';";
      db.query(this.querySql, (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result.length > 0 ? result : "not found");
        }
      });
    });
  }
  deleteComment(commentId) {
    return new Promise((resolve, reject) => {
      if (typeof commentId == "number" && commentId > 0) {
        this.querySql = "delete from comment where id = ? limit 1;";
        db.query(this.querySql, [commentId], (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(result.affectedRows > 0 ? "deleted" : "not found");
          }
        });
      } else {
        reject("invalid commentId");
      }
    });
  }
  countComment() {
    return new Promise((resolve, reject) => {
      this.querySql = "select count(*) as total from comment;";
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