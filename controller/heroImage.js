const HeroImageDetails = require("../model/heroImageDetails");
const HeroImage = require("../model/heroImage");
const fs = require("fs");

exports.post = async (req, res) => {
  let imagePath = req.files;
  let imageArr = [];
  try {
    if (imagePath !== undefined && imagePath.image !== undefined) {
      let paths = imagePaths(imagePath.image);
      let heroImage = new HeroImageDetails({
        description: req.body.description,
      });
      heroImage = await heroImage.save();
      if (!heroImage) {
        res.status(404).send({
          status: "failed",
          error: "heroImage record does not create",
        });
      }
      paths.forEach((path) => {
        let image = {
          image: path,
          heroImageId: heroImage._id,
        };
        imageArr.push(image);
      });
      //adding multi images
      await HeroImage.insertMany(imageArr);
      heroImage.images = imageArr;
      res.status(201).send({ status: "success", data: heroImage });
    } else {
      res.status(422).send({
        status: "failed",
        error:
          "image field must not be empty or Only .png, .jpg and .jpeg format allowed!",
      });
    }
  } catch (err) {
    res.status(500).send({ status: "failed", error: err });
  }
};

exports.get = async (req, res) => {
  try {
    const page = req.query.page ?? 1;
    const size = req.query.size ?? 10;
    const skip = (page - 1) * size;

    const totalHeroImages = await HeroImageDetails.countDocuments();
    const heroImages = await HeroImageDetails.find().skip(skip).limit(size);

    //adding image to each event
    for (i = 0; i < heroImages.length; i++) {
      const heroImageId = heroImages[i]._id;
      const image = await HeroImage.find({ heroImageId });
      heroImages[i].images = image;
    }

    res.status(200).send({
      status: "success",
      data: heroImages,
      pageNo: page,
      pageLimit: size,
      totalHeroImages,
      heroImagesPresent: heroImages.length,
    });
  } catch (err) {
    res.status(500).send({ status: "failed", error: err });
  }
};
exports.getById = async (req, res) => {
  const id = req.params.id;
  try {
    let heroImages = await HeroImageDetails.findById(id);
    if (heroImages == undefined || null) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    const heroImageId = heroImages._id;
    const image = await HeroImage.find({ heroImageId: heroImageId });
    heroImages.images = image;
    res.status(200).send({ status: "success", data: heroImages });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", error: err });
  }
};

exports.update = async (req, res) => {
  let paths,
    id = req.params.id;
  imageArr = [];
  let imagePath = req.files;
  try {
    const heroImage = await HeroImageDetails.findById({ _id: id });
    // if id invalid
    if (heroImage === null) {
      return res.status(404).send({ status: "failed", error: "invaild id" });
    }
    heroImage.description = req.body.description;
    heroImage.save();
    if (imagePath && imagePath.image) {
      //if req.files in not empty then first create arr of image path
      paths = imagePaths(imagePath.image);
      paths.forEach((path) => {
        let image = {
          image: path,
          heroImageId: heroImage._id,
        };
        imageArr.push(image);
      });
      //adding multi images
      await HeroImage.insertMany(imageArr);

      heroImage.images = imageArr;
    }
    res.status(200).send({ status: "success", data: heroImage });
  } catch (err) {
    res.status(500).send({ status: "failed", error: err });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const heroImage = await HeroImage.find({ heroImageId: id });
    if (heroImage) {
      heroImage.forEach((image) => {
        deleteimage(image.image);
      });
      await HeroImage.deleteMany({ heroImageId: id });
    }
    const heroImageDetail = await HeroImageDetails.findByIdAndRemove(id);

    if (heroImageDetail == undefined || null) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    res.status(200).send({ status: "success", data: heroImageDetail });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", error: err });
  }
};
exports.deleteImage = async (req, res) => {
  const id = req.params.id;
  try {
    const image = await HeroImage.findById(id);

    if (image == null) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    deleteimage(image.image);
    const result = await HeroImage.findByIdAndRemove(id);

    res
      .status(200)
      .send({ status: "success", data: "image deleted successfully" });
  } catch (err) {
    res.status(500).send({ status: "failed", error: err });
  }
};
function imagePaths(files) {
  arrayOfImage = [];
  files.forEach((image) => {
    arrayOfImage.push(image.path);
  });
  return arrayOfImage;
}

function deleteimage(path) {
  fs.unlink(path, function (err) {
    if (err) {
      //console.log(err);
    }
    console.log("image deleted");
  });
}
