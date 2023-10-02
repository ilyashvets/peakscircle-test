const mongoose = require('mongoose');
const { fillMockData, purchaseOrder, removeOrder, removeProfile } = require('./service');
const OrderModel = require('./models/order.model')
const ProfileModel = require('./models/profile.model')
const ProductModel = require('./models/product.model')

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await fillMockData()
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Purchase order', () => {
  test('Product quantity should be less', async () => {
    const profile = await ProfileModel.findOne()
    const [product1, product2, product3] = await ProductModel.find()

    await purchaseOrder(profile.id, [
      {
        id: product1.id,
        quantity: 5
      },
      {
        id: product2.id,
        quantity: 333, // More than exist in storage, don`t order this product
      },
      {
        id: product3.id,
        quantity: 3
      }
    ])

    const products = await ProductModel.find()

    expect(products[0].quantity).toBe(product1.quantity - 5)
    expect(products[1].quantity).toBe(product2.quantity)
    expect(products[2].quantity).toBe(product3.quantity - 3)
  });
})

describe('Remove order', () => {
  test('The quantity of the product should increase', async () => {
    const order = JSON.parse(JSON.stringify(
      await OrderModel.findOne()
    ))

    const productsBeforeRemove = await ProductModel.find({
      $or: order.products.map(({product_id}) => ({ _id: product_id }))
    })

    await removeOrder(order._id)

    const productsAfterRemove = await ProductModel.find({
      $or: order.products.map(({product_id}) => ({ _id: product_id }))
    })

    for (let i = 0; i < productsAfterRemove.length; i++) {
      const productBeforeRemove = productsBeforeRemove[i]
      const productAfterRemove = productsAfterRemove[i]

      expect(productAfterRemove.quantity).toBe(productBeforeRemove.quantity + order.products[i].quantity)
    }

    const currentOrder = await OrderModel.findOne({_id: order._id})
    expect(currentOrder).toBeNull()
  });
})

describe('Remove profile', () => {
  let profile, products;

  test('Profile should not exist', async () => {
    profile = await ProfileModel.findOne()
    const [product1, product2] = await ProductModel.find()

    products = [product1, product2]

    await purchaseOrder(profile.id, [
      {
        id: product1.id,
        quantity: 5
      },
      {
        id: product2.id,
        quantity: 3
      }
    ])

    await removeProfile(profile.id)

    const currentProfile = await ProfileModel.findOne({_id: profile.id})
    expect(currentProfile).toBeNull()
  })

  test('Orders for this profile should not exist', async () => {
    const order = await OrderModel.findOne({profile_id: profile.id})
    expect(order).toBeNull()
  })

  test('The quantity of the product should be restored', async () => {
    const currentProducts = await ProductModel.find({
      $or: products.map(({_id}) => ({ _id }))
    })

    for (let i = 0; i < currentProducts.length; i++) {
      const currentProduct = currentProducts[i]
      expect(currentProduct.quantity).toBe(23) // 23 is default product quantity
    }
  })
})