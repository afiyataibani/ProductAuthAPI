const { Router } = require("express")
const productController = require("../controllers/productController")
const { uploadImage } = require("../middlewares/uploadImage");
const authenticateToken = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorize");

const productRouter = Router()

productRouter.get('/add-product', authenticateToken, productController.addProductPage);
productRouter.post('/add-product', uploadImage, authenticateToken, authorizeRoles('admin'), productController.addProduct);

productRouter.get('/view-product', authenticateToken, productController.getProduct);

productRouter.get('/edit-product/:id', authenticateToken, productController.updateProductPage)
productRouter.post('/edit-product/:id', uploadImage, authenticateToken, authorizeRoles('admin'), productController.updateProduct);

productRouter.get('/delete-product/:id', authenticateToken, authorizeRoles('admin'), productController.deleteProduct);

module.exports = productRouter;