const Mongoose = require("mongoose");

const Schema = Mongoose.Schema;

const ProductSchema = new Schema({
  type: {
    type: String,
    enum: ["pizza", "topping"],
    required: "Product must have type"
  },
  categoryIDs: [
    {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: "Must have category id"
    }
  ],
  variantIDs: [
    {
      type: Schema.Types.ObjectId,
      ref: "variant",
      required: "Must have variant ids"
    }
  ],
  name: {
    type: String,
    trim: true,
    required: "Product must have name"
  },
  description: String,
  price: Number,
  discountPrice: Number,
  variantProducts: [
    {
      key: {
        type: String,
        trim: true,
        unique: true,
        required: "Variant product must have key"
      },
      value: {
        type: String,
        required: "Variant product must have value"
      },
      price: {
        type: Number,
        required: "Variant product must have price"
      }
    }
  ],
  pricingRule: {
    fromDate: Date,
    toDate: Date,
    discountType: {
      type: String,
      enum: ["percentage", "amount"]
    },
    discount: {
      type: Number
    }
  }
});

const ProductModel = Mongoose.model("product", ProductSchema);

const getAllPizzas = (sortType) =>
  ProductModel.find({ type: "pizza" })
    .sort(sortType)
    .then((products) => products)
    .catch((error) => {
      return { error };
    });

const getAllToppings = (sortType) =>
  ProductModel.find({ type: "topping" })
    .sort(sortType)
    .then((products) => products)
    .catch((error) => {
      return { error };
    });

const getProductByID = (productID) =>
  ProductModel.find({})
    .then((product) => product)
    .catch((error) => {
      return { error };
    });

const getProductsByCategoryID = (categoryID, sortType) =>
  ProductModel.find({ categoryID })
    .sort(sortType)
    .then((product) => product)
    .catch((error) => {
      return { error };
    });

module.exports = {
  ProductSchema,
  ProductModel,
  getAllPizzas,
  getAllToppings,
  getProductByID,
  getProductsByCategoryID
};
