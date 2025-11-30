import User from "../models/userSchema.js";
import { getOrSetCache } from "../middlewares/redisHelper.js";

const Approve = async (req, res) => {
    const { id } = req.body;
    try {
        const user = await User.findById(id);
        user.approval = 'approved';
        await user.save();
        res.json({ message: 'approved!' })
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

const Reject = async (req, res) => {
    const { id } = req.body;
    try {

        const user = await User.findById(id);
        user.approval = 'rejected';
        await user.save();
        res.json({ message: 'rejected!' })
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

const fetchUser = async (req, res) => {
    const id = await req.params.id;
    // console.log(req.params.id)
    try {
        const user = await User.findById(req.params.id, { password: 0 });
        // console.log(user);
        res.json(user);

    } catch (err) {
        console.log(err);
    }
}

const fetchAllUsers = async (req, res) => {

    try {
        const users = await User.find();
        res.json(users);

    } catch (err) {
        res.status(500).json({ message: 'error occured' });
    }
}

const AdminController = { Approve, Reject, fetchAllUsers, fetchUser }

export default AdminController;