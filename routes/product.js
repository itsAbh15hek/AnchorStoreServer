const Product = require("../modules/Product");
const { verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken.");

const router = require("express").Router();

// CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE
router.delete("/:title", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      title: req.params.title,
    });
    res.status(200).json(`${deletedProduct.title} has been deleted`);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET
router.get("/:title", async (req, res) => {
  try {
    const product = await Product.findOne({
      title: req.params.title,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) products = await Product.find().sort({ _id: -1 }).limit(5);
    else if (qCategory)
      products = await Product.find({ categories: { $in: [qCategory] } });
    else products = await Product.find();

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
