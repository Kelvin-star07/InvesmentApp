import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({

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
  symbol: {
    type: String,
    required: true,
     default: "",
  },
  logo: {
    type: String,
    required: false,
    default: "",
  },
  assetTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssetTypes",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
},{
  timestamps: true,
  collection: "Assets",
});



const Assets = mongoose.model("Assets", AssetSchema);

export default Assets;