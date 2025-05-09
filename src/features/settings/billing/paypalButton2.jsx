import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useTokens } from './useTokens';

const PayPalButton2 = ({ amount, tokenCount, tokenPrice, currency = "USD" , onSuccess}) => {
  const { buyTokens } = useTokens();
  return (
    <>
      <PayPalButtons
        createOrder={(data, actions) => {
          console.log("Creating order...");
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toString(),
                  currency_code: currency,
                  breakdown: {
                    item_total: {
                      value: amount.toString(),
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
                      value: tokenPrice.toString(),
                      currency_code: currency,
                    },
                  },
                ],
              },
            ],
          }).then((orderId) => {
            console.log("Order Created: ", orderId);
            return orderId;
          }).catch((error) => {
            console.error("Error creating order:", error);
            alert("An error occurred while creating the PayPal order.");
            return null;
          });
        }}
        onApprove={(data, actions) => {
            console.log("Payment approved by user...");
          
            return actions.order.capture().then((details) => {
              console.log("Payment Successful:", details);
              const amountPaid = amount.toString();
              const currency = "USD";
              if (onSuccess) onSuccess(); 
              buyTokens({ amountPaid, currency });
            }).catch((error) => {
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


