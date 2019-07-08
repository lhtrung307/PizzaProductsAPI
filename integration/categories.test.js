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

    it("Should return categories have ascending order", async () => {
      let category1 = Categories.CategoryModel({
        name: "Pizza 1",
        description: "Ngon tuyệt"
      });

      let category2 = Categories.CategoryModel({
        name: "Pizza 2",
        description: "Ngon tuyệt"
      });
      let category3 = Categories.CategoryModel({
        name: "Pizza 3",
        description: "Ngon tuyệt"
      });
      let createdCategory1 = await category1.save();
      let createdCategory2 = await category2.save();
      let createdCategory3 = await category3.save();
      const injectOptions = {
        method: "GET",
        url: "/categories?sort=1"
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveLength(3);
      expect(payload[0]).toHaveProperty("name");
      expect(payload[0].name).toEqual(createdCategory1.name);
      expect(payload[1].name).toEqual(createdCategory2.name);
    });

    it("Should return categories have descending order", async () => {
      let category1 = await Categories.CategoryModel.create({
        name: "Pizza 1",
        description: "Ngon tuyệt"
      });
      let category2 = await Categories.CategoryModel.create({
        name: "Pizza 2",
        description: "Ngon tuyệt"
      });
      let category3 = await Categories.CategoryModel.create({
        name: "Pizza 3",
        description: "Ngon tuyệt"
      });
      let createdCategory1 = await category1.save();
      let createdCategory2 = await category2.save();
      let createdCategory3 = await category3.save();
      const injectOptions = {
        method: "GET",
        url: "/categories?sort=-1"
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveLength(3);
      expect(payload[0]).toHaveProperty("name");
      expect(payload[0].name).toEqual(createdCategory3.name);
      expect(payload[1].name).toEqual(createdCategory2.name);
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
