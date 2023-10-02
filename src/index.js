const mongoose = require('mongoose')
const OrderModel = require('./models/order.model')
const ProfileModel = require('./models/profile.model')
const ProductModel = require('./models/product.model')
const { fillMockData, removeOrder, purchaseOrder, removeProfile } = require('./service');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

main().then(async () => {
  // Fill database
  //
  // await fillMockData()


  // Create order
  //
  // const profile = await ProfileModel.findOne()
  // const [product1, product2, product3] = await ProductModel.find()
  // await purchaseOrder(profile.id, [
  //   {
  //     id: product1.id,
  //     quantity: 5
  //   },
  //   {
  //     id: product2.id,
  //     quantity: 333,
  //   },
  //   {
  //     id: product3.id,
  //     quantity: 3
  //   }
  // ])


  // Remove order
  //
  // const order = await OrderModel.findOne()
  // await removeOrder(order.id)


  // Remove profile
  //
  // const profile = await ProfileModel.findOne()
  // await removeProfile(profile.id)


  // Update order
  //
  // todo update order
}).catch(err => console.log(err))