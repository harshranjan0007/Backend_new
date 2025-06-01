import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refereshAccessToken,
  deleteUserAvatar,
  updateUserAvatar,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  deleteUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

//secure route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refereshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/updateUserAvatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/updateUserCoverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

router.route("/deleteUserAvatar").delete(verifyJWT,deleteUserAvatar);
router.route("/deleteUserCoverImage").delete(verifyJWT,deleteUserCoverImage);

export default router;
