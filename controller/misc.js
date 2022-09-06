var nodemailer = require("nodemailer");
const NewsLetter = require("../model/newsLetter");
var ObjectId = require("mongoose").Types.ObjectId;

exports.contactUs = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const message = req.body.message;
  try {
    let htmlData = `<h5>UserName: ${name}</h5><h5>Email: ${email}</h5><h5>Phone: ${phone}</h5><h5>message:${message}</h5>`;
    if (phone == undefined) {
      htmlData = `<h5>UserName: ${name}</h5><h5>Email: ${email}</h5><h5>message:${message}</h5>`;
    }
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
      port: 465,
      host: "smtp.gmail.com",
    });

    var mailOptions = {
      from: email,
      to: process.env.TEST_EMAIL || process.env.USER_EMAIL,
      subject: "moivon contact us",
      html: htmlData,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(400).send({ status: "failed", error: error });
        console.log(error);
      } else {
        res
          .status(200)
          .send({ status: "success", message: "email send successfully" });
      }
    });
  } catch (err) {
    res.status(500).send({ status: "failed", error: err });
  }
};

exports.postNewsLetter = async (req, res) => {
  let newsLetter
  try {
     newsLetter = await NewsLetter.findOne({email: req.body.email});
    if (newsLetter) {
      newsLetter.email = req.body.email
      newsLetter.save();
    } else {
       newsLetter = await NewsLetter({
        email: req.body.email,
      });
      newsLetter.save();
    }
    res.status(200).send({ status: "success", data: newsLetter });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", error: err });
  }
};
exports.getNewsLetter = async (req, res) => {
  let page = req.query.page ?? 1;
  let noOfLetter = req.query.size ?? 10;
  let skipLetter = (page - 1) * noOfLetter;
  try {
    if (page <1) {
     return  res
      .status(400)
      .send({ status: "failed",error:"page number should greater then 0"})
    }
    let sortQuery = {};
    sortQuery["createdAt"] = "desc";
    const newsLetter = await NewsLetter.find().sort(sortQuery)
      .skip(skipLetter)
      .limit(noOfLetter);
    res
      .status(200)
      .send({
        status: "success",
        pageNo: page,
        pageLimit: noOfLetter,
        data: newsLetter,
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", error: err });
  }
};

exports.putNewsLetter = async (req, res) => {
  const id = req.params.id
  try {
   const result = await checkId(id,NewsLetter,ObjectId)
    if (!result) {
      return res
        .status(404)
        .send({ status: "failed", error: "Id is invalid" });
    }
    const newsLetter = await NewsLetter.findById({_id: id});
    if(newsLetter == null) {
     return res.status(404).send({status:"failed", error: "invalid id"})
    }
    newsLetter.email = req.body.email;
    newsLetter.save();
    res.status(200).send({status:"success",data: newsLetter})
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", error: err });
  }
}
exports.deleteNewsLetter = async (req, res) => {
  const id = req.params.id
  try {
    const result = await checkId(id,NewsLetter,ObjectId)
    if (!result) {
      return res
        .status(404)
        .send({ status: "failed", error: "Id is invalid" });
    }
    const newsLetter = await NewsLetter.findByIdAndRemove({_id: id});
    if (newsLetter == undefined || null) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    res.status(200).send({status:"success", data: newsLetter})
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", error: err });
  }
}
exports.deleteNewsLetters = async (req, res) => {
  const ids = req.body.ids
  try {
    if (!ids || ids.length == 0) {
      return res
      .status(404)
      .send({ status: "failed", error: "invalid id array" });
    }
    const newsLetters = await NewsLetter.deleteMany({
      _id: { $in: ids },
    });
    console.log(newsLetters);
    if (!newsLetters || newsLetters.deletedCount < 1) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    return res.status(404).send({ status: "success", error: "news letters deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", error: err });
  }
}
async function checkId(id, Model, ObjectId) {
  if (ObjectId.isValid(id)) {
    const data = await Model.findById(id);
    if (data) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}