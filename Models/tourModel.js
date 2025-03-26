const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      maxLengh: [50, "max length of the name must be 50 characters"],
      minLength: [10, "min length of name must be 10 characters"],
    },
    duration: {
      type: Number,
      require: [true, "duration is required"],
    },
    difficulty: {
      type: String,
      required: [true, "difficulty can be difficult,medium,easy"],
      enum: {
        values: ["difficult", "medium", "easy"],
        message: "difficult,medium,easy",
      },
    },
    price: {
      type: Number,
      validate: {
        validator: function (val) {
          return val > 0;
        },
        message: (props) =>
          `price must be greater than 0, but got ${props.value}`,
      },
      required: [true, "price must be number"],
    },
    slug: {
      type: String,
    },
    ratingsAverage: {
      type: Number,
      required: [true, "ratings must be average"],
    },
    ratingsQuantity: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < 100;
        },
        message: "Quantity must be below 100",
      },
      required: true,
    },
    imageCover: {
      type: String,
    },
    images: {
      type: [String],
    },
    startDates: {
      type: [Date],
      default: Date.now(),
      required: true,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
      require: [true, "summary must be number"],
    },
    description: {
      type: String,
      require: [true, "description must be number"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.select("-secretTour");
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`query took ${Date.now() - this.start} millisecounds!`);
  next();
});

tourSchema.virtual("durationWeeks").get(function () {
  return (this.duration / 7).toFixed(2);
});

const tourModel = mongoose.model("Foundation-Tour", tourSchema);

module.exports = tourModel;
