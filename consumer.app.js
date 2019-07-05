const Kafka = require("node-rdkafka");
const Product = require("./models/product");
require("dotenv").config();

const updateProductPricingRule = async (pricingRuleData) => {
  let pricingRule = JSON.parse(pricingRuleData);
  let { fromDate, toDate, discountType, discount } = pricingRule;
  console.log("Hello");
  console.log(pricingRule);
  let products = await Product.updateProducts(pricingRule.productIDs, {
    pricingRule: { fromDate, toDate, discountType, discount }
  });
  return products;
};

const deleteProductPricingRule = async (pricingRuleData) => {
  let pricingRule = JSON.parse(pricingRuleData);
  console.log("Hello");
  console.log(pricingRule);
  let products = await Product.updateProducts(pricingRule.productIDs, {
    pricingRule: {}
  });
  return products;
};

const Consumer = {
  name: "product-consumer",
  version: "1.0.0",
  register: async (server, options) => {
    let kafkaConf = {
      "group.id": "cloudkarafka-pricingrules",
      "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
      "socket.keepalive.enable": true,
      "security.protocol": "SASL_SSL",
      "sasl.mechanisms": "SCRAM-SHA-256",
      "sasl.username": process.env.CLOUDKARAFKA_USERNAME,
      "sasl.password": process.env.CLOUDKARAFKA_PASSWORD,
      debug: "generic,broker,security",
      "enable.partition.eof": false
    };

    const prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
    const topics = [`${prefix}updatePricingRule`];
    console.log(topics);
    const consumer = new Kafka.KafkaConsumer(kafkaConf);

    const numMessages = 5;
    let counter = 0;
    consumer.on("error", function(err) {
      console.error(err);
    });
    consumer.on("ready", function(arg) {
      console.log(`Consumer ${arg.name} ready`);
      consumer.subscribe(topics);
      consumer.consume();
    });
    consumer.on("data", function(m) {
      counter++;
      if (counter % numMessages === 0) {
        console.log("calling commit");
        consumer.commit(m);
      }
      if (m.key.toString() === "create") {
        updateProductPricingRule(m.value.toString())
          .then((products) => console.log(products))
          .catch((error) => console.log(error));
      }
      if (m.key.toString() === "update") {
        updateProductPricingRule(m.value.toString())
          .then((products) => console.log(products))
          .catch((error) => console.log(error));
      }
      if (m.key.toString() === "delete") {
        deleteProductPricingRule(m.value.toString())
          .then((products) => console.log(products))
          .catch((error) => console.log(error));
      }
    });
    consumer.on("disconnected", function(arg) {
      process.exit();
    });
    consumer.on("event.error", function(err) {
      console.error(err);
      process.exit(1);
    });
    consumer.on("event.log", function(log) {
      // console.log(log);
    });
    consumer.connect();

    // setTimeout(function() {
    //   consumer.disconnect();
    //   console.log("disconnect");
    // }, 300000);
  }
};

module.exports = Consumer;
