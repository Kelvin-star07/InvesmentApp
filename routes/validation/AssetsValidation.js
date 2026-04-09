import {body,param} from "express-validator";

export const AssetCreateValidation = [
    body("Name").trim().notEmpty().withMessage("Name is required").escape(),
    body("Description").notEmpty().withMessage("Description is required").trim().escape(),
    body("Symbol").notEmpty().withMessage("Symbol is required").isUppercase().withMessage("Symbol must be uppercase").trim().escape(),
    body("AssetsTypeId").notEmpty().withMessage("Asset Type ID is required").trim().escape(),
    body("Logo").trim().notEmpty().withMessage("Logo is required")
                 .custom((value, { req }) => {
                  if (!req.file) {
                    throw new Error("Logo file is required");
                     }})

]

export const AssetEditValidation = [
    body("Name").trim().notEmpty().withMessage("Name is required").escape(),
    body("Description").trim().escape(),
    body("Symbol").notEmpty().withMessage("Symbol is required").isUppercase().withMessage("Symbol must be uppercase").trim().escape(),
    body("AssetsTypeId").notEmpty().withMessage("Asset Type ID is required").trim().escape(),
    body("AssetsId").notEmpty().withMessage("Asset ID is required").trim().escape()
]


export const AssetIdValidation = [
    param("assetsId").trim().notEmpty().withMessage("Asset Type ID is required").escape()
]


export const AssetDeleteValidation = [
    body("AssetsId").trim().notEmpty().withMessage("Asset ID is required").escape()
]
