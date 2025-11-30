import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['Authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            new Error('Authorization header missing or malformed');
        }
        const accessToken = authHeader.split(' ')[1];

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token payload to request object
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Unauthorized" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.userType === 'admin') {
        next(); // User is admin, proceed to the next middleware/route handler
    } else {
        return res.status(403).json({ message: 'Admin access required' });
    }
};
const isOperator = (req, res, next) => {
    if (req.user && req.user.userType === 'operator') {
        next(); // User is admin, proceed to the next middleware/route handler
    } else {
        return res.status(403).json({ message: 'Operator access required' });
    }
};

export { verifyToken, isAdmin, isOperator };