import { Router } from "express";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";

const adminRouter = Router();

// adminRouter.use(verifyToken)
// adminRouter.use(isAdmin)

adminRouter.get("/", (req, res) => {
    res.send("Admin Routes");
});

import AdminController from "../controllers/adminController.js";



adminRouter.post('/approve-operator', AdminController.Approve)
adminRouter.post('/reject-operator', AdminController.Reject)
adminRouter.get('/fetch-user/:id', AdminController.fetchUser)
adminRouter.get('/fetch-users', AdminController.fetchAllUsers)



export default adminRouter;