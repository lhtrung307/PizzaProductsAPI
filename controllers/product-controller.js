const ProductServices = require("../services/product-services");

module.exports.list = async (request, h) => {
  let query = request.query;
  let sortType;
  if (query.sort && (query.sort === 1 || query.sort === -1)) {
    sortType = query.sort;
  }
  try {
    const products = await ProductServices.getAllProducts(sortType);
    if (products) {
      return h.response(products).code(200);
    } else {
      return h.response({ message: "You don't have any task." });
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
