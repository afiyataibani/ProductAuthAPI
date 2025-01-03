
const { Router } = require("express")
const categoryController = require("../controllers/categoryController")
const { uploadImage } = require("../middlewares/uploadImage");
const authenticateToken = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorize");

const categoryRouter = Router()

categoryRouter.get('/add-category', authenticateToken, categoryController.addCategoryPage);
categoryRouter.post('/add-category',uploadImage, authenticateToken, authorizeRoles('admin'), categoryController.addCategory);

categoryRouter.get('/view-category', authenticateToken, categoryController.getCategories);

categoryRouter.get('/edit-category/:id', authenticateToken, categoryController.updateCategoryPage);
categoryRouter.post('/edit-category/:id',uploadImage, authenticateToken, authorizeRoles('admin'), categoryController.updateCategory);

categoryRouter.get('/delete-category/:id', authenticateToken, authorizeRoles('admin'), categoryController.deleteCategory);


module.exports = categoryRouter
