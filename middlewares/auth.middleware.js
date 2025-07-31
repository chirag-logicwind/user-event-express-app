import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.headers.token    
    if(!token)
        return res.status(401).json({ message: 'Access denied' });
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);        
        req.user = decode;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};