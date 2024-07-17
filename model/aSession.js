const mongoose = require("mongoose");
const db = require("../config/config");

const academicSessionSchema = new mongoose.Schema(
  {
    academicSession: String,
  },
  { timestamps: true }
);

const academicSessionModel = db.coursesdb.model("academicSession", academicSessionSchema);

module.exports = academicSessionModel;
