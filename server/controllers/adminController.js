import User from "../models/userSchema.js";
import { getOrSetCache } from "../middlewares/redisHelper.js";

const Approve = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Missing user id" });

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.approval = "approved";
        await user.save();
        return res.json({ message: "approved!" });
    } catch (err) {
        console.error("Approve error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

const Reject = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Missing user id" });

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.approval = "rejected";
        await user.save();
        return res.json({ message: "rejected!" });
    } catch (err) {
        console.error("Reject error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

const fetchUser = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Missing user id" });

    try {
        const user = await User.findById(id).select("-password").lean();
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json(user);
    } catch (err) {
        console.error("fetchUser error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// paginated fetch all users (supports ?page=0&limit=100)
const fetchAllUsers = async (req, res) => {
    try {
        const page = Math.max(0, parseInt(req.query.page || "0", 10));
        const limit = Math.max(1, parseInt(req.query.limit || "100", 10));
        const cacheKey = `users:page:${page}:limit:${limit}`;

        const users = await getOrSetCache(cacheKey, async () => {
            return await User.find({}, { password: 0 })
                .skip(page * limit)
                .limit(limit)
                .lean();
        }, 60); // cache for 60 seconds

        return res.json(users);
    } catch (err) {
        console.error("fetchAllUsers error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

const AdminController = { Approve, Reject, fetchAllUsers, fetchUser };

export default AdminController;