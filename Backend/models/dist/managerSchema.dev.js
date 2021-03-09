"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var managerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String
  },
  employees: [{
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Employee"
  }],
  emailSent: {
    type: Date
  }
});
module.exports = mongoose.model("Manager", managerSchema);