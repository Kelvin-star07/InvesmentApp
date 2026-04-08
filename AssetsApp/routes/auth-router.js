import express from 'express';
import {GetLogin,GetRegister,PostRegister,PostLogin,GetForgot,PostForgot,GetReset,PostReset,GetActivate,Logout} from '../controllers/AuthController.js';
import IsAuthForLogin from '../middlewares/isAuthForLogin.js';
const router = express.Router();
import { postRegisterValidation, postLoginValidation, postForgotPasswordValidation, getResetPasswordValidation, postResetPasswordValidation, getActivateValidation } from './validation/authValidation.js';
import {handleValidationErrors} from '../middlewares/handleValidation.js';

// Login route
router.get('/', IsAuthForLogin, GetLogin);
router.post('/login', IsAuthForLogin, postLoginValidation, handleValidationErrors("/"), PostLogin);

router.get('/user-register', IsAuthForLogin, GetRegister);
router.post('/user-register', IsAuthForLogin, postRegisterValidation, handleValidationErrors("/user-register"), PostRegister);


router.get('/forgot-password', IsAuthForLogin, GetForgot);
router.post('/forgot-password', IsAuthForLogin,postForgotPasswordValidation, handleValidationErrors("/forgot-password"), PostForgot);

router.get(`/reset-password/:token`, IsAuthForLogin,getResetPasswordValidation, handleValidationErrors("/"),GetReset);
router.post(`/reset-password`, IsAuthForLogin,postResetPasswordValidation, handleValidationErrors((req) => `/reset-password/:${req.params.PasswordToken}`), PostReset);

router.get('/user-activate/:token', IsAuthForLogin, getActivateValidation, handleValidationErrors("/"), GetActivate);


router.get('/logout',  Logout);
export default router;
