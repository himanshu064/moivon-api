const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const {genreValidation} = require("../validationSchema/rules");
const genreController = require("../controller/genre");
const validate = require("../validationSchema/validationMiddleware")

router.post("/",isAuth,genreValidation(),validate,genreController.postGenre);
router.get("/",genreController.getGenre);
router.put("/:id",isAuth,genreValidation(),validate,genreController.updateGenre)
router.delete("/:id",genreController.deleteGenre)
module.exports = router