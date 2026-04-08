import mongoose from "mongoose";


const AssetTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "",

  },
  description: {
    type: String,
    required: false,
     default: "",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  }
},{
  timestamps: true,
  collection: "AssetTypes",
});

const AssetTypes = mongoose.model("AssetTypes", AssetTypeSchema);

export default AssetTypes;

