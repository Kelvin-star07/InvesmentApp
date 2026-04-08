import {body,param} from "express-validator";

export const postRegisterValidation = [
    body("Email").isEmail().withMessage("Invalid email address")
                           .notEmpty().withMessage("email is required").normalizeEmail().escape(),
   body("Password").trim().notEmpty().withMessage("password is required").isLength({ min:8 }).withMessage("Password must be at least 8 characters long")
         .custom((value, { req }) => {
             if (value !== req.body.ConfirmPassword) {
                 throw new Error("Password confirmation does not match password");
             }
                return true;
         }).matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
           .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
           .matches(/[0-9]/).withMessage("Password must contain at least one number")
           .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character (@, $, !, %, *, ?, &)").escape(),

     body("ConfirmPassword").trim().notEmpty().withMessage("ConfirmPassword is riquired"),      
]


export const postLoginValidation = [
  body("Email").trim().isEmail().withMessage("Invalid email address")
                           .notEmpty().withMessage("email is required").normalizeEmail().escape(),
   body("Password").trim().notEmpty().withMessage("password is required").escape(),

]

export const postForgotPasswordValidation = [
  body("Email").trim().isEmail().withMessage("Invalid email address")
                           .notEmpty().withMessage("email is required").normalizeEmail().escape(),
]

export const getResetPasswordValidation = [
  param("token").trim().notEmpty().withMessage("Reset token is required").escape()
]



export const postResetPasswordValidation = [
  body("Password").trim().notEmpty().withMessage("password is required").isLength({ min:8 }).withMessage("Password must be at least 8 characters long")
         .custom((value, { req }) => {
                if (value !== req.body.ConfirmPassword) {
                    throw new Error("Password confirmation does not match password");
                } return true; })
]


export const getActivateValidation = [
  param("token").trim().notEmpty().withMessage("Activation token is required").escape()
]


