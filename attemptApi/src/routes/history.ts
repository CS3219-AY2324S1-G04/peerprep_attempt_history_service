import express, { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../helper/helper';
import { AttemptDataSource } from '../database/database';
import { AttemptEntity } from '../database/attemptEntity';

const router = express.Router();

router.get('/', verifyJwt, async (req, res) => {
    const limit : number = Number(req.query.limit as string);
    const offset : number = Number(req.query.offset as string);

    const result = await AttemptDataSource.getRepository(AttemptEntity)
        .createQueryBuilder('attempt')
        .where("")


})

export default router;