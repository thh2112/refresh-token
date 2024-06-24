import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { JwtProvider } from '../providers/JwtProvider'

const MOCK_DATABASE = {
  USER: {
    ID: '12345678',
    EMAIL: 'huyhoangtest@gmail',
    PASSWORD: 'Admin@12345'
  }
}

const ACCESS_TOKEN_SECRET_SIGNATURE = 'KBgJwUETt4HeVD05WaXXI9V3JnwCVP'
const REFRESH_TOKEN_SECRET_SIGNATURE = 'fcCjhnpeopVn2Hg1jG75MUi62051yL'

const login = async (req, res) => {
  try {
    const { email } = req.body;

    const useInfo = {
      id: MOCK_DATABASE.USER.ID,
      email
    }

    const accessToken = await JwtProvider.generateToken(
      useInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      ms('1h')
    )

    const refreshToken = await JwtProvider.generateToken(
      useInfo,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      ms('30 days')
    )
    
    // save to cookie
    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   maxAge: ms('30 days')
    // })

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   maxAge: ms('30 days')
    // })

    res.status(StatusCodes.OK).json({ 
      ...useInfo,
      refreshToken,
      accessToken
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    // Do something
    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // get token from cookies
    const refreshTokenFromCookies = req.cookies?.refreshToken;

    
    const decodeRefreshToken = await JwtProvider.verifyToken(
      refreshTokenFromCookies,
      REFRESH_TOKEN_SECRET_SIGNATURE
    )
    
    const useInfo = { 
      id: decodeRefreshToken.id,
      email: decodeRefreshToken.email
    }

    const accessToken = await JwtProvider.generateToken(
      useInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      ms('1h')
    )

    // send by cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('30 days')
    })

    // get token from body
    // const refreshTokenFromBody = req.body?.refreshToken;
    // const decodeRefreshToken = await JwtProvider.verifyToken(
    //   refreshTokenFromBody,
    //   REFRESH_TOKEN_SECRET_SIGNATURE
    // )

    // const accessToken = await JwtProvider.generateToken(
    //   useInfo,
    //   ACCESS_TOKEN_SECRET_SIGNATURE,
    //   ms('1h')
    // )

    // res.status(StatusCodes.OK).json({ accessToken })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const userController = {
  login,
  logout,
  refreshToken
}
