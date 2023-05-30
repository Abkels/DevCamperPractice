const express = require("express")
const {
    getAllBootcamps,
    getOneBootcamp,
    createBootCamp,
    deleteBootCamp,
    updateBootCamp,
    getBootCampsInRadius
} = require("../controllers/bootcamps")

const router = express.Router()

router.route('/radius/:zipcode/:distance').get(getBootCampsInRadius)

router
.route('/')
.get(getAllBootcamps)
.post(createBootCamp);

router.route('/:id')
.get(getOneBootcamp)
.put(updateBootCamp)
.delete(deleteBootCamp)

module.exports = router;