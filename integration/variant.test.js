const { init } = require("../server");
const Variants = require("../models/variant");
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

describe("Test variant endpoints", () => {
  let server;
  beforeAll(async () => {
    server = await init();
  });

  beforeEach(async () => {
    await server.initialize();
    await Variants.VariantModel.deleteMany({});
  });

  afterEach(async () => {
    await server.stop();
  });

  afterAll(async () => {
    await Mongoose.connection.db.dropDatabase();
    await Mongoose.disconnect();
  });

  describe("POST /variants", () => {
    it("Should create new variant", async () => {
      const injectValue = {
        acceptValues: ["S", "M", "L"],
        key: "size",
        type: "options",
        label: "Size"
      };
      const injectOptions = {
        method: "POST",
        url: "/variants",
        payload: injectValue
      };
      const response = await server.inject(injectOptions);
      expect(response.statusCode).toEqual(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty("key");
    });
  });
});
