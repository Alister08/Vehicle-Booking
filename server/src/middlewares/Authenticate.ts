import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// const SECRET_KEY = "supersecretkey"; // Use an environment variable in production

//Define a custom request type that includes userId
interface AuthRequest extends Request {
    userId?: string;
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // const token = req.headers.authorization?.split(" ")[1];

    // if (!token) {
    //     res.status(403).json({ message: "No token provided" });
    //     return; //Ensure function exits after sending a response
    // }

    // jwt.verify(token, SECRET_KEY, (err, decoded: any) => {
    //     if (err) {
    //         res.status(401).json({ message: "Invalid token" });
    //         return; //Ensure function exits after sending a response
    //     }
    // //     req.userId = decoded.userId; //Attach userId to request
        next(); //Call next() properly
    // });
};

export default verifyToken;
