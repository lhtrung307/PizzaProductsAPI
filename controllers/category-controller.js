const CategoryServices = require("../services/category-services");

module.exports.list = async (request, h) => {
  let query = request.query;
  let sortType;
  if (query.sort && (query.sort === 1 || query.sort === -1)) {
    sortType = query.sort;
  }
  try {
    const categories = CategoryServices.getAllCategories(sortType);
    if (categories) {
      return h.response(categories).code(200);
    } else {
      return h.response({ message: "You don't have any category." });
    }
  } catch (error) {
    return h.response(error.message).code(500);
  }
};
