const Hapi = require("@hapi/hapi");
const HapiSwagger = require("hapi-swagger");
const Inert = require("inert");
const Vision = require("vision");
const Pack = require("./package.json");

const productRouter = require("./routes/product-routes");
const categoryRouter = require("./routes/category-routes");

const port = process.env.PORT || 3000;
const server = Hapi.server({
  port,
  host: "0.0.0.0"
});

exports.init = async () => {
  await server.register([
    {
      plugin: productRouter
    },
    {
      plugin: categoryRouter
    }
  ]);
  return server;
};

exports.start = async () => {
  await exports.init();
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: "Products Endpoints",
          version: Pack.version
        }
      }
    }
  ]);
  await server.start();
  console.log(`Server running at ${server.info.uri}`);
  return server;
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
