import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    flight: {
        type: Schema.Types.ObjectId,
        ref: 'Flight',
        required: true,
    },
    flightName: { type: String, required: true },
    flightId: { type: String },
    departure: { type: String },
    destination: { type: String },
    email: { type: String },
    mobile: { type: String },
    seats: { type: String },
    passengers: [{
        name: { type: String },
        age: { type: Number },
    }],
    totalPrice: { type: Number },
    bookingDate: { type: Date, default: Date.now },
    journeyDate: { type: Date },
    journeyTime: { type: String },
    seatClass: {
        type: String,
        enum: ['economy', 'premium-economy', 'business', 'first-class'],
    },
    bookingStatus: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'confirmed'
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

const Booking = model("Booking", bookingSchema);

export default Booking;