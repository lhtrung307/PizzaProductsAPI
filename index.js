const Mongoose = require("mongoose");
const { start } = require("./server");

Mongoose.connect(
  "mongodb+srv://trung:trung123@clusterproducts-yjceb.mongodb.net/test?retryWrites=true&w=majority/products",
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

start();
