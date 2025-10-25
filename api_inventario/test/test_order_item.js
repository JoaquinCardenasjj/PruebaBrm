const { Order, OrderItem, Product } = require('../src/models');


(async () => {
  try {
    const result = await Order.findAll({
      include: [{ model: OrderItem, include: [Product] }]
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
