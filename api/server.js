const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const poros = require("./routes/poros");
const join = require("./routes/join");
const part = require("./routes/part");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(poros);
app.use(join)
app.use(part)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});