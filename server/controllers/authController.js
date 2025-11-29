import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import bcrypt from 'bcrypt';
import { getOrSetCache } from '../middlewares/redisHelper.js';


const PASSWORD_SECRET = process.env.PASSWORD_SECRET || 'default_password_secret';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

const COOKIE_EXPIRY = parseInt(process.env.COOKIE_EXPIRY) || 7 * 24 * 60 * 60 * 1000; // ms
const SECURE_FLAG = process.env.NODE_ENV === 'production';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: SECURE_FLAG, // secure only in production
    sameSite: SECURE_FLAG ? 'None' : 'Lax', // None + Secure for cross-site in prod; Lax for local dev
    path: '/', // ensure path is aligned when clearing cookie
    maxAge: COOKIE_EXPIRY,
};

const tokenGenerator = async (decoded, res, refreshToken = false) => {
    const payload = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        userType: decoded.userType,
    };
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

    // guard: decoded may not have exp (when decoded is a user doc)
    const hasExp = typeof decoded?.exp === 'number';
    const willExpireSoon = hasExp && (decoded.exp * 1000 - Date.now() < 24 * 60 * 60 * 1000);

    if (willExpireSoon || refreshToken == true) {
        const newRefreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
        await res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
    }
    return newAccessToken;
}

const loginController = async (req, res) => {
    const { email, password, userType } = req.body;
    const cacheKey = `user:${email}:${userType}`;
    console.log(cacheKey)

    const userData = await getOrSetCache(cacheKey, async () => {
        return await User.findOne({ email, userType, isDeleted: false },
            { email: 1, username: 1, password: 1, userType: 1 }).lean();;
    });

    if (!userData) {
        return res.status(404).json({ message: 'User not found' });
    } else {
        const isPasswordValid = await bcrypt.compare(password + PASSWORD_SECRET, userData.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: 'Invalid password' });
        }
        if (userData.userType !== userType) {
            return res.status(403).json({ message: `User type mismatch, Please Login as ${userData.userType}` });
        }

        // Return shallow copy without password
        const safeUserData = { ...userData };
        delete safeUserData.password;
        const accessToken = await tokenGenerator(userData, res, true);
        return res.status(200).json({ accessToken, userData: safeUserData });

    }
};

const signupController = async (req, res) => {
    const { username, email, password, userType } = req.body;
    const cachesKey = `user:${email}:${userType}`;
    const existingUser = await getOrSetCache(cachesKey, async () => {
        return await User.findOne({ email, userType, isDeleted: false });
    },
        10 * 60
    );
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password + PASSWORD_SECRET, SALT_ROUNDS);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });
    if (userType === 'operator' || userType === 'admin') {
        newUser.isApproval = false;
    }
    await newUser.save();
    return res.status(201).json({ message: 'User created successfully' });
}

const getMe = async (req, res) => {
    const { refreshToken } = req.cookies ? req.cookies : {};
    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token missing' });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        const accessToken = await tokenGenerator(decoded, res);
        console.log(decoded)
        return res.status(200).json({ accessToken, userData: decoded });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

}
const refreshTokenController = async (req, res) => {
    const { refreshToken } = req.cookies ? req.cookies : {};
    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token missing' });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        // const tokenPayload = {
        //     id: decoded.id,
        //     username: decoded.username,
        //     email: decoded.email,
        //     userType: decoded.userType,
        // };
        // const newAccessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        // if (decoded.exp * 1000 - Date.now() < 24 * 60 * 60 * 1000 || refreshToken == true) {
        //     const newRefreshToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
        //     res.cookie('refreshToken', newRefreshToken, {
        //         httpOnly: true,
        //         secure: process.env.NODE_ENV === 'production',
        //         sameSite: 'Strict',
        //         maxAge: COOKIE_EXPIRY,
        //     });
        // }

        const accessToken = await tokenGenerator(decoded, res);
        return res.status(200).json({ accessToken });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
}


const logoutController = async (req, res) => {
    try {
        // Clear cookie using the same settings used when setting it
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        return res.status(200).json({ message: "Logout Success" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout Failed" });
    }
};


const AuthController = {
    loginController,
    signupController,
    refreshTokenController,
    getMe,
    logoutController,
};

export default AuthController;