const Event = require("../model/event");
const moment = require("moment");

exports.getAllEvent = async (req, res) => {
  let page = req.query.page ?? 1;
  let noOfEvent = req.query.size ?? 10;
  let skipEvent = (page - 1) * noOfEvent;
  let published = req.query.published ?? undefined;
  let startDate = req.query.startDate ?? undefined;
  let endDate = req.query.endDate ?? undefined;

  try {
    const totalEvent = await Event.find();
    //if start date is present but enddate not
    if (startDate !== undefined && endDate === undefined) {
      endDate = moment(
        moment(new Date()).format("YYYY-MM-") + moment().daysInMonth()
      ).toISOString();
      // new Date

      // Boolean("false")
      console.log(endDate);
    } else if (startDate === undefined && endDate !== undefined) {
      //if enddate present but start date not
      startDate = moment(moment().format("YYYY-MM-01")).toISOString();
    }
    let query = {};
    if (published !== undefined) {
      //converting string true/false into boolen true/false
      const isPublished = published.toLowerCase() === "true";
      query["published"] = isPublished;
    }
    if (startDate) {
      console.log(startDate, endDate);
      query["$and"] = [
        { dates: { $gte: startDate } },
        { dates: { $lte: endDate } },
      ];
    }

    const event = await Event.find(query).skip(skipEvent).limit(noOfEvent);
    res.status(200).send({
      status: "success",
      pageNo: page,
      pageLimit: noOfEvent,
      totalEvent: totalEvent.length,
      eventPresent: event.length,
      data: event,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", error: err });
  }
};

exports.getById = async (req, res) => {
  let id = req.params.id;
  console.log(id);
  try {
    console.log(id);
    const event = await Event.findById(id);
    if (event == undefined || null) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    res.status(200).send({ status: "success", data: event });
  } catch (err) {
    res.status(500).send({ status: "failed", error: err });
  }
};
exports.createEvent = async (req, res) => {
  let imagePath = req.files;
  console.log(imagePath);
  try {
    let paths = imagePaths(imagePath.image);
    if (req.files !== undefined) {
      const event = new Event({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        dates: req.body.dates,
        venue: req.body.venue,
        images: paths,
        location: req.body.location,
        eventOrgDetail: req.body.eventOrgDetail,
        published: req.body.published ?? false,
      });
      event.save();
      console.log(req.files);
      res.status(201).send({ status: "success", data: event });
    } else {
      res.status(422).send({
        status: "failed",
        error:
          "image field must not be empty or Only .png, .jpg and .jpeg format allowed!",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", error: err });
  }
};

exports.updateEvent = async (req, res) => {
  // let id = req.params.id
  let paths;
  let imagePath = req.files;
  try {
    //    var id = mongoose.Types.ObjectId(req.params.id)
    // console.log(typeof id);
    if (req.files !== undefined) {
      paths = imagePaths(imagePath.image);
    }
    const event = await Event.findById(req.params.id);
    console.log(event);
    if (event === null) {
      return res.status(404).send({ status: "failed", error: "invaild id" });
    }
    (event.title = req.body.title),
      (event.decription = req.body.decription),
      (event.price = req.body.price),
      (event.dates = req.body.dates),
      (event.venue = req.body.venue),
      (event.images = paths ?? ""),
      (event.location = req.body.location),
      (event.eventOrgDetail = req.body.eventOrgDetail),
      (event.published = req.body.published ?? false),
      event.save();
    res.status(200).send({ status: "success", data: event });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", error: err });
  }
};

exports.deleteEvent = async (req, res) => {
  let id = req.params.id;
  try {
    const event = await Event.findByIdAndRemove(id);
    if (event == undefined || null) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    res.status(200).send({ status: "success", data: event });
  } catch (err) {
    res.status(500).send({ status: "failed", error: err });
  }
};

exports.publishEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event === null) {
      return res.status(404).send({ status: "failed", error: "invaild id" });
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          published: req.body.published,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).send({ status: "success", data: updatedEvent });
  } catch (err) {
    console.log(err);
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

function deleteImage(path) {
  fs.unlink("public/" + path, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("image deleted");
  });
}
