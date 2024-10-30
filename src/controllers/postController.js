import PostModel from '../models/PostMdel.js'
import path from 'node:path'
import fs from 'node:fs'
import dotenv from 'dotenv'
dotenv.config()
const Post = new PostModel();
const PostController = {
  
    register(req, res) {
      const body = {
        title: req.body.title,
        description: req.body.description,
        categoryId: req.body.categoryId,
        file: process.env.SERVER_PATH + req.file.filename,
      };
      Post.createPost(body)
        .then((data) => {
          return res.status(201).json({
            sucess: "created",
          });
        })
        .catch((err) => {
          //caso dê um erro elimine o arquvivo do perfil do usuário
          fs.unlinkSync(path.join(process.cwd() + "/src/uploads/" + req.file.filename))
          res.status(400).json({
            err,
          });
        });
    
  },
  update(req, res) {
    const { title, description, status, id } = req.body;
    if (!title || title.length <= 1) {
      return res.status(400).json({
        error: "invalid title",
      });
    } else {
      const body = {
        title,
        description,
        status,
        id,
      };
      Post.updatePost(body)
        .then((data) => {
          return res.status(201).json({
            sucess: data,
          });
        })
        .catch((err) => {
          res.status(400).json({
            err,
          });
        });
    }
  },
  get(req, res) {
    Post.getAllPost()
      .then((data) => {
        return res.status(201).json({
          data,
        });
      })
      .catch((err) => {
        res.status(400).json({
          err,
        });
      });
  },
  getOne(req, res) {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({
        error: "invalid category Id",
      });
    }
    Post.getPostDetails(id)
      .then((data) => {
        return res.status(201).json({
          data,
        });
      })
      .catch((err) => {
        res.status(400).json({
          err,
        });
      });
  },
  deleteOne(req, res) {
    const id = req.params.id;
    //primeiro selecionar no banco de dados o post e depois eliminar o arquivo na pasta uploads
    if (isNaN(id)) {
      return res.status(400).json({
        error: "invalid category Id",
      });
    }
    Post.getPostDetails(id).then(response => {
      const postFile = response[0].cover
      fs.readdir(path.join(process.cwd() + '/src/uploads'), (errorFiles, files) => {
        if (errorFiles) {
          console.log(errorFiles)
          return
        } else {
          files.forEach(file => {
            //eliminando o arquivo que bate com o perfill do usuário
            if (postFile == process.env.SERVER_PATH + file) {
              fs.unlinkSync(path.join(process.cwd() + '/src/uploads/' + file))
              //deletar no banco de dados
              Post.deletePost(id)
                .then((data) => {
                  return res.status(201).json({
                    data,
                  });
                })
                .catch((err) => {
                  res.status(400).json({
                    err,
                  });
                });
            }
          })
        }
      })
    }).catch(err => {
        res.status(400).json({
        err
      })
    })
  },
};

export default PostController;
