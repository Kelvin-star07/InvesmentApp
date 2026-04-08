import "./utils/LoadEnvConfig.js"; // Load environment variables from .env file
import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { projectRoot } from "./utils/Paths.js";
import authRoutes from "./routes/auth-router.js";
import dasboardRoutes from "./routes/dasboard-router.js";
import assetsTypeRoutes from "./routes/assets-type-router.js";
import assetsRoutes from "./routes/assets-router.js";
import session from "express-session"; // Import express-session for session management
import flash from "connect-flash"; // Import connect-flash for flash messages
import connectToMongoDB from "./utils/MongooseConnection.js"; // Import the function to connect to MongoDB
import { GetSection } from "./utils/helpers/Hbs/Section.js"; // Import the section helper
import { Equals } from "./utils/helpers/Hbs/Compare.js"; // Import the section helper
import multer from "multer"; // Import multer for file uploads
import { v4 as guidV4 } from "uuid";

const app = express();

//render engine
app.engine(
  "hbs",
  engine({
    layoutsDir: "views/layouts",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: {
      eq: Equals, // Register the equals helper
      section: GetSection, // Register the section helper
    },
  })
);

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded());
app.use(express.static(path.join(projectRoot, "public")));

// Set up multer for file uploads
const imageStorageForLogoAssets = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(projectRoot, "public", "assets", "images", "assets-logos")); // Set the destination for uploaded files
  },
  filename: (req, file, cb) => {
    const fileName = `${guidV4()}-${file.originalname}`; //
    cb(null, fileName);
  },
});

app.use(multer({ storage: imageStorageForLogoAssets }).single("Logo")); // Use multer to handle file uploads, expecting a field named "Logo"

app.use(session({
  secret: process.env.SECRET_KEY || "anything",
  resave: process.env.VALUE_RESAVE, 
  saveUninitialized: process.env.VALUE_SAVE_UNINITIALIZED
 })); // Use express-session for session management

app.use(flash()); // Use connect-flash for flash messages

app.use((req,res,next) => {

  if(!req.session){
    return next();
  }

  if(!req.session.user)
  {
     return  next();
  }

  if(!req.session.IsAuthenticated){ 
     return next();
  } // Ensure IsAuthenticated is defined in the session


  req.user = req.session.user; // Make user information available in req.user for easy access in routes and templates
   next();
});


 //local variable
 app.use((req,res,next) => {
  const errors = req.flash("errors");
  res.locals.user = req.user; // Make user information available in templates
  res.locals.hasUser = !!req.user; // Flag to indicate if a user is authenticated
  res.locals.errors = errors; // Make flash messages available in templates
  res.locals.hasErrors = errors.length > 0; // Flag to indicate if there are errors 
  const success = req.flash("success"); // Make flash messages available in templates
  res.locals.success = success; // Make flash messages available in templates
  res.locals.hasSuccess = success.length > 0; // Flag to indicate if there are success messages
  next();
 });


//routes
app.use(authRoutes);
app.use(dasboardRoutes);
app.use("/assets-type", assetsTypeRoutes);
app.use("/assets", assetsRoutes);

//404
app.use((req, res) => {
  if(req.session && req.session.IsAuthenticated){
      return res.status(404).render("404", { "page-title": "Page Not Found" });
  }
    
  res.status(404).render("404", { "page-title": "Page Not Found", layout: "anonimous-layout"});
});


try {

  
  await connectToMongoDB(); // Connect to MongoDB before starting the server
  app.listen(process.env.PORT || 5000);
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
} catch (err) {
  console.error("Error setting up the application:", err);
}
