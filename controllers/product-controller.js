const ProductServices = require("../services/product-services");

module.exports.list = async (request, h) => {
  let query = request.query;
  let sortType;
  if (query.sort && (query.sort === 1 || query.sort === -1)) {
    sortType = query.sort;
  }
  try {
    const pizzas = await ProductServices.getAllPizzas(sortType);
    if (pizzas) {
      return h.response(pizzas).code(200);
    } else {
      return h.response({ message: "You don't have any product." });
    }
  } catch (error) {
    return h.response(error.message).code(500);
  }
};

module.exports.detail = async (request, h) => {
  try {
    let productID = request.params.id;
    let product = await ProductServices.getProductDetail(productID);
    if (product == null) {
      return h.response({}).code(404);
    } else {
      return h.response(product);
    }
  } catch (error) {
    h.response(error).code(500);
  }
};

module.exports.listByIDs = async (request, h) => {
  try {
    let productIDs = request.payload;
    let products = await ProductServices.getProductByIDs(productIDs);
    if (products == null) {
      return h.response({}).code(404);
    } else {
      return h.response(products);
    }
  } catch (error) {
    h.response(error).code(500);
  }
};
