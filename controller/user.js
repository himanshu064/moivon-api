const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

exports.signup = async (req,res) => {
   const name = req.body.name;
   const email = req.body.email;
   const password = req.body.password;
    try {
        hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        })
        await user.save();
        res.status(201).send({status:"success",data:{name:user.name,email:user.email}})
    } catch (err) {
        res.status(500).send({status:"failed",error: err}) 
    }
}
exports.login = async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email:email});
        if(user == null) {
            return res.status(403).send({status:"failed",error:"invalid email or password"});
        }
         //comparing password using bcrypt
      bcrypt
      .compare(password.toString(), user.password)
      .then((result) => {
        if (result) {
          //creating acces s token
          let token = jwt.sign(
            { name: user.name, email: user.email },
            process.env.SECRET,
            { expiresIn: 60 * 5 }
          );
          //creating refresh token
          let refreshToken = jwt.sign(
            { name: user.name, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "24h" }
          );
          //creating user-logout-token white-list

          res.status(200).send({
            status: "success",
            token,
            refreshToken,
          });
        } else {
          res.status(403).send({
            status: "failed",
            error: "invaild username or password",
          });
        }
      });
    } catch (err) {
        console.log(err);
        res.status(500).send({status:"failed",error: err}) 
    }
}

exports.refreshToken = async (req, res) => {
    try {
      const token = req.body.refreshToken;
      //checking if token is empty
      if (!token) {
        return res.status(403).send("A token is required for authentication");
      }
      //decoding token
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      let newToken = jwt.sign(
        //generating new token
        { name: decoded.name, email: decoded.email },
        process.env.SECRET,
        { expiresIn: 60*500 }
      );
      res.status(201).send({ status: "success", newToken });
    } catch (error) {
        res.status(403).send({ status: "failed", error: err });
    }
  };

  exports.forgetPassword = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({email: email});
        if(user == null || undefined) {
            return res.status(403).send({status:"failed",error:"invalid email"});
        }
        let token = jwt.sign(
            { name: user.name, email: user.email },
            process.env.SECRET,
            { expiresIn: 60 * 15 }
          );
          res.status(200).send({
            status: "success",
            message:"user this token to generate new password",
            token,
          });
        // const transpoter = nodemailer.createTransport({
        //     service: "gmail",
        //     auth: {
        //         user :"gs7788264@gmail.com",
        //         pass: "8196030302gur"
        //     }
        // })
        // const mailOptions = {
        //     from: "gs7788264@gmail.com",
        //     to: "singhgursewak821@gmail.com",
        //     subject: "recover password",
        //     text: "user this token to generate password"
        // };
        // transpoter.sendMail(mailOptions, (err, data) => {
        //     if (err) {
        //         throw err;
        //     }
        //     console.log(data);
        // })

    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "failed",
            error: err
          });
    }
  }

exports.newPassword = async (req, res) => {
    const token = req.body.token;
    const password = req.body.password
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({name: decoded.name,email: decoded.email});
        const hashedPassword = await bcrypt.hash(password, 12)
        user.password = hashedPassword;
        user.save();
      res.status(201).send({ status: "success", data: "new password saved in db" });
    } catch (err) {
        console.log(err);
        res.status(403).send({
            status: "failed",
            error: err
          });
    }
}

exports.changePassword = async (req, res) => {
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    try {
        const auth = req.headers["authorization"];
        const token = auth && auth.split(" ")[1];
        data = jwt.verify(token, process.env.SECRET);
        const user = await findOne({email: data.email})
        bcrypt
        .compare(password.toString(), user.password)
        .then((result) => {
          if (result) {
            console.log(result);
            bcrypt.hash(newPassword, 12).then(hashedPassword => {
                user.password = hashedPassword;
                user.save();
                res.status(201).send({ status: "success", data: "password changed successfully" });
              })
          } else {
            res.status(401).send({ status: "failed", data: "invaild password" });
          }
        })
    } catch (err) {
        console.log(err);
        res.status(403).send({
            status: "failed",
            error: err
          });
    }
}