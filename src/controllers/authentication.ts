import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers'

export const login = async(req: express.Request, res: express.Response) => {
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({'error':'Missing fields'});
        }

        const user = await getUserByEmail(email).select('+authentication.password +authentication.salt');

        if(!user){
            return res.status(400).send('User does not exist');
        }

        const expectedHash = authentication(user.authentication?.salt!, password);

        if(user.authentication?.password !== expectedHash){
            return res.status(403).json({'Error':'Wrong password'});
        }

        const salt = random()
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('sessionToken', user.authentication.sessionToken, {domain: 'localhost', path: '/', httpOnly: true, secure: true, sameSite: true});

        return res.status(200).json({'message':'success',user}).end();

    }catch(error) {
        console.log(error)
        return res.status(500).send(error);
    }
}


export const register = async (req: express.Request, res: express.Response) => {
    try{
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({'Error':'Missing fields'});
        }
        // const user = await createUser({username, email, authentication: {password}});
        // return res.status(201).send(user);

        const existingUser = await getUserByEmail(email);

        if(existingUser){
            return res.status(400).json({'Error':'User already exists'});
        }

        const salt = random()

        const user = await createUser({
            username,
            email,
            authentication: {
                salt,
                password: authentication(salt, password)
        }});
        return res.status(201).json(user).end();

    }catch(e){
        console.error(e);
        return res.status(500).send(e);
    }
}