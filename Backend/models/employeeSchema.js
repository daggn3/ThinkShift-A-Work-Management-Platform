const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true},
    department: { type: String, required: true},
    mobile: { type: String, required: true },
    timetable: [ {
                    title: String,
                    staffId: mongoose.Types.ObjectId,
                    startDate: Date,
                    endDate: Date,
                    id: Number,
                } ],

    manager: { type: mongoose.Types.ObjectId, required: true, ref: "Manager"}
});

module.exports = mongoose.model("Employee", employeeSchema);
