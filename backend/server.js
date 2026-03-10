const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", require("./routes/Auth"));
app.use("/health", require("./routes/healthRoutess"));
app.use("/track", require("./routes/selfRoutess"));
app.use("/self", require("./routes/trackRoutess"));
app.use("/consult", require("./routes/consultroutess.js"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
