const jwt=require("jsonwebtoken")
require('dotenv').config()
SECRET = "mynameispraaaan@$aneeth"

const generateToken=(id)=>{
    return jwt.sign({id},SECRET,{
        expiresIn:"30d"
    });
};
module.exports=generateToken;