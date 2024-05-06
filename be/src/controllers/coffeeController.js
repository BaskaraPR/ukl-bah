const coffeeModel = require("../db/models/index").coffee
const {Op} = require("sequelize")
const upload = require("../controllers/upload-Image").single(`image`)

exports.addCoffee = async(request,response) =>{
    try {
        upload(request, response, async (error) => {
            if(error){
                return response.json({
                    success:false,
                    message: error.message
                })
            }
            if (!request.file) {
                return response.json({
                    success:false,
                    message:"Image Tidak ditemukan"
                })
              }
            let newcoffee = {
                name : request.body.name,
                size: request.body.size,
                price: request.body.price,
                image: request.file.filename,
            };
            coffeeModel.create(newcoffee);
            return response.json({
                success:true,
                data:newcoffee,
                message:'Sukses Menambah Data coffee'
            })
        })
    } catch (error) {
        return response.json({
            success:false,
            message:error.message
        })
    }
}

exports.findCoffee = async(request, response) =>{
    try {
        let search = request.params.search
        let coffees = await coffeeModel.findAll({
            where: {
              [Op.or]: [
                { name: { [Op.substring]: search } },
                { price: { [Op.substring]: search } },
                { size: { [Op.substring]: search } },
              ],
            },
          });
        if(!coffees.length){
            return response.json({
                success:false,
                message:'coffee Tidak Ditemukan'
            })
        }
        return response.json({
            success:true,
            data:coffees,
            message:'Sukses Mendapatkan Data'
        })
    } catch (error) {
        return response.json({
            success:false,
            message:error.message
        })
    }
}

exports.updateCoffe = async(request, response) =>{
    try {
        upload(request, response, async (error) => {
            if(error){
                return response.json({
                    success:false,
                    message: error.message
                })
            }
        })
        const coffee_id = request.params._id
        let selectedcoffee = await coffeeModel.findOne({
            where: { coffee_id: coffee_id },
          })
        let updatedcoffee = {
            name:request.body.name,
            price:request.body.price,
            size:request.body.size
        }
        if(!selectedcoffee){
            return response.json({
                success: false,
                message:'Data Tidak Ditemukan'
            })
        }
        if (request.file) {
            if (selectedcoffee) {
              const oldImage = selectedcoffee.image;
              const pathImage = path.join(__dirname, "../images", oldImage);
    
              try {
                await fs.unlink(pathImage);
              } catch (error) {
                console.error("Gagal menghapus image:", error);
              }
    
              updatedcoffee.image = request.file.filename;
            }
          }
        await coffeeModel.update(updatedcoffee, {where:{coffee_id: coffee_id}})
        return response.json({
            success: true,
            data: updatedcoffee,
            message: 'Sukses Update Data coffee'
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteCoffee = async (request, response) =>{
    try {
        let coffee_id = request.params._id
        const coffeeData = await coffeeModel.findOne({
            where: { coffee_id: coffee_id }
        })
        const result = await coffeeModel.destroy({ where: { coffee_id: coffeeData.coffee_id } });
        if (!result) {
            return response.json({
                success:false,
                message:'Data Tidak Ditemukan'
            })
        }
        return response.json({
            success: true,
            data: coffeeData,
            message: 'Sukses Delete Data coffee'
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
    
}