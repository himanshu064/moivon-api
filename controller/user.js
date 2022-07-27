const User = require("../model/user");
const jwt = require("jsonwebtoken");
const Genre = require("../model/genre");
exports.signup = async (req,res) => {
   const name = req.body.name;
   const email = req.body.email;
   const password = req.body.password;
    try {
        const user = new User({
            name: name,
            email: email,
            password: password
        })
        user.save();
        res.send({status:"success",data:user})
    } catch (err) {
        res.status(500).send({status:"failed",error: err}) 
    }
}
exports.login = async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email:email,password:password});
        if(user == null) {
            return res.status(403).send({status:"failed",error:"invalid email or password"});
        }
        let token = jwt.sign(
            { name: user.name, email: user.email },
            process.env.SECRET,
            { expiresIn: 60 * 500 }
          );
          //creating refresh token
          let refreshToken = jwt.sign(
            { name: user.name, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "24h" }
          );
        res.status(200).send({status:"success",data:{token,refreshToken}});
    } catch (err) {
        console.log(err);
        res.status(500).send({status:"failed",error: err}) 
    }
}

