const Products = require("../models/product");

const Joi = require("@hapi/joi");
class ProductServices {
  async getAllPizzas(sortType) {
    let sort;
    if (!sortType && (sortType !== 1 || sortType !== -1)) {
      console.log(sortType);
      sort = {};
    } else {
      sort = { rating: sortType };
    }
    let products = await Products.getAllPizzas(sort);
    if (products.error) {
      throw products.error;
    }
    return products;
  }

  async getProductDetail(id) {
    if (!id && typeof id !== "string") {
      throw new Error("Product id cannot be empty");
    }
    let product = await Products.getProductByID(id);
    if (product.error) {
      throw product.error;
    }
    return product;
  }

  async getProductByIDs(productIDs) {
    if (!productIDs) {
      throw new Error("Product ids cannot be empty");
    }
    let products = await Promise.all(
      productIDs.map(
        async (productID) => await Products.getProductByID(productID)
      )
    );
    console.log(products);
    return products;
  }

  productValidate() {
    return Joi.object().keys({
      type: Joi.string().required(),
      categoryID: Joi.string().required(),
      variantIDs: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().optional(),
      price: Joi.number().optional(),
      variantProducts: Joi.array().items(
        Joi.object().keys({
          key: Joi.string.required(),
          value: Joi.string().required(),
          price: Joi.number().required()
        })
      )
    });
  }

  validateProduct(product) {
    return Joi.validate(product, this.productValidate);
  }
}

module.exports = new ProductServices();
