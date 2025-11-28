import mongoose from "mongoose";

const mongoURI = process.env.MONGODB_URL || "mongodb://localhost:27017/flightBookingDB";
export const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        // process.exit(1);
    }
};

// Note: Make sure to install the 'dotenv' package and create a .env file with MONGODB_URL variable for this to work.
export default connectDB;