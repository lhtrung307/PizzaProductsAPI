const Category = require("../models/category");

class CategoryServices {
  async getAllCategories(sortType) {
    let sort;
    if (!sortType && (sortType !== 1 || sortType !== -1)) {
      console.log(sortType);
      sort = {};
    } else {
      sort = { name: sortType };
    }
    let categories = await Category.getAll(sort);
    if (categories.error) {
      throw categories.error;
    }
    return categories;
  }
}

module.exports = new CategoryServices();
