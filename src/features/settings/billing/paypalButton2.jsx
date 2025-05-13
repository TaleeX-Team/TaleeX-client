import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useTokens } from "./useTokens";

const PayPalButton2 = ({
  amount,
  tokenCount,
  tokenPrice,
  currency = "USD",
  onSuccess,
}) => {
  const { buyTokens } = useTokens();

  // Ensures amounts are rounded to two decimal places
  const formatAmount = (value) => {
    return parseFloat(value).toFixed(2);
  };

  return (
    <>
      <PayPalButtons
        createOrder={(data, actions) => {
          console.log("Creating order...");
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    value: formatAmount(amount),
                    currency_code: currency,
                    breakdown: {
                      item_total: {
                        value: formatAmount(amount),
                        currency_code: currency,
                      },
                    },
                  },
                  description: `Purchase ${tokenCount} tokens`,
                  items: [
                    {
                      name: "Tokens",
                      quantity: tokenCount.toString(),
                      unit_amount: {
                        value: formatAmount(tokenPrice),
                        currency_code: currency,
                      },
                    },
                  ],
                },
              ],
            })
            .then((orderId) => {
              console.log("Order Created: ", orderId);
              return orderId;
            })
            .catch((error) => {
              console.error("Error creating order:", error);
              alert("An error occurred while creating the PayPal order.");
              return null;
            });
        }}
        onApprove={(data, actions) => {
          console.log("Payment approved by user...");
          return actions.order
            .capture()
            .then((details) => {
              console.log("Payment Successful:", details);
              const amountPaid = formatAmount(amount);
              if (onSuccess) onSuccess();
              buyTokens({ amountPaid, currency });
            })
            .catch((error) => {
              console.error("Error capturing payment:", error);
            });
        }}
        onError={(error) => {
          console.error("PayPal error:", error);
          alert("An error occurred with PayPal.");
        }}
      />
    </>
  );
};

export default PayPalButton2;
