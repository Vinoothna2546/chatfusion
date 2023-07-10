const express=require('express')
const {registerUser,loginUser,allUsers,test}=require("../controllers/userController")
const {protect}=require("../middleware/authMiddleware")
const router=express.Router()

router.post("/",registerUser);
router.get("/", protect,allUsers);
router.post("/login",loginUser);
router.post("/test",test)
module.exports=router;
