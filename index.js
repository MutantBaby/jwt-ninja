const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const router = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

require("./database");

app.use(router);

app.listen(3000);
