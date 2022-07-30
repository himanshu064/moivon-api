const Genre = require("../model/genre");

exports.postGenre = async (req,res) => {
    try {
        const genre = new Genre({
            genre: req.body.genre
        })
        genre.save()
        res.status(201).send({status:"success",data:genre})
    } catch (err) {
        res.status(500).send({status:"failed",error:err})
    }
}

exports.getGenre = async(req,res) => {
    try {
        const genre = await Genre.find();
        res.status(200).send({status:"success",data:genre})
    } catch (err) {
        res.status(500).send({status:"failed",error:err})
    }
}

exports.updateGenre = async(req,res) => {
    const id = req.params.id
    try {
        console.log(id);
        const genre = await Genre.findById({_id:id});
        if(genre === null) {
            return res.status(404).send({status:"failed", error:"invaild id"})
         }
        genre.genre = req.body.genre
        genre.save();
        res.status(200).send({status:"success",data:genre})
    } catch (err) {
        console.log(err);
        res.status(500).send({status:"failed",error:err})
    }
}

exports.deleteGenre = async(req,res) => {
    const id = req.params.id
    try {
        const genre = await Genre.findByIdAndRemove(id);
        res.status(200).send({status:"success",data:genre})
    } catch (err) {
        res.status(500).send({status:"failed",error:err})
    }
}