import { Router } from "express";

const router = Router();


router.get("/", (req, res) => {
    res.send("Customer Routes");
});

export default router;