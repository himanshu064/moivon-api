const Event = require("../model/event");
const moment = require("moment");
const Image = require("../model/image");
const fs = require("fs");
const mongoose = require("mongoose");
const Genre = require("../model/genre");
var ObjectId = require("mongoose").Types.ObjectId;

exports.getAllEvent = async (req, res) => {
  let page = req.query.page ?? 1;
  let noOfEvent = req.query.size ?? 10;
  let skipEvent = (page - 1) * noOfEvent;
  let published = req.query.published ?? undefined;
  let startDate = req.query.startDate ?? undefined;
  let endDate = req.query.endDate ?? undefined;
  let mostPopular = req.query.mostPopular ?? undefined;
  let upComing = req.query.upComing ?? undefined;
  let genreId = req.query.genreId || undefined;
  let sort = req.query.sort || undefined;
  let order = req.query.order || undefined;
  // let earliest = req.query.earliest || undefined;
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
    let query = {},
      sortQuery = {};
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
    // if (earliest !== undefined) {
    //   const isEarliest = earliest.toLowerCase() === "true"
    //   if(isEarliest) {
    //     query["startDate"] = {$gte: new Date()}
    //   }
    // }
    if (genreId !== undefined) {
      const result = await checkId(genreId, Genre, ObjectId);
      if (!result) {
        return res
          .status(404)
          .send({ status: "failed", error: "genre Id is invalid" });
      }
      query["genre"] = genreId;
    }

    if (startDate) {
      query["$and"] = [
        { startDate: { $gte: startDate } },
        { startDate: { $lte: endDate } },
      ];
    }
    if (sort !== undefined) {
      if(sort === "earliest") {
        query["endDate"] = { $gte: new Date() }
        sortQuery["createdAt"] = "desc"
      } else if (order !== undefined) {
        sortQuery[sort] = order;
      } else {
        sortQuery[sort] = "asc";
      }
    }

    const totalEvent = await Event.find(query);
    const totalMostPopular = await Event.find({
      mostPopular: true,
    }).countDocuments();
   
  sortQuery["createdAt"] = "desc";
  let event;
    sortQuery?.latest === "desc"
      ? (event = await Event.find(query)
          .sort({ startDate: -1 })
          .populate("images genre")
          .skip(skipEvent)
          .limit(noOfEvent))
      : (event = await Event.find(query)
          .sort({ startDate: 1 })
          .populate("images genre")
          .skip(skipEvent)
          .limit(noOfEvent));

    //adding image to each event
    // for (i = 0; i < event.length; i++) {
    //   const eventid = event[i]._id;
    //   const image = await Image.find({ eventId: eventid });
    //   event[i].images = image;
    // }

    res.status(200).send({
      status: "success",
      pageNo: page,
      pageLimit: noOfEvent,
      totalEvent: totalEvent.length,
      eventPresent: event.length,
      data: event,
      totalMostPopular,
    });
  } catch (err) {
    res.status(500).send({ status: "failed", error: err });
  }
};

