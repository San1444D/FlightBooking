import e from "express";
import { Schema, model } from "mongoose";

const flightSchema = new Schema({

    // flightName: { type: String, required: true },
    // flightId: { type: String, required: true, unique: true },
    // orgin: { type: String },
    // destination: { type: String },
    // departureTime: { type: String },
    // arrivalTime: { type: String },
    // duration: { type: String },
    // avaliableSeats: [{
    //     economy: { type: Number },
    //     business: { type: Number },
    //     first: { type: Number },
    // }],
    // totalSeats: [{
    //     economy: { type: Number },
    //     business: { type: Number },
    //     first: { type: Number },
    // }],
    // basePrice: {
    //     economy: { type: Number },
    //     business: { type: Number },
    //     first: { type: Number },
    // },
    // flightDate: { type: Date },
    flightName: { type: String, required: true },
    flightId: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    basePrice: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

const Flight = model("Flight", flightSchema);

export default Flight;