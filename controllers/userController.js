const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const SECRET_KEY = process.env.SECRET_KEY || "user";
const TOKEN_COOKIE_NAME = "auth_token";

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      roles: user.roles,
      email: user.email,
    },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
}

// Register a user
module.exports.registerPage = (req, res) => {
  return res.render("./pages/signup");
};
module.exports.loginPage = (req, res) => {
  return res.render("./pages/login");
};

module.exports.register = async (req, res) => {
  const { username, password, email, roles } = req.body;
  const existingUser = await User.findOne({ username });
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({ username, passwordHash, email, roles });

  if (!username || !password || !email || !roles) {
    return res
      .status(400)
      .json({ message: "Username, password, and roles are required." });
  }

  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  await newUser.save();
  return res.redirect("/user/login");
};

// Login a user
module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const token = generateToken(user);

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.redirect("/");
};

module.exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate("cart");
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if the product already exists in the cart
    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (cartItem) {
      cartItem.quantity = Number(cartItem.quantity) + Number(quantity); // Update quantity
    } else {
      user.cart.push({ productId, quantity }); // Add new item to cart
    }

    await user.save();
    return res.redirect("/product/view-product");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding product to cart", error });
  }
};

module.exports.viewCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate({
      path: "cart",
      populate: {
        path: "productId",
        model: Product,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.render("./pages/cart", { cart: user.cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching cart data", error });
  }
};

// Logout a user
module.exports.logout = (req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME);
  return res.redirect("/user/login");
};
