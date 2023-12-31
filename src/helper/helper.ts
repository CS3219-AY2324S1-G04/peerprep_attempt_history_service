/**
 * @file Helper file for api.
 */
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/naming-convention
import Config from '../dataStructs/config';

const config = Config.get();

/**
 * Middleman that verifies if user's access-token is legitimate,
 * extracts information from JWT and
 * save the user-id into response locals as user-id.
 * @param req - The request received.
 * @param res - The response to send.
 * @param next - Part of Express middleman.
 */
export async function verifyJwt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // No Token case
  if (!req.cookies['access-token']) {
    res.status(401).json({
      message: 'No access-token',
    });
  } else {
    // No Pub key case (shouldn't hit here but not impossible)
    if (process.env.JwtKey == undefined) {
      try {
        await getJWTKey();
      } catch (error) {
        res.status(500).json({
          message: 'Unable to process request at this time',
        });
        return;
      }
    }

    const PUBLIC_KEY = process.env.JwtKey || '';
    const ACCESS_TOKEN = req.cookies['access-token'];

    if (PUBLIC_KEY == '') {
      throw new Error('Error retrieving JWT validator');
    }

    try {
      const decoded = jwt.verify(ACCESS_TOKEN, PUBLIC_KEY);
      if (decoded != undefined && typeof decoded !== 'string') {
        res.locals['user-id'] = decoded['user-id'];
        next();
      } else {
        console.error('Decode returned undefined or is a string');
        res.status(500).send('Unable to process JWT token.');
      }
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        res.status(401).send('Unable to verify JWT token.');
      } else if (error.name === 'TokenExpiredError') {
        res.status(401).send('JWT Token expired.');
      } else {
        console.error('Server Error', error);
        res.status(500).send('Server Error. Unable to process JWT token.');
      }
    }
  }
}

/**
 * Retrieve public-key from user-service to verify JWT tokens.
 * Stores it in environment.
 */
export async function getJWTKey() {
  const url =
    config.userServiceURL + '/' + 'user-service/access-token-public-key';
  try {
    const keyCall = await axios.get(url);
    process.env.JwtKey = keyCall.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.status == 404) {
        throw new Error('Unable to reach user service or resource turned 404.');
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
}
