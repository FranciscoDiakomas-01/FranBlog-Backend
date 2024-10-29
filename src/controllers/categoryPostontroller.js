import CategoryPost from "../models/CategoryModel.js";

const Category = new CategoryPost();
const CategoryPostController = {
  register(req, res) {
    const { title, description } = req.body;
    if (!title || title.length <= 1) {
      return res.status(400).json({
        error: "invalid title",
      });
    } else {
      const body = {
        title,
        description,
      };
      Category.createCatgoryPost(body)
        .then((data) => {
          return res.status(201).json({
            sucess: "created",
          });
        })
        .catch((err) => {
          res.status(400).json({
            err,
          });
        });
    }
  },
  update(req, res) {
    const { title, description, status  , id} = req.body;
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
      Category.updateCategory(body)
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
    Category.getAllCategory()
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
    Category.getCategoryDetails(id)
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
    if (isNaN(id)) {
      return res.status(400).json({
        error: "invalid category Id",
      });
    }
    Category.deleteCategory(id)
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
};

export default CategoryPostController;
