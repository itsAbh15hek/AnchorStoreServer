const router = require("express").Router();
const res = require("express/lib/response");
const User = require("../modules/User");
const Cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: Cryptojs.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});
//Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    !user && res.status(401).json("Wrong Credentials");
    const hashedPassword = Cryptojs.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const password = hashedPassword.toString(Cryptojs.enc.Utf8);
    req.body.password !== password && res.status(401).json("Wrong Credentials");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {
        expiresIn: "3d",
      }
    );

    const { pass, ...rest } = user._doc;
    res.status(200).json({ ...rest, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
