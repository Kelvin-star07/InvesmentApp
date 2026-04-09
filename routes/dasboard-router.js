import express from 'express';
import {GetIndex} from '../controllers/DasboardController.js';
import IsAuth from '../middlewares/IsAuth.js';

const router = express.Router();

// Dashboard route
router.get('/dasboard',IsAuth,GetIndex);


export default router;
