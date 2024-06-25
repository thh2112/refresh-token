import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '../providers/JwtProvider'
import { ACCESS_TOKEN_SECRET_SIGNATURE } from '../controllers/userController';


const isAuthorized = (req, res, next) => {
    // get token from cookie
    const accessToken = req.cookies.accessToken

    console.log('accc', accessToken);
    // // get token from headers
    // const accessToken = req.headers.authorization

    try {
        const decodeAccessToken = JwtProvider.verifyToken(accessToken, ACCESS_TOKEN_SECRET_SIGNATURE);

        req.user = decodeAccessToken;
        next();
    } catch (error) {
        const isExpireToken = error.message?.includes('jwt expired');
        if (isExpireToken) {
            res.status(StatusCodes.GONE).json({ message: "Need to refresh token" })
            return
        }

        res.status(StatusCodes.GONE).json({ message: "Unauthorization" })
    }
}

export const authMiddleware = {
    isAuthorized
}