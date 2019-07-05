const CategoryServices = require("../services/category-services");

module.exports.list = async (request, h) => {
  let query = request.query;
  let sortType;
  if (query.sort && (query.sort === 1 || query.sort === -1)) {
    sortType = query.sort;
  }
  try {
    const categories = await CategoryServices.getAllCategories(sortType);
    if (categories) {
      return h.response(categories).code(200);
    }
  } catch (error) {
    return h.response(error.message).code(500);
  }
};

module.exports.create = async (request, h) => {
  let category = request.payload;
  try {
    const createdCategory = await CategoryServices.createCategory(category);
    console.log(createdCategory);
    return h.response(createdCategory).code(200);
  } catch (error) {
    console.log(error.stack);
    return h.response(error.stack).code(500);
  }
};
