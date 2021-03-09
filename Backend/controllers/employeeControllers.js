// const HttpError = require("../models/httperror")
// const {validationResult} = require("express-validator")
// const Employee = require("../models/employeeSchema")

// const getTimetable = async (req, res, next) => {

// // Function to get an individual employee's timetable

//     let employee;

//     try {
//         // Find employee, respond with timetable
//         employee = await Employee.findById(req.userData.id)
//         res.send(employee.timetable)
//     } catch (err) {
//         const error = new HttpError("Could not get timetable", 500)
//         return next(error)
//     }
// }

// exports.getTimetable = getTimetable

// const getEmployee = async (req, res, next) => {

//     // Function to get one employee details
    
//         res.status(201).send( {name: req.userDate.name, id: req.userData.id} ) 
    
//     }
    
//     exports.getTimetable = getTimetable
//     exports.getEmployee = getEmployee


const HttpError = require("../models/httperror")
const {validationResult} = require("express-validator")
const Employee = require("../models/employeeSchema")

const getTimetable = async (req, res, next) => {

// Function to get an individual employee's timetable

    let employee;

    try {
        // Find employee, respond with timetable
        employee = await Employee.findById(req.userData.id)
        return res.send(employee.timetable)
    } catch (err) {
        const error = new HttpError("Could not get timetable", 500)
        return next(error)
    }
}

exports.getTimetable = getTimetable
