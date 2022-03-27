const router = require("express").Router();
const { v4: uuid } = require("uuid");
// const stripe = require("stripe")(process.env.STRIPE_KEY);
const stripe = require("stripe")(
  "sk_test_51KadArSGLjUHhsp5xER6DhL9LtHD4oiM6Wolh64KdsTfb1iqSicFgQledsW90P8CmbMKpcf3yO7kovOd0ZdnByD700lyrYHtZY"
);

router.post("/payment", async (req, res) => {
  const { paymentMethodType, currency, amount, shipping_address } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method_types: [paymentMethodType],
      shipping_address,
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
