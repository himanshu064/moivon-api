var nodemailer = require("nodemailer");
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
