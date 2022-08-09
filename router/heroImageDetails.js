const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const {heroImageValidation} = require("../validationSchema/rules");
const heroImageController = require("../controller/heroImage");
const validate = require("../validationSchema/validationMiddleware")

router.post("/",isAuth,heroImageValidation(),validate,heroImageController.post);
 router.get("/",heroImageController.get);
 router.get("/:id",heroImageController.getById);
 router.put("/:id",isAuth,heroImageValidation(),validate,heroImageController.update)
 router.delete("/:id",isAuth,heroImageController.delete)
 router.delete("/deleteimage/:id",isAuth,heroImageController.deleteImage)
module.exports = router