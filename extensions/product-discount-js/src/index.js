// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
* @typedef {import("../generated/api").InputQuery} InputQuery
* @typedef {import("../generated/api").FunctionResult} FunctionResult
* @typedef {import("../generated/api").Target} Target
* @typedef {import("../generated/api").ProductVariant} ProductVariant
*/

/**
* @type {FunctionResult}
*/
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export default /**
* @param {InputQuery} input
* @returns {FunctionResult}
*/
  (input) => {
    // Define a type for your configuration, and parse it from the metafield
    /**
    * @type {{
    *  quantity: number
    *  percentage: number
    *  discountTags: string[]
    *  discardedTags: string[]
    *  sessionStatus: boolean
    * }}
    */
    const configuration = JSON.parse(
      input?.discountNode?.metafield?.value ?? "{}"
    );

    console.error('Aver');

    /* if (!configuration.quantity || !configuration.percentage) {
      return EMPTY_DISCOUNT;
    } */

    console.error('No tira los tags')
    const targets = input.cart.lines
      // Use the configured quantity instead of a hardcoded value
      .filter(line => line.quantity >= configuration.quantity &&
        line.merchandise.__typename == "ProductVariant" && !line.merchandise.product.deny && line.merchandise.product.allow)
      .map(line => {
        const variant = /** @type {ProductVariant} */ (line.merchandise);
        console.error(variant.product.productType);
        return /** @type {Target} */ ({
          productVariant: {
            id: variant.id
          }
        });
      });

    console.error('No tira los tags 2')

    if (!targets.length) {
      console.error("No cart lines qualify for volume discount.");
      return EMPTY_DISCOUNT;
    }

    return {
      discounts: [
        {
          targets,
          value: {
            percentage: {
              // Use the configured percentage instead of a hardcoded value
              value: configuration.percentage.toString()
            }
          }
        }
      ],
      discountApplicationStrategy: DiscountApplicationStrategy.First
    };
  };
