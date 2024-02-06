const mongoose = require("mongoose");

const dbConn = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
    throw new Error("Not Connected");
  }
};

module.exports = {
  dbConn,
};
