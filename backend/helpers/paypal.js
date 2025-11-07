// helpers/paypal.js
import paypal from "@paypal/paypal-server-sdk";
import dotenv from "dotenv";

dotenv.config();

// Create a PayPal client
const client = new paypal.Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  environment:
    process.env.NODE_ENV === "production"
      ? paypal.Environment.Production
      : paypal.Environment.Sandbox,
  timeout: 0, // optional
});

// Create an instance of the OrdersController
const ordersController = new paypal.OrdersController(client);

export { client, ordersController };
