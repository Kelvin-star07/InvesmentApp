
/**
 * Middleware to check if the user is authenticated before allowing access to certain routes
 * If the user is not authenticated, they will be redirected to the home page with an error message
 */

export default function IsAuth(req, res, next)
{  
    if(req.session.IsAuthenticated && req.session.user){
       return next();
    }
    req.flash("errors", "You must be logged in to access this page.");
    res.redirect("/");

}