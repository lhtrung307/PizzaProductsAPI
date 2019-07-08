const Mongoose = require("mongoose");

const Schema = Mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: "Category must have a name"
    },
    description: String
  },
  { versionKey: false }
);

const CategoryModel = Mongoose.model("category", CategorySchema);

const getAll = (sortType) =>
  CategoryModel.find({})
    .select("-__v")
    .sort(sortType)
    .then((categories) => categories)
    .catch((error) => {
      return { error };
    });

const save = (category) =>
  CategoryModel.create(category)
    .then((createdCategory) => createdCategory)
    .catch((error) => {
      return { error };
    });

module.exports = {
  CategorySchema,
  CategoryModel,
  getAll,
  save
};
