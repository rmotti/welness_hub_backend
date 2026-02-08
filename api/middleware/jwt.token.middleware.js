import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {   
    try{const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized!' });
        }
        req.userId = decoded.id;
        next();
    });
}
    catch (error) {
        console.error('Error in verifying token:', error);
        return res.status(500).send({ message: 'Internal server error!' });
    }
}

export default verifyToken;