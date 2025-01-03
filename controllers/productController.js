const categoryModel = require("../models/categorySchema");
const Product = require("../models/productSchema");
const fs = require("fs");

(module.exports.addProductPage = async (req, res) => {
  let categorys = await categoryModel.find();
  return res.render("./pages/add-product", {
    categorys,
  });
}),
  (exports.getProduct = async (req, res) => {
    const products = await Product.find().populate("categoryId");
    return res.render("./pages/view-product", { products });
  });

module.exports.addProduct = async (req, res) => {
  if (req.file) {
    req.body.image = req.file.path;
  }
  const newProduct = new Product(req.body);
  await newProduct.save();
  return res.redirect(req.get("Referrer") || "/");
};

module.exports.updateProductPage = async (req, res) => {
  try {
    const productData = await Product.findById(req.params.id);
    return res.render("./pages/edit-product", { product: productData });
  } catch (error) {
    console.log(error);
  }
};

// Update product
module.exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }
  if (req.file) {
    req.body.image = req.file.path;
    fs.unlinkSync(req.body.oldImage);
  } else {
    req.body.image = req.body.oldImage;
  }
  let productData = await Product.findByIdAndUpdate(req.params.id, req.body);
  return res.redirect("/product/view-product");
};

// Delete product
module.exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }
  fs.unlinkSync(product.image);
  return res.redirect(req.get("Referrer") || "/");
};
