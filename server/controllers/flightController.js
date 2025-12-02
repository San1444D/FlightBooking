import Flight from "../models/filghtSchema.js";
import Booking from "../models/bookingSchema.js"
import { getOrSetCache } from "../middlewares/redisHelper.js";

const addFlight = async (req, res) => {
    const { flightName, flightId, origin, destination, departureTime,
        arrivalTime, basePrice, totalSeats } = req.body;
    try {

        const flight = new Flight({
            flightName, flightId, origin, destination,
            departureTime, arrivalTime, basePrice, totalSeats
        });
        const newFlight = flight.save();

        res.json({ message: 'flight added' });

    } catch (err) {
        console.log(err);
    }
}

const updateFlight = async (req, res) => {
    const { _id, flightName, flightId, origin, destination,
        departureTime, arrivalTime, basePrice, totalSeats } = req.body;
    try {

        const flight = await Flight.findById(_id)

        flight.flightName = flightName;
        flight.flightId = flightId;
        flight.origin = origin;
        flight.destination = destination;
        flight.departureTime = departureTime;
        flight.arrivalTime = arrivalTime;
        flight.basePrice = basePrice;
        flight.totalSeats = totalSeats;

        const newFlight = flight.save();

        res.json({ message: 'flight updated' });

    } catch (err) {
        console.log(err);
    }
}

const fetchFlight = async (req, res) => {

    try {
        const cacheId = `flights_all`;
        const flights = getOrSetCache(cacheId, async () => { return await Flight.find(); }, 30)
        res.json(flights);
    } catch (err) {
        console.log(err);
    }
}

const fetchFlightById = async (req, res) => {
    const id = await req.params.id;
    // console.log(req.params.id)
    try {
        const flight = await Flight.findById(req.params.id);
        // console.log(flight);
        res.json(flight);
    } catch (err) {
        console.log(err);
    }
}

const fetchBookings = async (req, res) => {

    try {
        const userId = req.user?._id || req.user?.id;
        const userType = req.user.userType;
        const cacheId = `bookings_${userType}_${userId}`;
        let bookings = [];
        if (userType === 'admin') {
            bookings = await getOrSetCache(cacheId, async () => {
                return await Booking.find({});
            }, 30) // Cache for 60 seconds;
        } else if (userType === 'operator') {
            bookings = await getOrSetCache(cacheId, async () => {
                return await Booking.find({ flightName: req.user.username });
            }, 30) // Cache for 60 seconds;
        } else if (userType === 'customer') {
            bookings = await getOrSetCache(cacheId, async () => {
                return await Booking.find({ user: userId });
            }, 30) // Cache for 60 seconds;
        }
        return res.json(bookings);

    } catch (err) {
        console.log(err);
    }
}

const FlightController = { addFlight, updateFlight, fetchFlight, fetchBookings, fetchFlightById };

export default FlightController;