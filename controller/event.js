const Event = require("../model/event");

exports.getAllEvent = async (req,res) => {
   let page = req.query.page ?? 1
   let noOfEvent = req.query.size ?? 10
  let skipEvent = (page - 1) * noOfEvent
  
   try {
      const totalEvent = await Event.find()
      const event = await Event.find().skip(skipEvent)
      .limit(noOfEvent)
      res.status(200).send({status:"success", pageNo: page,size: noOfEvent, totalEvent, data: event })
   } catch (err) {
      res.status(500).send({status:"failed",error: err})
   }
}

exports.getById = async (req, res) => {
   let id = req.params.id
   try {
      const event = await Event.findById({_id: id}).populate()
      if(event == undefined || null) {
         return res.status(404).send({status: "failed", error: "invalid id"})
      }
      res.status(200).send({status: "success", data: event})
   } catch (err) {
      res.status(500).send({status:"failed",error: err})
   }
}
exports.createEvent = async (req,res) => {
   let imagePath = req.files
   console.log(imagePath);
    try {
     let paths =  imagePaths(imagePath.image)
      if (req.files !== undefined) {
       const event = new Event({
        title: req.body.title,
        decription: req.body.decription,
        price: req.body.price,
        dates: req.body.dates,
        venue: req.body.venue,
        images: paths,
        location: req.body.location,
        eventOrgDetail: req.body.eventOrgDetail,
        published: req.body.published ?? false,
       }) 
       event.save()
       console.log(req.files);
       res.status(201).send({ status: "success", data: event });
      } else {
         res.status(422).send({ status: "failed", error: "image field must not be empty or Only .png, .jpg and .jpeg format allowed!" });
       }
    } catch (err) {
      console.log(err);
       res.status(500).send({status:"failed",error: err}) 
    }
}

exports.updateEvent = async (req,res) => {
   let id = req.params.id
   let paths
   let imagePath = req.files;
   try {
console.log(id );
console.log("imagePath");

      if (req.files !== undefined) {
          paths =  imagePaths(imagePath.image)
      }
      const event = await Event.findById({_id:id}) 
      
         event.title = req.body.title,
         event.decription = req.body.decription,
         event.price = req.body.price,
         event.dates = req.body.dates,
         event.venue = req.body.venue,
         event.images = paths ?? "",
         event.location = req.body.location,
         event.eventOrgDetail = req.body.eventOrgDetail,
         event.published = req.body.published ?? false,
      
   event.save()
   res.status(200).send({ status: "success", data: event });
   } catch (err) {
      console.log(err);
       res.status(500).send({status:"failed",error: err}) 
   }
}

exports.deleteEvent = async (req,res) => {
   let id = req.params.id
   try {
      const event = await Event.findByIdAndRemove(id);
      if(event == undefined || null) {
         return res.status(404).send({status: "failed", error: "invalid id"})
      }
      res.status(200).send({status: "success", data: event})
   } catch (err) {
       res.status(500).send({status:"failed",error: err}) 
   }
}

function imagePaths(files) {
   arrayOfImage = []
   files.forEach(image => {
      arrayOfImage.push(image.path)
   })
   return arrayOfImage
}

function deleteImage(path) {
   fs.unlink('public/'+path,function(err) {
     if(err) {
       console.log(err);
     }
     console.log("image deleted")
   })
 }