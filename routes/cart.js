const Cart = require("../modules/Cart");
const {
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken.");

const router = require("express").Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status.json(error);
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json(`${deletedCart.id} has been deleted`);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.params.userId,
    });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
