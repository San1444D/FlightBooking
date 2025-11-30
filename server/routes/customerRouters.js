import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import CustomerController from "../controllers/customerController.js";

const customerRouter = Router();


customerRouter.get("/", (req, res) => {
    res.send("Customer Routes");
});

customerRouter.post('/book-ticket', verifyToken, CustomerController.bookTicket);
customerRouter.put('/cancel-ticket/:id', verifyToken, CustomerController.cancelTicket);


export default customerRouter;