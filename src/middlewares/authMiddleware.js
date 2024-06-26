import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '../providers/JwtProvider'
import { ACCESS_TOKEN_SECRET_SIGNATURE } from '../controllers/userController';


const isAuthorized = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization
        if (!accessToken) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorization" })
            return
        }    

        const token = accessToken?.substring('Bearer '.length)
        const decodeAccessToken = await JwtProvider.verifyToken(token, ACCESS_TOKEN_SECRET_SIGNATURE);
        req.user = decodeAccessToken;
        next();
    } catch (error) {
        const isExpireToken = error.message?.includes('jwt expired');
        if (isExpireToken) {
            res.status(StatusCodes.GONE).json({ message: "Need to refresh token" })
            return
        }

        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorization" })
    }
}

export const authMiddleware = {
    isAuthorized
}