const mongoose = require('mongoose');
const ProductModel = require('./product.model')

const orderSchema = new mongoose.Schema({
  profile_id: {
    type: String,
    index: true
  },
  products: [{
    product_id: {
      type: String,
      index: true,
      ref: ProductModel
    },
    quantity: {
      type: Number
    }
  }]
})

orderSchema.post('save', async (document, next) => {
  await Promise.all(document.products.map(product =>
    ProductModel.updateOne({_id: product.product_id}, { $inc: { quantity: -product.quantity } })
  ))

  next()
})

orderSchema.post(['findOneAndDelete', 'deleteMany'], async (document, next) => {
  if (!document) return next()

  await Promise.all(document.products.map(product =>
    ProductModel.updateOne({_id: product.product_id}, { $inc: { quantity: product.quantity } })
  ))

  next()
})

module.exports = mongoose.model('Order', orderSchema)