require("dotenv").config();
const Port = process.env.PORT;
const bodyParser = require("body-parser");
const express = require(`express`);
const cors = require(`cors`);
const app = express();
const adminRoute = require("./routes/adminRoute");
const coffeeRoute = require("./routes/coffeeRoute");
const orderRoute = require("./routes/orderRoute")

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use("/admin", adminRoute)
app.use("/coffee", coffeeRoute)
app.use("/order",orderRoute)

app.listen(Port, () => {
    console.log(" Server gyatt on 8000 gyatatta",);
});
  