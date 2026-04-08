import {body,param} from "express-validator";

export const AssetTypeCreateValidation = [
    body("Name").trim().notEmpty().withMessage("Name is required").escape(),
    body("Description").trim().escape()
]

export const AssetTypeEditValidation = [
    body("Name").trim().notEmpty().withMessage("Name is required").escape(),
    body("Description").trim().escape(),
    body("AssetsTypeId").trim().notEmpty().withMessage("Asset Type ID is required").escape()
]

export const AssetTypeIdValidation = [
    param("assetsId").trim().notEmpty().withMessage("Asset Type ID is required").escape()
]

export const AssetTypeDeleteValidation = [
    body("AssetsTypeId").trim().notEmpty().withMessage("Asset Type ID is required").escape()
]
