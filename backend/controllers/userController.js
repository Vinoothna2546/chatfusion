const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const userData = {
        name,
        email,
        password,
    };

    if (pic) {
        userData.pic = pic;
    }

    const user = await User.create(userData);

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
         } );
    } else {
        res.status(400);
        throw new Error("Failed to create user");
    }
});

const loginUser=asyncHandler(async(req,res)=>{
    const{email,password}=req.body;
    const user=await User.findOne({email})
    if(!user){
        res.status(400);
        throw new Error("User doesnt exist");
    }
    if(!await user.matchPassword(password)){
        res.status(400);
        throw new Error("Password didnt match");
    }

    if(user &&(await user.matchPassword(password))){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }else{
        res.status(400);
        throw new Error("Network error");
    }
})




const allUsers=asyncHandler(async(req,res)=>{
    const keyword=req.query.search?{
        $or:[
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }

        ]
    }:{};

    const users=await User.find(keyword).find({_id:{$ne:req.user._id}});
    res.send(users);
})


const test = (req, res) => {
    const { name, email, phone } = req.body;
    const data = {
        name: name,
        email: email,
        phone: phone
    };
    res.send(data);
};



module.exports={registerUser,loginUser,allUsers,test};