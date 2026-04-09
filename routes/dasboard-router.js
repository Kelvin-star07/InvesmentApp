import express from 'express';
import {GetIndex} from '../controllers/DasboardController.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

// Dashboard route
router.get('/dasboard',isAuth,GetIndex);


export default router;
