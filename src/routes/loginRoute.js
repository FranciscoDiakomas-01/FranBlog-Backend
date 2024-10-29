import { Router } from 'express'
import logginController from '../controllers/loginController.js';

const LoginRoute = Router()
LoginRoute.post("/login", logginController.login)
LoginRoute.get("/logout");

export default LoginRoute