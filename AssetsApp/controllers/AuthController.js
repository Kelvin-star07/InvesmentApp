import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../services/EmailServices.js";
import { promisify } from "util";
import { randomBytes } from "crypto";




export function GetLogin(req, res, next) {
  res.render("auth/login", { "page-title": "Login", layout: "anonimous-layout"});
}

export function GetRegister(req, res, next) {
  res.render("auth/user-register", { "page-title": "Register", layout: "anonimous-layout"});
}


export async  function PostRegister(req, res, next) {
  
  const { Name, Email, Password, ConfirmPassword } = req.body;
  try{

     if(Password !== ConfirmPassword){
         req.flash("errors", "Passwords do not match. Please try again.");
        return res.redirect("/user-register");
     }
     
     const user = await Users.findOne(
      { email: Email} );
    
     
      if(user){
        req.flash("errors", "Email already exists. Please choose a different email.");
        return res.redirect("/user-register");
      }
      
      
     const buffer = await promisify(randomBytes)(32);
     const activateToken = buffer.toString("hex");
       

     const hashedPassword = await bcrypt.hash(Password, 10);
     await Users.create({
        name: Name,
        email: Email,
        password: hashedPassword,
        isActive: false,
        ActivateToken: activateToken
     });

      await sendEmail({
      to: Email,
      subject: "Account registered succesfully",
      html: `<p>Dear ${Name},</p>
             <p>please click the link below to activate your account:</p>
             <a href="${process.env.APP_URL}/user-activate/${activateToken}">Activate Account</a>
             <p>If you did not register for this account, please ignore this email.</p>`,
    }) 
    
      req.flash("success", "Registration successful! You can now log in.");
      return res.redirect("/");
  }
  catch(err)
  { 
    req.flash("errors", "An error occurred during registration. Please try again.");
    console.log("Error in PostRegister:", err); 
  }
}



export async  function PostLogin(req, res, next) {
  
  const {Email, Password} = req.body;
  try{
      const user = await Users.findOne({email: Email});
         
      if(!user){
        req.flash("errors", "Invalid email or password. Please try again.");
        return res.redirect("/");
      }

      if(!user.isActive)
        {
          req.flash("errors", "Your account is not active. Please contact support.");
          return res.redirect("/");
        }

      const isPasswordValid = await bcrypt.compare(Password, user.password);

      if(!isPasswordValid){
        req.flash("errors", "Invalid email or password. Please try again.");
        return res.redirect("/");
      }

      req.session.IsAuthenticated = true; 
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email
      };


      req.session.save((err) => {
        if (err) {
          console.log("Error saving session:", err);
          req.flash("errors", "An error occurred while logging in. Please try again.");
          return res.redirect("/");
        }
        req.flash("success", "Login successful! Welcome back.");
        return res.redirect("/dasboard");
      });
  }
  catch(err)
  {
    console.log("Error in PostRegister:", err); 
  }
}




export async  function GetForgot(req, res, next) {
  
  res.render("auth/forgot-password", 
    { "page-title": "Forgot Password", 
      layout: "anonimous-layout"
    });
}



export async  function PostForgot(req, res, next) {
  
  const {Email} = req.body;
  try{
       
    const randomBytesAsync = promisify(randomBytes);
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");

    const user = await Users.findOne({email: Email});

    if(!user)
      {
        req.flash("errors", "If an account with that email exists, a password reset link has been sent.");
        return res.redirect("/forgot-password");
      }
    
      user.resetToken = token; 
      user.resetTokenExpiration = Date.now() + 3600000;
      const result = await user.save();

      if(!result){
        req.flash("errors", "An error occurred while processing your request. Please try again.");
        return res.redirect("/forgot-password");
      }

      //send email with reset link to user
      await sendEmail({
        to: Email,
        subject: "Password Reset Request",  
        html: `<p>Dear ${user.name},</p>
                <p>You requested a password reset. Click the link below to reset your password:</p> 
                <a href="${process.env.APP_URL}/reset-password/${token}">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>`,
      });

      req.flash("success", "If an account with that email exists, a password reset link has been sent.");
      return res.redirect("/");

  }
  catch(err)
  {
    req.flash("errors","An error occurred while processing your request. Please try again.  ");
    console.log("Error in PostRegister:", err); 
    return res.redirect("/forgot-password");
  }
}




export async  function GetReset(req, res, next) {
    
  const {token} = req.params;

   if(!token){
      req.flash("errors", "Invalid or expired token.");
      return res.redirect("/forgot-password");
   }

   try{
    
    const user = await Users.findOne(
      {resetToken: token},
      {resetTokenExpiration: {$gte: Date.now()} // Ensure the token has not expired
    });
      
      if(!user)
        { 
          req.flash("errors", "Invalid or expired token.");
          return res.redirect("/forgot-password");
        }


    res.render("auth/resset", 
    { "page-title": "Reset Password", 
      layout: "anonimous-layout",
      passwordToken: token,
      userId: user ? user.id : null
    }); 

          
   }catch(err){

      req.flash("errors", "An error occurred while processing your request. Please try again.");
      console.log("Error in GetReset:", err);
      return res.redirect("/forgot-password");
   }
}




export async  function PostReset(req, res, next) {
  
  const {passwordToken, Password,ConfirmPassword,userId} = req.body;
  try{
       
    if(Password !== ConfirmPassword)
      { 
        req.flash("errors", "Passwords do not match. Please try again.");
        return res.redirect(`/reset-password/${passwordToken}`);

      }
    
    const user = await Users.findOne(
      
        {id: userId},
        {resetToken: passwordToken},
        {resetTokenExpiration: {$gte: Date.now()}} // Ensure the token has not expired
      
    );


    const hashedPassword = await bcrypt.hash(Password, 10);

    if(!user)
      {
        req.flash("errors", "Invalid or expired token.");
        return res.redirect("/forgot-password");
      }
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;
      await user.save();
      

      req.flash("success", "Password reset successful! You can now log in with your new password.");
      return res.redirect("/");

  }
  catch(err)
  {
    req.flash("errors","An error occurred while processing your request. Please try again.  ");
    console.log("Error in PostRegister:", err); 
    return res.redirect("/forgot-password");
  }
}




export async function GetActivate(req, res, next) {
  const {token} = req.params;

  if(!token){
    req.flash("errors", "Invalid activation token.");
    return res.redirect("/");
  }

  try
  {
    const user = await Users.findOne({ActivateToken: token});

    if(!user)
      {
        req.flash("errors", "Invalid activation token. xxx");
        return res.redirect("/");
      }

    user.isActive = true;
    user.ActivateToken = null;
    await user.save();

    req.flash("success", "Account activated successfully! You can now log in.");
    return res.redirect("/");
  }
  catch(err)
  {
    req.flash("errors", "An error occurred while activating your account. Please try again.");
    console.log("Error in GetActivate:", err);
    return res.redirect("/");
  }
}


export  function Logout(req, res, next) {
  
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
      req.flash("errors", "An error occurred while logging out. Please try again.");
      return res.redirect("/dasboard");
    }
  });

  res.redirect("/");
}
