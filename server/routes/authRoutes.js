import { Router } from "express";
import AuthController from "../controllers/authController.js";

const authRouter = Router();


authRouter.post("/login", AuthController.loginController);
authRouter.post("/signup", AuthController.signupController);
authRouter.get("/refresh-token", AuthController.refreshTokenController);
authRouter.post("/logout", AuthController.logoutController);
// authRouter.get("/", (req, res) => {
//     res.send("Auth Routes");
// });

export default authRouter;