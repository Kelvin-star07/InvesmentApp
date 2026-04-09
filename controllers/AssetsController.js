import Assets from "../models/AssetsModel.js";
import AssetTypes from "../models/AssetsTypeModel.js";
import path from "path";
import fs from "fs";
import { projectRoot } from "../utils/Paths.js";

export async function GetIndex(req, res, next) {
  try {

    const assets = await Assets.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .populate("assetTypeId")
    .lean(); // Sort by createdAt in descending order
     
  
    res.render("assets/index", {
      assetsList: assets,
      hasAssets: assets.length > 0,
      "page-title": "Assets type list",
    });
  } catch (err) {
    req.flash("errors","Error fetching assets. Please try again later.");
    console.error("Error fetching assets:", err);
  }
}



export async function GetCreate(req, res, next) {
  try {

    const assetType = await AssetTypes.find({ userId: req.user.id })
    .lean(); // Fetch asset types for the current user
    const assetsTypes = assetType || [];

    res.render("assets/save", {
      editMode: false,
      assetsTypesList: assetsTypes,
      hasAssetsTypes: assetsTypes.length > 0,
      "page-title": "New Assets",
    });

    req.flash("success", "Asset created successfully.");
  } catch (err) {
    req.flash("errors","Error fetching asset types. Please try again later.");
    console.error("Error fetching assets types:", err);
  }
}



export async function PostCreate(req, res, next) {
  try {
    const { Name, Description, Symbol, AssetsTypeId } = req.body; // Destructure the request body (Destructuring)
    const Logo = req.file;
    const LogoPath = "\\" + path.relative("public", Logo.path); // Get the relative path of the uploaded file

    await Assets.create({
      name: Name,
      description: Description,
      logo: LogoPath,
      symbol: Symbol,
      assetTypeId: AssetsTypeId,
      userId: req.user.id
    });


    req.flash("success", "Asset created successfully.");
    res.redirect("/assets/index");
  } catch (err) {
    req.flash("errors","Error creating asset. Please try again later.");
    console.error("Error creating asset:", err);
  }
}


export async function GetEdit(req, res, next) {
  try {

    const id = req.params.assetsId;
    const asset = await Assets.findOne({ _id: id, userId: req.user.id })
    .lean();

    if (!asset) {
      return res.redirect("/assets/index");
    }


    const assetsTypes = await AssetTypes.find({ userId: req.user.id }).lean();
    console.log("Asset to edit:", asset); 
    res.render("assets/save", {
      editMode: true,
      asset,
      assetsTypesList: assetsTypes,
      hasAssetsTypes: assetsTypes.length > 0,
      "page-title": `Edit Asset ${asset.name}`,
    });
  } catch (err) {
    req.flash("errors","Error fetching asset or asset types. Please try again later.");
    console.error("Error fetching asset or asset types:", err);
  }
}



export async function PostEdit(req, res, next) {
  try {
    const { Name, Description, AssetsTypeId, Symbol, AssetsId } = req.body;
    const Logo = req.file;
    let LogoPath = null;

    const asset = await Assets.findOne(
      { _id: AssetsId, userId: req.user.id}
    );

    if (!asset) {
      return res.redirect("/assets/index");
    }


    if (Logo) {
      LogoPath = "\\" + path.relative("public", Logo.path); // Get the relative path of the uploaded file
    } else {
      LogoPath = asset.logo; // Keep the existing logo if no new file is uploaded
    }


    await Assets.findByIdAndUpdate(
      AssetsId,
      {
        name: Name,
        description: Description,
        logo: LogoPath,
        symbol: Symbol,
        assetTypeId: AssetsTypeId,
        userId: req.user.id
      },{
        new: true, // Return the updated document
      });


    req.flash("success", "Asset updated successfully.");
    res.redirect("/assets/index");
  } catch (err) {
    req.flash("errors","Error updating asset. Please try again later.");
    console.error("Error updating asset:", err);
  }
}


export async function Delete(req, res, next) {
  try {
    const id = req.body.AssetsId;

    const asset = await Assets.findOne({ _id: id, userId: req.user.id});


    if (!asset) {
      return res.redirect("/assets/index");
    }

    // If the asset has a logo, delete the file from the filesystem
    if (asset.logo) {
      const logoPath = path.join(projectRoot, "public", asset.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath); // Delete the logo file
      }
    }

    await Assets.deleteOne({ _id: id, userId: req.user.id});

    req.flash("success", "Asset deleted successfully.");
    res.redirect("/assets/index");
  } catch (err) {
    req.flash("errors","Error deleting asset. Please try again later.");
    console.error("Error deleting asset:", err);
  }
}
