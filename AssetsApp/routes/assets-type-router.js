import express from "express";
import {
  GetIndex,
  GetCreate,
  PostCreate,
  Delete,
  GetEdit,
  PostEdit
} from "../controllers/AssetsTypeController.js";
import isAuth from "../middlewares/IsAuth.js";
import { handleValidationErrors } from "../middlewares/handleValidation.js";
import { AssetTypeCreateValidation,  AssetTypeEditValidation,AssetTypeIdValidation, AssetTypeDeleteValidation } from "./validation/AssetTypeValidation.js";

const router = express.Router();

// Assets type routes
router.get("/index", isAuth, GetIndex);

router.get("/create", isAuth,GetCreate);

router.post("/create", isAuth,
  AssetTypeCreateValidation,
  handleValidationErrors("/assets-type/create"),
  PostCreate);



router.get("/edit/:assetsId", isAuth,
  AssetTypeIdValidation,
  handleValidationErrors(),
  GetEdit);



router.post("/edit", isAuth, 
  AssetTypeEditValidation,
  handleValidationErrors((req) => `/assets-type/edit/${req.body.AssetsTypeId}`),
  PostEdit);


router.post("/delete", isAuth,
  AssetTypeDeleteValidation,
  handleValidationErrors("/assets-type/index"), 
  Delete);

export default router;
