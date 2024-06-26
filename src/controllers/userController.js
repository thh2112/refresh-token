import { StatusCodes } from 'http-status-codes';
import ms from 'ms';
import { JwtProvider } from '../providers/JwtProvider';

const MOCK_DATABASE = {
  USER: {
    ID: '12345678',
    EMAIL: 'huyhoangtest@gmail',
    PASSWORD: 'Admin@12345',
  },
};

export const ACCESS_TOKEN_SECRET_SIGNATURE = 'KBgJwUETt4HeVD05WaXXI9V3JnwCVP';
export const REFRESH_TOKEN_SECRET_SIGNATURE = 'fcCjhnpeopVn2Hg1jG75MUi62051yL';

const login = async (req, res) => {
  try {
    const { email } = req.body;

    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email,
    };

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      5,
    );

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days',
    );

    res.status(StatusCodes.OK).json({
      userInfo,
      refreshToken,
      accessToken,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const logout = async (req, res) => {
  try {
    // Do something
    res.status(StatusCodes.OK).json({ message: 'Logout API success!' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken;
    const decodeRefreshToken = await JwtProvider.verifyToken(
      refreshToken,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      );
    
    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL,
    };

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      5
    );

    res.status(StatusCodes.OK).json({ accessToken });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export const userController = {
  login,
  logout,
  refreshToken,
};
