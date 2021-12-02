const express = require("express")
const userData = require("../data/userData")
const authenticationUser = require("../data/authenticationUser")
const router = express.Router()
router.post("/signup",authenticationUser.signup)
router.post("/login",authenticationUser.login)
router.get('/logout', authenticationUser.logout);
router.post("/forgotPassword",authenticationUser.forgotPassword)

router.patch("/resetPassword/:token",authenticationUser.resetPassword)
router.patch("/updatePassword",authenticationUser.protectedRoute,authenticationUser.updatePassword)

router.get("/me",authenticationUser.protectedRoute,userData.getMe,userData.getSingleUser)
router.patch("/updateMyData",authenticationUser.protectedRoute,userData.updateMyData)

router.delete('/deleteMe', authenticationUser.protectedRoute,userData.deleteMyData);

router.get("/", authenticationUser.protectedRoute,userData.fetchAllUsers)
router.post("/", authenticationUser.protectedRoute,userData.createSingleUser)

router.get("/:id", authenticationUser.protectedRoute,userData.getSingleUser)
router.patch("/:id", authenticationUser.protectedRoute,userData.updateExistingUser)
router.delete("/:id", authenticationUser.protectedRoute,userData.deleteUser)

module.exports = router