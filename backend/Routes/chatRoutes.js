const express = require('express')
const { protect } = require("../middleware/authMiddleware")
const {accessChat,fetchChats,createGroupChat,renameGroup,addtoGroup,removefromGroup,}=require("../controllers/chatController")
const router = express.Router()

router.post("/",protect,accessChat);
router.get("/", protect, fetchChats);
router.post("/group", protect, createGroupChat);
router.put("/rename", protect, renameGroup);
router.put("/groupadd", protect, addtoGroup);
router.put("/groupremove", protect, removefromGroup);
module.exports = router;