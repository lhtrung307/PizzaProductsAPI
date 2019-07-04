const { init } = require("../server");
const Categories = require("../models/category");
const Mongoose = require("mongoose");

Mongoose.connect(
  "mongodb+srv://trung:trung123@clusterproducts-yjceb.mongodb.net/products-test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
)
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((error) => {
    console.log(error);
  });

describe("Test category endpoints", () => {
  let server;
  beforeAll(async () => {
    server = await init();
  });

  beforeEach(async () => {
    await server.initialize();
    await Categories.CategoryModel.deleteMany({});
  });

  afterEach(async () => {
    await server.stop();
  });

  afterAll(async () => {
    await Mongoose.connection.db.dropDatabase();
    await Mongoose.disconnect();
  });
  describe("GET /categories", () => {
    it("Should have status code equal 200", async () => {
      const injectOptions = {
        method: "GET",
        url: "/categories"
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toEqual([]);
    });
  });

  describe("POST /categories", () => {
    it("Should create new category", async () => {
      const injectValue = {
        name: "Pizza Hải Sản",
        description: "Ngon tuyệt"
      };
      const injectOptions = {
        method: "POST",
        url: "/categories",
        payload: injectValue
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty("name");
    });
  });

  // category = await Categories.CategoryModel.create({
  //   name: "Pizza Hải Sản",
  //   description: "Ngon tuyệt"
  // });
});
