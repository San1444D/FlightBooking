import { Router } from "express";
import { isAdmin } from "../middlewares/authMiddleware.js";

const adminRouter = Router();

adminRouter.use(isAdmin)

adminRouter.get("/", (req, res) => {
    res.send("Admin Routes");
});



export default adminRouter;