const CategoryControllers = require("../controllers/category-controller");

const Router = {
  name: "category-router",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/categories",
      options: {
        description: "Get list of categories",
        tags: ["api", "order-pizza", "categories"]
      },
      handler: CategoryControllers.list
    });
  }
};

module.exports = Router;
