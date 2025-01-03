const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    image: String,
}, {
    timestamps: true
})

const categoryModel = mongoose.model("categoryTbl", categorySchema)

module.exports = categoryModel;