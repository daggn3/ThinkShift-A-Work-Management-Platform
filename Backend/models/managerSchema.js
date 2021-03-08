const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const managerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true},
    department: {type: String},
    employees: [{ type: mongoose.Types.ObjectId, required: true, ref: "Employee"}]
});

module.exports = mongoose.model("Manager", managerSchema);