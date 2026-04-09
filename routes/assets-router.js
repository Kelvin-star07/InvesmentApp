import express from "express";
import {
  GetIndex,
  GetCreate,
  PostCreate,
  Delete,
  GetEdit,
  PostEdit
} from "../controllers/AssetsController.js";
import isAuth from "../middlewares/IsAuth.js";
import { AssetCreateValidation,AssetEditValidation,AssetIdValidation,AssetDeleteValidation } from "./validation/AssetsValidation.js";
import { handleValidationErrors } from "../middlewares/handleValidation.js";

const router = express.Router();

// Assets routes
router.get("/index", isAuth, GetIndex);

router.get("/create", isAuth, GetCreate);
router.post("/create", isAuth, AssetCreateValidation, handleValidationErrors("/assets/create"), PostCreate);

router.get("/edit/:assetsId", isAuth, AssetIdValidation, handleValidationErrors("/assets/index"), GetEdit);
router.post("/edit", isAuth, AssetEditValidation, handleValidationErrors((req) => `/assets/edit/${req.body.AssetsId}`), PostEdit);

router.post("/delete", isAuth, AssetDeleteValidation, handleValidationErrors("/assets/index"),Delete);

export default router;
