const { Router } = require("express")
const userController = require("../controllers/userController")
const authenticateToken = require("../middlewares/authenticate")

const userRouter = Router()

userRouter.get('/signup',userController.registerPage)
userRouter.post('/signup', userController.register)
userRouter.get('/login', userController.loginPage)
userRouter.post('/login', userController.login)
userRouter.get('/logout', userController.logout)

userRouter.post("/cart/add", authenticateToken, userController.addToCart);
userRouter.get("/view-cart", authenticateToken, userController.viewCart);

module.exports = userRouter