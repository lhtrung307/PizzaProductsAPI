const { init } = require("./server");
const ProductControllers = require("./controllers/product-controller");
const Product = require("./models/product");
const Variants = require("./models/variant");
const Categories = require("./models/category");
// const ProductData = require("./");
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

let url = "/pizzas";

describe("Product endpoints", () => {
  let server;
  let variant;
  let category;
  beforeAll(async () => {
    server = await init();
    variant = await Variants.VariantModel.create({
      acceptValues: ["S", "M", "L"],
      key: "size",
      type: "options",
      label: "Size"
    });
    category = await Categories.CategoryModel.create({
      name: "Pizza Hải Sản",
      description: "Ngon tuyệt"
    });
  });

  beforeEach(async () => {
    await server.initialize();
    await Product.ProductModel.deleteMany({});
  });

  afterEach(async () => {
    await server.stop();
  });

  afterAll(async () => {
    await Mongoose.connection.db.dropDatabase();
    await Mongoose.disconnect();
  });

  describe(`GET ${url}`, () => {
    it(`Should have status code equal to 200 `, async () => {
      const injectOptions = {
        method: "GET",
        url
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(200);
    });
    it(`Should get all pizzas`, async () => {
      const injectOptions = {
        method: "GET",
        url
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toEqual([]);
    });
    it("Should get all pizza sort by name", async () => {
      let product1 = Product.ProductModel({
        type: "pizza",
        categoryIDs: [category._id],
        variantIDs: [variant._id],
        name: "Pizza sữa chua nếp cẩm",
        description: "Nếp cẩm hay là nếp than đây???",
        price: 0,
        discountPrice: 0,
        variantProducts: [
          { key: "size", value: "S", price: 100000 },
          { key: "size", value: "M", price: 200000 },
          { key: "size", value: "L", price: 300000 }
        ]
      });
      let savedProduct1 = await product1.save();
      let product2 = Product.ProductModel({
        type: "pizza",
        categoryIDs: [category._id],
        variantIDs: [variant._id],
        name: "Pizza 2",
        description: "Nếp cẩm hay là nếp than đây???",
        price: 0,
        discountPrice: 0,
        variantProducts: [
          { key: "size", value: "S", price: 100000 },
          { key: "size", value: "M", price: 200000 },
          { key: "size", value: "L", price: 300000 }
        ]
      });
      let savedProduct2 = await product2.save();
      let product3 = Product.ProductModel({
        type: "pizza",
        categoryIDs: [category._id],
        variantIDs: [variant._id],
        name: "Pizza 3",
        description: "Nếp cẩm hay là nếp than đây???",
        price: 0,
        discountPrice: 0,
        variantProducts: [
          { key: "size", value: "S", price: 100000 },
          { key: "size", value: "M", price: 200000 },
          { key: "size", value: "L", price: 300000 }
        ]
      });
      let savedProduct3 = await product3.save();

      const injectOptions = {
        method: "GET",
        url: `${url}?sort=1`
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(200);
      const payload = JSON.parse(response.payload);
      let products = [savedProduct2, savedProduct3, savedProduct1];
      expect(payload).toEqual(products);
    });
  });

  describe(`GET ${url}`, () => {
    it(`Should have status code equal to 200 `, async () => {
      const injectOptions = {
        method: "GET",
        url: "/toppings"
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(200);
    });
    it(`Should get all toppings`, async () => {
      const injectOptions = {
        method: "GET",
        url: "/toppings"
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toEqual([]);
    });
  });

  describe(`GET ${url}/{id}`, () => {
    it(`Should get details of pizza with id`, async () => {
      let product = Product.ProductModel({
        type: "pizza",
        categoryIDs: [category._id],
        variantIDs: [variant._id],
        name: "Pizza sữa chua nếp cẩm",
        description: "Nếp cẩm hay là nếp than đây???",
        price: 0,
        discountPrice: 0,
        variantProducts: [
          { key: "size", value: "S", price: 100000 },
          { key: "size", value: "M", price: 200000 },
          { key: "size", value: "L", price: 300000 }
        ]
      });
      let savedProduct = await product.save();
      const injectOptions = {
        method: "GET",
        url: `${url}/${savedProduct._id}`
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(200);
      const payload = JSON.parse(response.payload);
      expect(payload.type).toEqual(product.type);
    });

    it("Should not get details of pizza when id is not object id", async () => {
      const injectOptions = {
        method: "GET",
        url: `${url}/${1234}`
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(400);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty("error");
    });

    it("Should not get details of pizza when id is wrong", async () => {
      const injectOptions = {
        method: "GET",
        url: `${url}/5d1443542c00e036605d8d5a`
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(404);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty("error");
    });
  });
});
