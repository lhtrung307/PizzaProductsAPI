const Products = require("../models/product");
const axios = require("axios");
const Joi = require("@hapi/joi");
class ProductServices {
  async getAllPizzas(sortType) {
    let sort;
    if (!sortType && sortType !== 1 && sortType !== -1) {
      sort = {};
    } else {
      sort = { name: sortType };
      console.log(sort);
    }
    let products = await Products.getAllPizzas(sort);
    if (products.error) {
      throw products.error;
    }
    return products;
  }

  async getPizzasByCategory(categoryID, sortType) {
    let sort;
    if (!categoryID) {
      throw new Error("CategoryID cannot be empty");
    }
    if (!sortType && sortType !== 1 && sortType !== -1) {
      sort = {};
    } else {
      sort = { name: sortType };
    }
    let products = await Products.getProductsByCategoryID(categoryID, sort);
    if (products.error) {
      throw products.error;
    }
    return products;
  }

  async getAllToppings() {
    let toppings = await Products.getToppings();
    if (toppings.error) {
      throw toppings.error;
    }
    return toppings;
  }

  async getProductDetail(id) {
    if (!id && typeof id !== "string") {
      throw new Error("Product id cannot be empty");
    }
    let product = await Products.getProductByID(id);
    if (!product) {
      return null;
    }
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

  async getProductsForCreateOrder(products) {
    if (!products) {
      throw new Error("Products cannot be empty");
    }
    let productInfos = await Promise.all(
      products.map(async (product) => {
        let productRecord = await Products.getProductByID(product.productID);
        product.type = productRecord.type;
        if (this.isDiscountProduct(productRecord)) {
          product.pricingRule = {
            discountType: productRecord.pricingRule.discountType,
            discount: productRecord.pricingRule.discount
          };
        }
        if (product.variants) {
          product.variants = productRecord.variantProducts.filter(
            (variantProduct) => {
              for (let variant of product.variants) {
                if (
                  variantProduct.key === variant.key &&
                  variantProduct.value === variant.value
                ) {
                  return variantProduct;
                }
              }
            }
          );
        } else {
          product.price = productRecord.price;
        }
        return product;
      })
    );
    console.log(productInfos);
    return productInfos;
  }

  isDiscountProduct(product) {
    let today = new Date();
    return (
      product.pricingRule.toDate &&
      product.pricingRule.toDate.getTime() > today.getTime()
    );
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

  async getBestSellers() {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    let result = await axios.get(
      `https://pizza-orders.herokuapp.com/order-detail-report/${date}`
    );
    let orderDetails = result.data;
    let productIDs = orderDetails.map((orderDetail) => orderDetail._id);
    let bestSellers = await this.getProductByIDs(productIDs);
    return bestSellers;
  }
}

module.exports = new ProductServices();
