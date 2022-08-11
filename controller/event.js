const Event = require("../model/event");
const moment = require("moment");
const Image = require("../model/image");
const fs = require("fs");

exports.getAllEvent = async (req, res) => {
  let page = req.query.page ?? 1;
  let noOfEvent = req.query.size ?? 10;
  let skipEvent = (page - 1) * noOfEvent;
  let published = req.query.published ?? undefined;
  let startDate = req.query.startDate ?? undefined;
  let endDate = req.query.endDate ?? undefined;
  let mostPopular = req.query.mostPopular ?? undefined;
  let upComing = req.query.upComing ?? undefined;
  try {
    //if start date is present but enddate not
    if (startDate !== undefined && endDate === undefined) {
      endDate = moment(
        moment(new Date()).format("YYYY-MM-") + moment().daysInMonth()
      ).toISOString();
      // new Date

      // Boolean("false")
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
    if (mostPopular !== undefined) {
      //converting string true/false into boolen true/false
      const isMostPopular = mostPopular.toLowerCase() === "true";
      query["mostPopular"] = isMostPopular;
    }
    if (upComing !== undefined) {
      //converting string true/false into boolen true/false
      const isUpComing = upComing.toLowerCase() === "true";
      query["upComing"] = isUpComing;
    }
    if (startDate) {
      query["$and"] = [
        { dates: { $gte: startDate } },
        { dates: { $lte: endDate } },
      ];
    }

    const totalEvent = await Event.find(query);
    const event = await Event.find(query).skip(skipEvent).limit(noOfEvent);

    //adding image to each event
    for (i = 0; i < event.length; i++) {
      const eventid = event[i]._id;
      const image = await Image.find({ eventId: eventid });
      event[i].images = image;
    }

    res.status(200).send({
      status: "success",
      pageNo: page,
      pageLimit: noOfEvent,
      totalEvent: totalEvent.length,
      eventPresent: event.length,
      data: event,
    });
  } catch (err) {
    res.status(500).send({ status: "failed", error: err });
  }
};

exports.getById = async (req, res) => {
  let id = req.params.id;

  try {
    const event = await Event.findById(id);
    if (event == undefined || null) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    const eventid = event._id;
    const image = await Image.find({ eventId: eventid });
    event.images = image;
    res.status(200).send({ status: "success", data: event });
  } catch (err) {
    res.status(500).send({ status: "failed", error: err });
  }
};
exports.createEvent = async (req, res) => {
  let imagePath = req.files;
  let imageArr = [];
  try {
    if (imagePath !== undefined && imagePath.image !== undefined) {
      let paths = imagePaths(imagePath.image);
      const event = new Event({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        dates: req.body.dates,
        venue: req.body.venue,
        location: req.body.location,
        eventOrgDetail: req.body.eventOrgDetail,
        published: req.body.published ?? false,
        mostPopular: req.body.mostPopular ?? false,
        upComing: req.body.upComing ?? false,
      });
      event.save();
      // looping on all images user has entered
      paths.forEach((path) => {
        let image = {
          image: path,
          eventId: event._id,
        };
        imageArr.push(image);
      });
      //adding multi images
      await Image.insertMany(imageArr);

      res.status(201).send({ status: "success", data: event });
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

exports.deleteImage = async (req, res) => {
  const id = req.params.id;
  try {
    const image = await Image.findById(id);
    if (image == null) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    deleteimage(image.image);
    const result = await Image.findByIdAndRemove(id);
    res
      .status(200)
      .send({ status: "success", data: "image deleted successfully" });
  } catch (err) {
    res.status(500).send({ status: "failed", error: err });
  }
};
exports.updateEvent = async (req, res) => {
  let paths,
    imageArr = [];
  let imagePath = req.files;
  try {
    const event = await Event.findById(req.params.id);
    if (event === null) {
      return res.status(404).send({ status: "failed", error: "invaild id" });
    }
    (event.title = req.body.title),
      (event.decription = req.body.decription),
      (event.price = req.body.price),
      (event.dates = req.body.dates),
      (event.venue = req.body.venue),
      (event.location = req.body.location),
      (event.eventOrgDetail = req.body.eventOrgDetail),
      (event.published = req.body.published ?? false),
      (event.mostPopular = req.body.mostPopular ?? false),
      (event.upComing = req.body.upComing ?? false);
    event.save();

    if (imagePath.image) {
      //if req.files in not empty then first create arr of image path
      paths = imagePaths(imagePath.image);
      paths.forEach((path) => {
        let image = {
          image: path,
          eventId: event._id,
        };
        imageArr.push(image);
      });
      //adding multi images
      await Image.insertMany(imageArr);
    }
    res.status(200).send({ status: "success", data: event });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", error: err });
  }
};

exports.deleteEvent = async (req, res) => {
  let id = req.params.id;
  try {
    //fetching all images related to event
    const images = await Image.find({ eventId: id });
    //looping over and remove all images from file directory
    if (images) {
      images.forEach((image) => {
        deleteimage(image.image);
      });
      // finally delete all image records
      await Image.deleteMany({ eventId: id });
    }

    //then delete event
    const event = await Event.findByIdAndRemove(id);

    if (event == undefined || null) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    res.status(200).send({ status: "success", data: event });
  } catch (err) {
    res.status(500).send({ status: "failed", error: err });
  }
};
exports.deleteEvents = async (req, res) => {
  let eventIds = req.body.eventIds ?? [];
  let arrOfObj = [];
  let eventIdObj;
  try {
    console.log(eventIds);
    if (eventIds.length == 0) {
      return res
        .status(404)
        .send({ status: "failed", error: "invalid id array" });
    }
    for (i = 0; i < eventIds.length; i++) {
      //fetching all images related to event
      const images = await Image.find({ eventId: eventIds[i] });
      //looping over and remove all images from file directory
      if (images) {
        images.forEach((image) => {
          deleteimage(image.image);
        });
        // finally delete all image records
        a = await Image.deleteMany({ eventId: eventIds[i] });
        console.log(a);
      }
    }
    // eventIds.forEach(id => {
    //   eventIdObj = {
    //     id: id
    //   }
    //   arrOfObj.push(eventIdObj)
    // })
    //then delete event

    const event = await Event.findByIdAndRemove({ id: { $in: eventIds } });
    console.log(event);
    if (event == undefined || null) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    res.status(200).send({ status: "success", data: event });
  } catch (err) {
    console.log(err);
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

function deleteimage(path) {
  fs.unlink(path, function (err) {
    if (err) {
      //console.log(err);
    }
    console.log("image deleted");
  });
}
