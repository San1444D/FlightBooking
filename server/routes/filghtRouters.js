import { Router } from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import FlightController from "../controllers/flightController.js";

const flightRouter = Router();



flightRouter.get("/", (req, res) => {
    res.send("Flight Routes");
});

flightRouter.post('/add-flight', FlightController.addFlight)
flightRouter.put('/update-flight', FlightController.updateFlight)
flightRouter.get('/fetch-flights', FlightController.fetchFlight)
flightRouter.get('/fetch-flight/:id', FlightController.fetchFlightById)
flightRouter.get('/fetch-bookings',verifyToken, FlightController.fetchBookings)

export default flightRouter;