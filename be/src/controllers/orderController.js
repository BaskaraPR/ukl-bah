const orderModel = require("../db/models/index").order_list
const detailModel = require("../db/models/index").order_detail

exports.addOrder = async (request, response) => {
    try {
  
      const newOrder = {
        customer_name: request.body.customer_name,
        order_type: request.body.order_type,
        order_date: request.body.order_date
      }
  
      const createdOrder = await orderModel.create(newOrder)
  
      let order_id = createdOrder.order_id
      const order_detail = request.body.order_detail
  
      for (let i = 0; i < order_detail.length; i++) {
        order_detail[i].order_id = order_id;
      }

      await detailModel.bulkCreate(order_detail);
  
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