import express from 'express'
import { getAllUsers } from '../controllers/users/users'

export default(router: express.Router) => {
    router.get('/users', getAllUsers);
}