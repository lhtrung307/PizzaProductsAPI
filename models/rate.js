const Mongoose = require("mongoose");

const Schema = Mongoose.Schema;

const RateSchema = new Schema({
  customerID: {
    type: Schema.Types.ObjectId,
    ref: "customer",
    required: "Rate must have customer id"
  },
  productID: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: "Rate must have product id"
  },
  star: {
    type: Number,
    required: "Rate must have number of star"
  }
});

const RateModel = Mongoose.model("rate", RateSchema);

const getAll = () =>
  RateModel.find({})
    .then((rates) => rates)
    .catch((error) => {
      return { error };
    });

module.exports = {
  RateSchema,
  RateModel,
  getAll
};
