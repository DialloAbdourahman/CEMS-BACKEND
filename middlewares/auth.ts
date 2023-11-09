import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token and decode it.
    const accessToken: any = req
      .header('Authorization')
      ?.replace('Bearer ', '');
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    // Decode the accessToken
    if (decoded.data.type !== 'admin') {
      return res.status(401).json({ message: 'You are not an admin.' });
    }

    // Attach the user's data to the request object.
    req.user = { ...decoded.data };

    // Run the next funtions so that the next function can be executed.
    next();
  } catch (error: any) {
    if (
      error?.name === 'TokenExpiredError' &&
      error?.message === 'jwt expired'
    ) {
      res.status(401).json({ message: 'Token has expired.', error });
      return;
    }
    res.status(401).json({ message: 'Please authenticate.', error });
  }
};

const authUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token and decode it.
    const accessToken: any = req
      .header('Authorization')
      ?.replace('Bearer ', '');
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    // Decode the accessToken
    if (decoded.data.type !== 'user') {
      return res.status(401).json({ message: 'You are not a user.' });
    }

    // Attach the user's data to the request object.
    req.user = { ...decoded.data };

    // Run the next funtions so that the next function can be executed.
    next();
  } catch (error: any) {
    if (
      error?.name === 'TokenExpiredError' &&
      error?.message === 'jwt expired'
    ) {
      res.status(401).json({ message: 'Token has expired.', error });
      return;
    }
    res.status(401).json({ message: 'Please authenticate.', error });
  }
};

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token and decode it.
    const accessToken: any = req
      .header('Authorization')
      ?.replace('Bearer ', '');
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    // Attach the user's data to the request object.
    req.user = { ...decoded.data };

    // Run the next funtions so that the next function can be executed.
    next();
  } catch (error: any) {
    if (
      error?.name === 'TokenExpiredError' &&
      error?.message === 'jwt expired'
    ) {
      res.status(401).json({ message: 'Token has expired.', error });
      return;
    }
    res.status(401).json({ message: 'Please authenticate.', error });
  }
};

module.exports = {
  authAdmin,
  authUser,
  auth,
};
