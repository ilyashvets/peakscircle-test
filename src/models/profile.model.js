const mongoose = require('mongoose');
const ProductModel = require('./product.model');
const OrderModel = require('./order.model');

const profileSchema = new mongoose.Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  }
})

profileSchema.post('findOneAndDelete', async (document, next) => {
  if (!document) return next()

  const orders = await OrderModel.find({ profile_id: document.id }).exec()
  await Promise.all(orders.map(order => OrderModel.findOneAndDelete({_id: order.id})))

  next()
})


module.exports = mongoose.model('Profile', profileSchema)