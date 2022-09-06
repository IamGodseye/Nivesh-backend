import User from "../models/user";
import jwt from 'jsonwebtoken'

export const requireSignin = (req, res, next) => {
    const token =
        req.body.token || req.headers.token;

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).exec();
        if (!user.role.includes("Admin")) {
            return res.sendStatus(403);
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
    }
};
