"use strict";

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
var HttpError = require("../models/httperror");

var _require = require("express-validator"),
    validationResult = _require.validationResult;

var Employee = require("../models/employeeSchema");

var getTimetable = function getTimetable(req, res, next) {
  var employee, error;
  return regeneratorRuntime.async(function getTimetable$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Employee.findById(req.userData.id));

        case 3:
          employee = _context.sent;
          return _context.abrupt("return", res.send(employee.timetable));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          error = new HttpError("Could not get timetable", 500);
          return _context.abrupt("return", next(error));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getTimetable = getTimetable;