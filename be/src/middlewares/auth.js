const adminModel = require("../db/models/index").admin
const { PasswordCompare } = require("../helpers/Password");
const {
  GenerateToken,
  ExtractToken,
} = require("../helpers/GenerateToken");

exports.authentication = async (request, response) => {
  try {
    const { email, password } = request.body;

    const findAdmin = await adminModel.findOne({
      where: { email: email },
    });

    if (!findAdmin) {
      return response.json({
        success:false,
        message:"admin tidak ditemukan"
      })
    }

    const matched = await PasswordCompare(password, findAdmin.password);

    if (!matched) {
      return response.json({
        success:false,
        message:"password saalah"
      })
    }

    const dataAdmin = {
      id: findAdmin.AdminID,
      name: findAdmin.name,
      email: findAdmin.email,
    };

    const token = GenerateToken(dataAdmin);

    const responseData = {
      id: dataAdmin.adminID,
      nama: dataAdmin.nama,
      adminname: dataAdmin.name,
      token: token,
    };

    return response.json({
        status: 200,
        success:true,
        logged: true,
        data: responseData,
        message: "Login berhasil"
    })
  } catch (error) {
    return response.json({
        success:false,
        message: error.message
    })
  }
};

exports.authorization = async (request, response, next) => {
  try {
    let authToken = request.headers.authorization;

    if (!authToken) {
      return response.json({
        success:false,
        message:"token tidak ditemukan"
      })
    }

    let tokenKey = authToken.split(" ")[1];

    const decodedToken = ExtractToken(tokenKey);
    if (!decodedToken) {
      return response.json({
        success:false,
        message:"unauthorized admin"
      })
    }

    if (decodedToken.error) {
      return response.json({
        success:false,
        message:decodedToken.error
      })
    }
    response.locals.email = decodedToken.email;
    next();
  } catch (error) {
    return response.json({
        success:false,
        message:error.message
    })
  }
};