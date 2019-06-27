const Variant = require("../models/variant");

class VariantServices {
  async createVariant(variant) {
    let createdVariant = await Variant.save(variant);
    if (createdVariant.error) {
      throw createdVariant.error;
    }
    return createdVariant;
  }
}

module.exports = new VariantServices();
