import express, { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../helper/helper';
import { AttemptDataSource } from '../database/database';
import { AttemptEntity } from '../database/attemptEntity';
import Config from '../dataStructs/config';
import { resourceUsage } from 'process';

const router = express.Router();
const config = Config.get()

router.get('/' //, verifyJwt
                        , async (req, res) => {

    const uid = 1 //res.locals['user-id'];

    const limit : number = req.query.limit !== undefined ? Number(req.query.limit as string) : 10;
    const offset: number = req.query.offset !== undefined ? Number(req.query.offset as string) : 0;

    try {
        const result = await AttemptDataSource.getRepository(AttemptEntity)
            .createQueryBuilder('user')
            .select(['user.attemptId', 'user.question_id', 'user.language', 'user.code', 'user.attempt_date'])
            .where(`user.user_id = :id`, { id: Number(uid)})
            .orderBy(`user.date`, "DESC")
            .limit(limit).offset(offset).getMany();
    
        console.log(result)
    
        res.status(200).send({message : 'success', data: result});
    } catch (error) {
        console.error(error)
        res.status(500).send({message: 'Unable to process request at this time.'})
    }

})

router.get('/sample' //, verifyJwt
                , async (req, res) => { 

    const uid = 1//res.locals['user-id'];
    const quid = '2'
    const rid = '5'
    const language = 'python3'
    const code = 'lorem ipsum111' 

    const query = await AttemptDataSource.createQueryBuilder()
        .insert().into(AttemptEntity)
        .values({
            userId : uid,
            questionId : quid,
            roomId : rid,
            language : language,
            code: code,
            // date: new Date(Date.now())
        }).orUpdate(
            ['code', 'attempt_date'],
            ['user_id', 'room_id']
        ).execute();

    res.status(200).json({message : 'Done'})

    // const result = await AttemptDataSource.getRepository(AttemptEntity).save()
})


router.get('/:aid' //, verifyJwt
                        , async (req, res) => {

    const uid = 1 //res.locals['user-id'];
    req.params.aid

    const limit : number = req.query.limit !== undefined ? Number(req.query.limit as string) : 10;
    const offset: number = req.query.offset !== undefined ? Number(req.query.offset as string) : 0;

    try {
        const result = await AttemptDataSource.getRepository(AttemptEntity)
            .createQueryBuilder('user')
            .select(['user.attemptId', 'user.question_id', 'user.language', 'user.code', 'user.attempt_date'])
            .where(`user.user_id = :id`, { id: Number(uid)})
            .orderBy(`user.date`, "DESC")
            .limit(limit).offset(offset).getMany();
    
        console.log(result)
    
        res.status(200).send({message : 'success', data: result});
    } catch (error) {
        console.error(error)
        res.status(500).send({message: 'Unable to process request at this time.'})
    }

})



export default router;