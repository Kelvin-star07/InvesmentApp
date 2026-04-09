import mongoose from "mongoose";


const connectToMongoDB = async () => {
   
  try{
  const mogoURI = process.env.MongoDB_URI || `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

   await mongoose.connect(mogoURI);
    console.log("Connected to MongoDB successfully!");
  }catch(err){
    
    console.error("Error connecting to MongoDB:", err);

  }
};


export default connectToMongoDB;
