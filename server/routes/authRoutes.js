import { Router } from "express";
import AuthController from "../controllers/authController.js";

const authRouter = Router();


authRouter.post("/login", AuthController.loginController);
authRouter.post("/signup", AuthController.signupController);
authRouter.get("/refresh-token", AuthController.refreshTokenController);
authRouter.get("/logout", AuthController.logoutController);
authRouter.get('/get-me', AuthController.getMe)
// authRouter.get("/", (req, res) => {
//     res.send("Auth Routes");
// });

export default authRouter;