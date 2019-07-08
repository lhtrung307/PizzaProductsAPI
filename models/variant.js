const Mongoose = require("mongoose");

const Schema = Mongoose.Schema;

const VariantSchema = new Schema(
  {
    key: {
      type: String,
      trim: true,
      required: "Variant must have key"
    },
    acceptValues: {
      type: Array,
      required: "Variant must have accept values"
    },
    type: {
      type: String,
      enum: ["string", "number", "options"],
      required: "Variant must have type"
    },
    label: String
  },
  { versionKey: false }
);

const VariantModel = Mongoose.model("variant", VariantSchema);

const save = (variant) =>
  VariantModel.create(variant)
    .then((createdVariant) => createdVariant)
    .catch((error) => {
      return { error };
    });

module.exports = {
  VariantSchema,
  VariantModel,
  save
};
