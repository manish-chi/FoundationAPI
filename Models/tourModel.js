const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
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
      message : (props) => `price must be greater than 0, but got ${props.value}`,
    },
    required: [true, "price must be number"],
  },
  summary: {
    type: String,
    require: [true, "summary must be number"],
  },
  description: {
    type: String,
    require: [true, "description must be number"],
  },
});

const tourModel = mongoose.model("Foundation-Tour", tourSchema);

module.exports = tourModel;
