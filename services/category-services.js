const Category = require("../models/category");

class CategoryServices {
  async getAllCategories(sortType) {
    let sort;
    if (!sortType && (sortType !== "1" || sortType !== "-1")) {
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

  async createCategory(category) {
    let createdCategory = await Category.save(category);
    if (createdCategory.error) {
      throw createdCategory.error;
    }
    return createdCategory;
  }
}

module.exports = new CategoryServices();
