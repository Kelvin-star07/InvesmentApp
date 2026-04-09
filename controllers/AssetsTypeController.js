import AssetTypes from "../models/AssetsTypeModel.js";
import { sendEmail } from "../services/EmailServices.js";
import { validationResult } from "express-validator";


export async function GetIndex(req, res, next) {
  try {
    
    const result = await AssetTypes.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .lean(); // Sort by createdAt in descending order


    const assetsTypes = result || [];

    res.render("assets-type/index", {
      assetsTypesList: assetsTypes,
      hasAssetsTypes: assetsTypes.length > 0,
      "page-title": "Assets type list",
    });
  } catch (err) {
    req.flash("errors","Error fetching assets types. Please try again later.");
    console.error("Error fetching assets types:", err);
  }
}

export function GetCreate(req, res, next) {
  res.render("assets-type/save", {
    editMode: false,
    "page-title": "New Assets type",
  });
}


export async function PostCreate(req, res, next) {

  const { Name, Description } = req.body; // Destructure the request body (Destructuring)

 
  try {
    await AssetTypes.create({
      name: Name,
      description: Description,
      userId: req.user.id
    });

    await sendEmail({
      to: "kervindiazramirez@gmail.com",
      subject: "New Assets Type Created",
      html: `<p>A new assets type has been created:</p>
             <p><strong>Name:</strong> ${Name}</p>
             <p><strong>Description:</strong> ${Description}</p>`,
    })

    req.flash("success", "Assets type created successfully.");
    return res.redirect("/assets-type/index");
  } catch (err) {
    req.flash("errors","Error creating assets type. Please try again later.");
    console.error("Error creating assets type:", err);
  }
}


export async function GetEdit(req, res, next) {
   
  const id = req.params.assetsId;

  try {
     
     const result = await AssetTypes.findOne({ _id: id, userId: req.user.id })
     .lean(); // Use lean() to get a plain JavaScript object 
  

    if (!result) {
      return res.redirect("/assets-type/index");
    }

    const assetsType = result || null;

    res.render("assets-type/save", {
      editMode: true,
      assetsType: assetsType,
      "page-title": `Edit Assets type ${assetsType.name}`,
    });
  } catch (err) {
    req.flash("errors","Error fetching assets type. Please try again later.");
    console.error("Error fetching assets type:", err);
  }
}



export async function PostEdit(req, res, next) {
    
  const name = req.body.Name;
  const description = req.body.Description;
  const id = req.body.AssetsTypeId;

  try {
    const result = await AssetTypes.
    findOne({ _id: id, userId: req.user.id }).lean(); // Use lean() to get a plain JavaScript object

    
    if (!result) {
      return res.redirect("/assets-type/index");
    }

    // Update the assets type
    await AssetTypes.findByIdAndUpdate(id, { name: name, description: description, userId: req.user.id },{ new: true }).lean(); // Use lean() to get a plain JavaScript object
  

    req.flash("success", "Assets type updated successfully.");
    return res.redirect("/assets-type/index");
  } catch (err) {
    req.flash("errors","Error updating assets type. Please try again later.");
    console.error("Error in PostEdit:", err);
  }
}

export async function Delete(req, res, next) {

  const id = req.body.AssetsTypeId;

  try {
    const result = await AssetTypes.findOne({ _id: id, userId: req.user.id })
    .lean(); // Use lean() to get a plain JavaScript object

    if (!result) {
      return res.redirect("/assets-type/index");
    }

    // Delete the assets type
    await AssetTypes.deleteOne({ _id: id, userId: req.user.id });

    req.flash("success", "Assets type deleted successfully.");
    return res.redirect("/assets-type/index");
    
  } catch (err) {
    req.flash("errors","Error deleting assets type. Please try again later.");
    console.error("Error in Delete:", err);
  }
}
