require("dotenv").config();
const alokjwt = require("jsonwebtoken");
const secret = process.env.APP_SECRET

exports.GenerateToken = (data) => {
    const token = alokjwt.sign(data, secret, { expiresIn: "3h" });
    return token;
};
  
exports.ExtractToken = (token) => {
    try {
      const decodedToken = alokjwt.verify(token, secret);
      return decodedToken;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return { error: "Token sudah expired, Harap perbarui token" };
      } else {
        console.error("Token verification failed:", error.message);
        return null;
      }
    }
};
  