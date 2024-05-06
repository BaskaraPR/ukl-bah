const adminModel = require("../db/models/index").admin
const { PasswordHashing } = require("../helpers/Password");

exports.addAdmin = async (request, response) => {
    try {
      const newAdmin = {
        name: request.body.name,
        email: request.body.email,
        password: await PasswordHashing(request.body.password),
      };
  
      await adminModel.create(newAdmin);
  
      return response.json({
        success: true,
        message:"Berhasil Membuat data admin",
        data: newAdmin
      })
    } catch (error) {
      return response.json({
        success:false,
        message:error.message
      })
    }
};

