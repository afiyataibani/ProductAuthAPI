const Category = require("../models/categorySchema");
const fs = require("fs");

(module.exports.addCategoryPage = async (req, res) => {
  return res.render("./pages/add-category");
}),
  (exports.getCategories = async (req, res) => {
    const categories = await Category.find();
    return res.render("./pages/view-category", { categories });
  });

exports.addCategory = async (req, res) => {
  if (req.file) {
    req.body.image = req.file.path;
  }
  const newCategory = new Category(req.body);
  await newCategory.save();
  return res.redirect(req.get("Referrer") || "/");
};

(exports.updateCategoryPage = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = await Category.findById(id);
    return res.render("./pages/edit-category", { category: categoryData });
  } catch (error) {
    console.log(error);
  }
}),
  (exports.updateCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    if (req.file) {
      req.body.image = req.file.path;
      fs.unlinkSync(req.body.oldImage);
    } else {
      req.body.image = req.body.oldImage;
    }
    let categoryData = await Category.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    return res.redirect("/category/view-category");
  });

exports.deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found." });
  }
  fs.unlinkSync(category.image);
  return res.redirect(req.get("Referrer") || "/");
};
