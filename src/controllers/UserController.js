import User from "../models/userModel.js";
import { configDotenv } from "dotenv";
configDotenv();
const user = new User();

const userController = {

  async register(req, res) {
    const userBody = {
      name: req.body.name,
      email: req.body.email,
      profile: req.file? process.env.SERVER_PATH + req?.file?.filename: process.env.SERVER_PATH + "src/uploads/default.png",
      pass: req.body.pass,
    };
    user
      .createUser(userBody)
      .then((result) => {return res.status(201).json({
          msg: "created",
          id: result,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          error: err,
        });
      });
  },
  async update(req, res) {
    const id = req.params.id;
      if (!isNaN(id)) {
        const userBody = {
            name: req.body.name,
            email: req.body.email,
            profile: req.file? process.env.SERVER_PATH + req?.file?.filename: process.env.SERVER_PATH + "default.png",
            pass: req.body.pass,
            id: id,
          status: req.body.status,
          newPass : req.newPass
        };
    user.updateUser(userBody).then((result) => {
        return res.status(200).json({
            msg: "updated"
        });
    }).catch((err) => {
        console.log(err)
        return res.status(400).json({
            error: err,
        });
    });
    } else {
        return res.status(400).json({
        error: "userId invalid",
    });
    }
  },
  async getOne(req, res) {
    const id = req.params?.id;
    let result = await user.getUserDetails(id);
    if (result == "not found") {
      res.status(404);
    } else {
      res.status(200);
    }
    res.json(result);
  },
  async get(req, res) {
    let result = await user.getAllUsers();
    if (Array.isArray(result)) {
      return res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  },
  async deleteOne(req, res) {
    const id = req.params?.id;
    user
      .deleteUser(id)
      .then((result) => {
        return res.status(result == "not found" ? 404 : 200).json(result);
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  },
};

export default userController;
