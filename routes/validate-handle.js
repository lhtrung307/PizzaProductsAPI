const Joi = require("@hapi/joi");

class ValidateHandle {
  constructor() {
    this.categoryResponseSchema = Joi.array()
      .items({
        _id: Joi.object().optional(),
        name: Joi.string().optional(),
        description: Joi.string().optional()
      })
      .options({ allowUnknown: true })
      .label("Result");

    this.createdCategoryResponseSchema = Joi.object()
      .keys({
        _id: Joi.object().optional(),
        name: Joi.string().optional(),
        description: Joi.string().optional()
      })
      .options({ allowUnknown: true })
      .label("Result");

    this.pizzaResponseSchema = Joi.array()
      .items({
        pricingRule: Joi.object()
          .keys({
            fromDate: Joi.date(),
            toDate: Joi.date(),
            discountType: Joi.string(),
            discount: Joi.number()
          })
          .optional(),
        categoryIDs: Joi.array()
          .items(Joi.object())
          .optional(),
        _id: Joi.object().optional(),
        type: Joi.string().optional(),
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        price: Joi.number().optional(),
        discountPrice: Joi.number().optional(),
        image: Joi.string().optional(),
        discountAmount: Joi.number().optional(),
        variantProducts: Joi.array()
          .items(
            Joi.object().keys({
              key: Joi.string().optional(),
              values: Joi.string().optional(),
              price: Joi.number().optional()
            })
          )
          .optional()
      })
      .options({ allowUnknown: true });

    this.pizzaDetailResponseSchema = Joi.object()
      .keys({
        pricingRule: Joi.object()
          .keys({
            fromDate: Joi.date(),
            toDate: Joi.date(),
            discountType: Joi.string(),
            discount: Joi.number()
          })
          .optional(),
        categoryIDs: Joi.array().items(Joi.object()),
        _id: Joi.object(),
        type: Joi.string(),
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number(),
        discountPrice: Joi.number(),
        discountAmount: Joi.number(),
        image: Joi.string(),
        variantProducts: Joi.array().items(
          Joi.object().keys({
            key: Joi.string(),
            values: Joi.string(),
            price: Joi.number()
          })
        )
      })
      .options({ allowUnknown: true });

    this.listPizzaResponseSchema = Joi.array()
      .items(
        Joi.object().keys({
          productID: Joi.string(),
          variants: Joi.array().items(
            Joi.object().keys({
              key: Joi.string(),
              value: Joi.string(),
              price: Joi.number()
            })
          ),
          type: Joi.string()
        })
      )
      .options({ allowUnknown: true });

    this.toppingResponse = Joi.array()
      .items({
        _id: Joi.object(),
        type: Joi.string(),
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number()
      })
      .options({ allowUnknown: true });
  }

  responseOptions(schema, options) {
    return {
      status: {
        200: schema,
        500: Joi.object({
          statusCode: Joi.number().example(500),
          error: Joi.string(),
          message: Joi.string()
        }),
        ...options
      },
      failAction: this.handleValidateError
    };
  }

  handleValidateError(request, h, error) {
    return error.isJoi
      ? h.response(error.details[0]).takeover()
      : h.response(error).takeover();
  }
}

module.exports = new ValidateHandle();
