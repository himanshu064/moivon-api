const jwt = require("jsonwebtoken");
const User = require("../model/user")

isAuth = async (req, res, next) => {
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .send({
        status: "failed",statusCode:403,
        error: "A token is required for authentication",
      });
  }
  try {
    data = jwt.verify(token, process.env.SECRET);
 //comparing token with db's  token with userId
    user = await User.findOne({email:data.email,name: data.name});
    if (user == null) {
      return res
        .status(403)
        .send({ status: "failed",statusCode:403, error: "invaild token" });
    } else {

      req.user = data;
      next();
    }
  } catch (err) {
    return res.status(403).send({ status: "failed",statusCode:403, error: `${err.name}, ${err.message} `});
  }
};

module.exports = isAuth;
