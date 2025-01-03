const { Router } = require("express")

const productRouter = require('./productRouter')
const categoryRouter = require("./categoryRouter")
const userRouter = require("./userRouter")
const authenticateToken = require("../middlewares/authenticate")


const router = Router()

router.get('/', authenticateToken, (req, res) => {
    
    // console.log(req.user);
    // localStorage.setItem('user',req.user)
    res.render('index',{ user: req.user || null })
})
router.use('/user', userRouter)
router.use('/category',categoryRouter)
router.use('/product',productRouter)


module.exports = router