const VariantServices = require("../services/variant-services");

module.exports.create = async (request, h) => {
  let variant = request.payload;
  try {
    const createdVariant = await VariantServices.createVariant(variant);
    console.log(createdVariant);
    return h.response(createdVariant).code(200);
  } catch (error) {
    return h.response(error.stack).code(500);
  }
};
