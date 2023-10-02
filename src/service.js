const ProductModel = require('./models/product.model');
const ProfileModel = require('./models/profile.model');
const OrderModel = require('./models/order.model');

async function fillMockData() {
  for (let i = 1; i < 11; i++) {
    const product = new ProductModel({
      title: `Product${i}`,
      price: 999,
      quantity: 23
    })

    await product.save()
  }

  for (let i = 1; i < 4; i++) {
    const profile = new ProfileModel({
      first_name: `Will${i}`,
      last_name: `Smith${i}`,
      email: `email${i}@gmail.com`
    })

    await profile.save()
  }
}

async function purchaseOrder(profileId, productsToPurchase) {
  const productsToOrder = await ProductModel.find({
    $or: productsToPurchase.map(({id, quantity}) => ({
      $and: [
        { _id: id },
        { quantity: { $gte: quantity } }
      ]
    }))
  })

  const availableProducts = findAvailableProducts(productsToPurchase, productsToOrder)

  const order = new OrderModel({
    profile_id: profileId,
    products: availableProducts
  })

  await order.save()
}

function findAvailableProducts(purchase, order) {
  const notAvailable = []
  const available = []

  for (const product of purchase) {
    const existProduct = order.find(({id}) => id === product.id)
    if (!existProduct) notAvailable.push(product)
    else {
      available.push({
        product_id: product.id,
        quantity: product.quantity
      })
    }
  }

  notAvailable.forEach(product => console.log(`Product ID: ${product.id} is not available in the required quantity.`))

  return available
}

async function removeOrder(orderId) {
  await OrderModel.findOneAndDelete({_id: orderId})
}

async function removeProfile(profileId) {
  await ProfileModel.findOneAndDelete({_id: profileId})
}


module.exports = {
  fillMockData,
  purchaseOrder,
  removeOrder,
  removeProfile,
}