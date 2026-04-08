import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    Trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,  
  },
  resetToken: {
    type: String,
    required: false,
    default: null,
  },
  resetTokenExpiration: {
    type: Date,
    required: false,
    default: null,
  },
  ActivateToken: {
    type: String,
    required: false,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
    required: true,
  }
  },{
    timestamps: true,
    collection: "Users",
  });


  const Users = mongoose.model("Users", UserSchema);


export default Users;


