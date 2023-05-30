const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require("../utils/geocoder")

const BootCampSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },

    slug: String,
    description: {
        type: String,
        required: [true, 'please add a description'],
        maxlength: [500, 'decription can not be more than 500 characters']
    },

    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.\-#?&//=]*)?/
, 'please use a valid URL with HTTP or HTTPS'
        ]
    },

    phone:{
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please use a valid email address'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please enter a valid address']
    },
    location: {
        type: {
            // GeoJSON
          type: String, 
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true,
          index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        zipcode: String,
        country: String
      },
      careers: {
        type: [String],
        required: true,
        enum: [
            'web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
      },
      averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must not be more than 10'],
      },
      
      housing: {
        type: Boolean,
        default: false
      },

      jobAssistance: {
        type: Boolean,
        default: false
      },

      jobGuarantee: {
        type: Boolean,
        default: false
      },

      acceptGi: {
        type: Boolean,
        default: false
      },

      createdAt: {
        type: Date,
        default: Date.now
      }
});

// create bootcamp slug from the name

BootCampSchema.pre('save', function(next){
    // console.log("slugify ran", this.name)
    //   create a slug filed
    this.slug = slugify(this.name, {lower: true})
    next();
});

// GeoCode and create  location field
BootCampSchema.pre("save", async function(next){
    const loc = await geocoder.geocode(this.address)
    this.location = {
        type: "point",
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].state,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    }

    // Do not save address in database
    this.address = undefined;
    next()
})


module.exports = mongoose.model('BootCamps', BootCampSchema);