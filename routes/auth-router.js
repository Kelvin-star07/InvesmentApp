import express from 'express';
import {GetLogin,GetRegister,PostRegister,PostLogin,GetForgot,PostForgot,GetReset,PostReset,GetActivate,Logout} from '../controllers/AuthController.js';
import isAuthForLogin from '../middlewares/isAuthForLogin.js';
const router = express.Router();
import { postRegisterValidation, postLoginValidation, postForgotPasswordValidation, getResetPasswordValidation, postResetPasswordValidation, getActivateValidation } from './validation/authValidation.js';
import {handleValidationErrors} from '../middlewares/handleValidation.js';

// Login route
router.get('/', IsAuthForLogin, GetLogin);
router.post('/login', IsAuthForLogin, postLoginValidation, handleValidationErrors("/"), PostLogin);

router.get('/user-register', isAuthForLogin, GetRegister);
router.post('/user-register', isAuthForLogin, postRegisterValidation, handleValidationErrors("/user-register"), PostRegister);


router.get('/forgot-password', isAuthForLogin, GetForgot);
router.post('/forgot-password', isAuthForLogin,postForgotPasswordValidation, handleValidationErrors("/forgot-password"), PostForgot);

router.get(`/reset-password/:token`, isAuthForLogin,getResetPasswordValidation, handleValidationErrors("/"),GetReset);
router.post(`/reset-password`, isAuthForLogin,postResetPasswordValidation, handleValidationErrors((req) => `/reset-password/:${req.params.PasswordToken}`), PostReset);

router.get('/user-activate/:token', isAuthForLogin, getActivateValidation, handleValidationErrors("/"), GetActivate);


router.get('/logout',  Logout);
export default router;
