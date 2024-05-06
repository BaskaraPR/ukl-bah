const orderModel = require("../db/models/index").order_list
const detailModel = require("../db/models/index").order_detail
const coffeeModel = require("../db/models/index").coffee

exports.addOrder = async (request, response) => {
    try {
  
      const newOrder = {
        customer_name: request.body.customer_name,
        order_type: request.body.order_type,
        order_date: request.body.order_date
      }
  
      const createdOrder = await orderModel.create(newOrder)
  
      let order_id = createdOrder.order_id
      let total = 0
      const order_detail = request.body.order_detail
  
      for (let i = 0; i < order_detail.length; i++) {
        order_detail[i].order_id = order_id;
      }
      const updatedDetail = await Promise.all(
        order_detail.map(async (detail) => {
          const { coffee_id, quantity } = detail
          const coffee = await coffeeModel.findByPk(coffee_id)
          if (!coffee) {
            throw new Error(`kopi dengan ${coffee_id} Tidak ditemukan`)
          }
          total = coffee.price * quantity
          return { ...detail, order_id: order_id, total }
        })
      )
      await detailModel.bulkCreate(updatedDetail);
      
      await detailModel.update(
        { price: total},
        { where: { order_id: order_id } }
      )
      return response.json({
        success: true,
        data: createdOrder,
        message: 'Sukses Menambah order'
      })
    } catch (error) {
      return response.json({
        success: false,
        message: error.message
      })
    }
  };

exports.getAllorder = async (_, response) => {
    try {
      const dataorder = await orderModel.findAll({
        include:
        [
            {
              model: detailModel,
              as: "detailOrder",
              attributes: ["coffee_id", "price", "quantity"] 
            },
        ],
        order: [["createdAt", "DESC"]],
      });
  
      return response.json({
        success: true,
        data: dataorder,
        message: 'Sukses Mengambil Data order'
      })
    } catch (error) {
      return response.json({
        success: false,
        message: error.message
      })
    }
};