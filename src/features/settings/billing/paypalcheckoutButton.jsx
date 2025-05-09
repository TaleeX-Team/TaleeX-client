import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useTokens } from './useTokens';


const PayPalButton = ({ pack }) => {
  const { buyTokenPack } = useTokens();
  return (
    <>
    <div className="w-full flex justify-center">
    <PayPalButtons
       style={{
        layout: "horizontal",
        color: "blue",
        shape: "rect",
        label: "pay",
        height: 40,
        tagline: false,
      }}
      
      createOrder={(data, actions) => {
        console.log("Creating order...");
        
        return actions.order.create({
          purchase_units: [
            {
              reference_id: pack._id,
              amount: {
                value: pack.price.toString(),
                currency_code: pack.currency || "USD",
                breakdown: {
                  item_total: {
                    value: pack.price.toString(),
                    currency_code: pack.currency || "USD",
                  },
                },
              },
              description: `Purchase ${pack.name} pack of ${pack.tokens} tokens`,
              items: [
                {
                  name: pack.name,
                  quantity: "1",
                  unit_amount: {
                    value: pack.price.toString(),
                    currency_code: pack.currency || "USD",
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
          return null;
        });
      }}
      onApprove={(data, actions) => {
        console.log("Payment approved by user...");

        return actions.order.capture().then((details) => {
          console.log("Payment Successful:", details);
          buyTokenPack(pack._id);
        }).catch((error) => {
          console.error("Error capturing payment:", error);
        });
      }}
      onError={(error) => {
        console.error("PayPal error:", error);
      }}
    />
    </div>
    </>
  );
};

export default PayPalButton;

