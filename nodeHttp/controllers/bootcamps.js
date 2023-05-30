const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/async");


// @desc    Get all bootcapms
// @routes  Get /api/v1/bootcamps
//@access   Public

export const getAllBootcamps = asycHandler(async (res,req,next)=>{
    // console.log(req.query);
    let query;

    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match =>`$${match}`);

    // console.log(queryStr);
    query = Bootcamp.find(JSON.parse(queryStr));


    const bootcamps = await Bootcamp.find();

    return res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})

// @desc    Get one bootcamp
// @routes  Get /api/v1/bootcamps/:id
//@access   Public
exports.getOneBootcamp = asyncHandler(async (req, res, next)=>{
    const getOneBookCamp = await Bootcamp.findById(req.params.id);

    if(!getOneBookCamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
    }

    return res.status(200).json({
        success: true,
        data: getOneBookCamp
    })
})

// @desc    Create bootcamp
// @routes  Post /api/v1/bootcamps
//@access   Private
exports.createBootCamp =  (async (req, res, next) =>{    
    const  bootcamp = await Bootcamp.create(req.body);

    return res.status(201).json({
        success: true,
        data: bootcamp
    })
})

// @desc    Update bootcamp
// @routes  Put or Patch /api/v1/bootcamps/:id
//@access   Private
exports.updateBootCamp = asyncHandler(async (req, res, next) =>{

        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true ,
            runValidators: true
           });
        
           if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
           }
})

// @desc    Delete bootcamp
// @routes  Delete /api/v1/bootcamps/:id
//@access   Private

exports.deleteBootCamp = asycncHandler(async (req, res, next) =>{

    const deleteBootcmp = await Bootcamp.findByIdAndDelete(req.params.id);

    if(!deleteBootcmp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
    }

    return res.status(200).json({
        success: true,
        data : {}
    });
});

// @desc    Get bootcamps within a radius
// @routes  Get /api/v1/bootcamps/radius/zipcode/:distance
//@access   Private

exports.getBootCampsInRadius = asyncHandler(async (req, res, next) =>{

    const {zipcode, distance} = req.params;

    //   get the latitude and longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // calc radius using radians
    // Divide distance by the radius of the earth...which is 3,963miles/ 6,378 kilometers

    const radius = distance/3963
    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
    });

    return res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});