const ProductServices = require("./product-services");

describe("Test product services", () => {
  describe("Test getProductByIDs method", () => {
    it("Should throw error if productIDs is undefined", async () => {
      expect(ProductServices.getProductByIDs()).rejects.toThrowError(
        /cannot be empty/
      );
    });
    it("Should throw error if productIDs is null", async () => {
      expect(ProductServices.getProductByIDs(null)).rejects.toThrowError(
        /cannot be empty/
      );
    });
  });
});
