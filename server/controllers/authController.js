import jwt from 'jsonwebtoken';

const loginController = async (req, res) => {
    const { email, password, userType } = req.body;
    userData = await User.findOne({email});
    if (!userData) {
        return res.status(404).json({ message: 'User not found' });
    }

}

const tokenController = async (req, res) => {

}

const Auth = {
    loginController,
    tokenController,
};

export default Auth;