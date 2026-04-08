
/**
 * Middleware to check if the user is already authenticated before allowing access to login and registration routes
 * If the user is authenticated, they will be redirected to the dashboard page
 */

export default function IsAuthForLogin(req, res, next)
{  
    if(req.session.IsAuthenticated){
      res.redirect("/dasboard");
    }
   
    next();

}