exports.getById = async (req, res) => {
  let id = req.params.id;

  try {
    const event = await Event.findById(id).populate("images genre");
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
  let imageArr = [];
  let id = req.body.genre;
  try {

    const result = await checkId(id, Genre, ObjectId);
    if (!result) {
      return res
        .status(404)
        .send({ status: "failed", error: "genre Id is invalid" });
    }
    if (imagePath !== undefined && imagePath.image !== undefined) {
      let paths = imagePaths(imagePath.image);

      paths.forEach((path) => {
        let image = {
          image: path,
        };
        imageArr.push(image);
      });
      let data = await Image.insertMany(imageArr);
      imageIds = data.map((e) => e.id);

      const event = new Event({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price || 0,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        venue: req.body.venue,
        location: req.body.location,
        images: imageIds,
        mostPopularSeq: -1,
        eventOrgDetail: req.body.eventOrgDetail,
        published: req.body.published || false,
        mostPopular: req.body.mostPopular || false,
        upComing: req.body.upComing || false,
        genre: req.body.genre,
        organization: req.body.organization,
        organizationUrl: req.body.organizationUrl,
        eventUrl: req.body.eventUrl,
        organizationIcon: req.body.organizationIcon,
      });
      event.save();
      // looping on all images user has entered

      //adding multi images
      //let images = await Image.insertMany(imageArr);

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

exports.deleteImage = async (req, res) => {
  const id = req.query.imageid;
  const eventId = req.query.eventId;
  try {
    const image = await Image.findById(id);
    if (image == null) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    //removing image id from images key of event
    const event = await Event.updateOne(
      { _id: eventId },
      { $pull: { images: id } },
      { multi: true }
    );

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
    genreId = req.body.genre;
  let imageArr = [];
  let imagePath = req.files;
  try {
    //checking if event id is valid
    const event = await Event.findById(req.params.id);
    if (event === null) {
      return res.status(404).send({ status: "failed", error: "invaild id" });
    }
    //checking if genreId is valid
    const result = await checkId(genreId, Genre, ObjectId);
    if (!result) {
      return res
        .status(404)
        .send({ status: "failed", error: "genre Id is invalid" });
    }
    //mostPopular Seq swap
    if (req.body.mostPopularSeq && req.body.mostPopularSeq !== "null") {
      const data = await Event.findOne({
        mostPopularSeq: req.body.mostPopularSeq,
      });
      if (
        data &&
        data.mostPopularSeq !== event.mostPopularSeq &&
        req.body.mostPopular
      ) {
        data.mostPopularSeq = event.mostPopularSeq;
        data.save();
      }
    }

    //upComing Seq swap
    if (req.body.upComingSeq && req.body.upComingSeq !== "null") {
      const data = await Event.findOne({
        upComingSeq: req.body.upComingSeq,
      });
      if (data && data.upComingSeq !== event.upComingSeq && req.body.upComing) {
        data.upComingSeq = event.upComingSeq;
        data.save();
      }
    }
    event.title = req.body.title;
    event.description = req.body.description;
    event.price = req.body.price;
    event.startDate = req.body.startDate;
    event.endDate = req.body.endDate;
    event.venue = req.body.venue;
    event.location = req.body.location;
    event.genre = req.body.genre;
    event.organization = req.body.organization;
    event.organizationUrl = req.body.organizationUrl;
    event.eventUrl = req.body.eventUrl;
    event.organizationIcon = req.body.organizationIcon;
    // if (!req.body.mostPopular) {
    //   event.mostPopularSeq = -1;
    // } else
    if (
      req.body.mostPopularSeq &&
      (req.body.mostPopularSeq !== "null" ||
        req.body.mostPopularSeq !== "undefined")
    ) {
      event.mostPopularSeq = req.body.mostPopularSeq;
    }
    if (
      req.body.upComingSeq &&
      (req.body.upComingSeq !== "null" || req.body.upComingSeq !== "undefined")
    ) {
      event.upComingSeq = req.body.upComingSeq;
    }
    event.eventOrgDetail = req.body.eventOrgDetail;
    event.published = req.body.published || false;
    event.mostPopular = req.body.mostPopular || false;
    event.upComing = req.body.upComing || false;
    event.save();
    if (imagePath.image) {
      //if req.files in not empty then first create arr of image path
      paths = imagePaths(imagePath.image);
      paths.forEach((path) => {
        let image = {
          image: path,
        };
        imageArr.push(image);
      });
      //adding multi images
      let data = await Image.insertMany(imageArr);
      imageIds = data.map((e) => mongoose.Types.ObjectId(e.id));
      // event.images = event.images.push(...imageIds);
      await Event.findByIdAndUpdate(
        { _id: req.params.id },

        { $push: { images: imageIds } }
      );
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
    const event = await Event.findById(id);
    //fetching all images related to event

    //looping over and remove all images from file directory
    if (event) {
      for (imageId of event.images) {
        data = await Image.findOne({ id: imageId.toHexString() });
        deleteimage(data.image);
      }
      // finally delete all image records
      let result = await Image.deleteMany({ _id: event.images });
      // console.log(result);
    }

    //then delete event
    const deleteEvent = await Event.findByIdAndRemove(id);

    if (deleteEvent == undefined || null) {
      return res.status(404).send({ status: "failed", error: "invalid id" });
    }
    res.status(200).send({ status: "success", data: event });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failed", error: err });
  }
};
exports.deleteEvents = async (req, res) => {
  let eventIds = req.body.eventIds ?? [];
  try {
    if (eventIds.length == 0) {
      return res
        .status(404)
        .send({ status: "failed", error: "invalid id array" });
    }

    for (eventId of eventIds) {
      const event = await Event.findById(eventId);

      if (event) {
        for (imageId of event.images) {
          const data = await Image.findOne({ id: imageId.toHexString() });
          // data = await Image.findById(imageId);
          deleteimage(data.image);
        }
        // finally delete all image records
        let result = await Image.deleteMany({ _id: event.images });
      }
    }

    const event = await Event.deleteMany({
      _id: { $in: eventIds },
    });

    if (!event) {
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
