"use strict";

var HttpError = require("../models/httperror");

var _require = require("express-validator"),
    validationResult = _require.validationResult;

var Employee = require("../models/employeeSchema");

var Manager = require("../models/managerSchema");

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var nodemailer = require("nodemailer");

var createEmployee = function createEmployee(req, res, next) {
  var _req$body, name, email, password, department, mobile, check, error, hashedPassword, _error, timetable, manager, createdEmployee, creator, _error2, _error3, sess, _error4, transporter, message, mailOptions;

  return regeneratorRuntime.async(function createEmployee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Function to create an employee
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, department = _req$body.department, mobile = _req$body.mobile;
          _context.next = 3;
          return regeneratorRuntime.awrap(Employee.find({
            email: email
          }));

        case 3:
          check = _context.sent;

          if (!(check.length >= 1)) {
            _context.next = 7;
            break;
          }

          error = new HttpError("Employee with this email already exists", 422);
          return _context.abrupt("return", next(error));

        case 7:
          _context.prev = 7;
          _context.next = 10;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 12));

        case 10:
          hashedPassword = _context.sent;
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](7);
          _error = new HttpError("Password issue", 500);
          return _context.abrupt("return", next(_error));

        case 17:
          // Manually creating timetable and adding the employee's manager
          timetable = [];
          manager = req.userData.id; // Creating employee

          createdEmployee = new Employee({
            name: name,
            email: email,
            password: hashedPassword,
            department: department,
            mobile: mobile,
            timetable: timetable,
            manager: manager
          });
          _context.prev = 20;
          _context.next = 23;
          return regeneratorRuntime.awrap(Manager.findById(manager));

        case 23:
          creator = _context.sent;
          _context.next = 30;
          break;

        case 26:
          _context.prev = 26;
          _context.t1 = _context["catch"](20);
          _error2 = new HttpError("Creating Employee failed (1)", 500);
          return _context.abrupt("return", next(_error2));

        case 30:
          if (creator) {
            _context.next = 33;
            break;
          }

          _error3 = new HttpError("Could not find manager", 404);
          return _context.abrupt("return", next(_error3));

        case 33:
          _context.prev = 33;
          _context.next = 36;
          return regeneratorRuntime.awrap(mongoose.startSession());

        case 36:
          sess = _context.sent;
          sess.startTransaction();
          _context.next = 40;
          return regeneratorRuntime.awrap(createdEmployee.save({
            session: sess
          }));

        case 40:
          creator.employees.push(createdEmployee);
          _context.next = 43;
          return regeneratorRuntime.awrap(creator.save({
            session: sess
          }));

        case 43:
          _context.next = 45;
          return regeneratorRuntime.awrap(sess.commitTransaction());

        case 45:
          _context.next = 51;
          break;

        case 47:
          _context.prev = 47;
          _context.t2 = _context["catch"](33);
          _error4 = new HttpError("Creating Employee failed (2)", 500);
          return _context.abrupt("return", next(_error4));

        case 51:
          // Send email to new employee with their login details
          // Set up email authentication
          transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "thinkshiftproject@gmail.com",
              pass: "CA326Project"
            }
          });
          message = "Hi " + createdEmployee.name + ",\n\nYour new employee account has been made, here are your details:\n\n" + "Name: " + createdEmployee.name + "\nPIN: " + req.body.password + "\nMobile No: " + createdEmployee.mobile + "\nManager: " + req.userData.name + "\n\nIf there is anything incorrect, please contact your manager.";
          mailOptions = {
            from: 'thinkshiftproject@gmail.com',
            to: createdEmployee.email,
            subject: 'ThinkShift: Your new employee account has been created!',
            text: message
          }; // Send email, or log eror

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          return _context.abrupt("return", res.status(201).send({
            _id: createdEmployee.id,
            name: createdEmployee.name
          }));

        case 56:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[7, 13], [20, 26], [33, 47]]);
};

var getEmployees = function getEmployees(req, res, next) {
  var eDetails, employees, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, e;

  return regeneratorRuntime.async(function getEmployees$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // Function to get all employees attached to a specific manager
          eDetails = [];
          _context2.next = 3;
          return regeneratorRuntime.awrap(Employee.find({
            manager: req.userData.id
          }));

        case 3:
          employees = _context2.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 7;

          for (_iterator = employees[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            e = _step.value;
            eDetails.push({
              _id: e.id,
              name: e.name,
              email: e.email,
              department: e.department,
              mobile: e.mobile,
              timetable: e.timetable,
              manager: e.manager
            });
          }

          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](7);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 15:
          _context2.prev = 15;
          _context2.prev = 16;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 18:
          _context2.prev = 18;

          if (!_didIteratorError) {
            _context2.next = 21;
            break;
          }

          throw _iteratorError;

        case 21:
          return _context2.finish(18);

        case 22:
          return _context2.finish(15);

        case 23:
          return _context2.abrupt("return", res.status(201).send(eDetails));

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 11, 15, 23], [16,, 18, 22]]);
};

var deleteEmployee = function deleteEmployee(req, res, next) {
  var id, employee, error, _error5;

  return regeneratorRuntime.async(function deleteEmployee$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // Function to delete a certain employee
          id = req.body.id;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Employee.findById(id));

        case 4:
          employee = _context3.sent;

          if (!(employee === null)) {
            _context3.next = 8;
            break;
          }

          error = new HttpError("Employee was not found", 500);
          return _context3.abrupt("return", next(error));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(Employee.deleteOne({
            _id: id
          }));

        case 10:
          res.status(201).send("Employee deleted");
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](1);
          _error5 = new HttpError("Employee not found", 500);
          return _context3.abrupt("return", next(_error5));

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 13]]);
};

var setTimetable = function setTimetable(req, res, next) {
  var employees, eTimetable, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, employee, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, entry, error;

  return regeneratorRuntime.async(function setTimetable$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // Function to set the Timetable state
          eTimetable = []; // find all employees
          // for employee, find all entry in timetable
          // create list of timetable objects
          // save to database

          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Employee.find({
            manager: req.userData.id
          }));

        case 4:
          employees = _context4.sent;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context4.prev = 8;
          _iterator2 = employees[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context4.next = 37;
            break;
          }

          employee = _step2.value;
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context4.prev = 15;

          for (_iterator3 = req.body[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            entry = _step3.value;

            if (entry.staffId == employee.id) {
              eTimetable.push(entry);
            }
          } // Update an individal employees timetable, reset eTimetable for next employee


          _context4.next = 23;
          break;

        case 19:
          _context4.prev = 19;
          _context4.t0 = _context4["catch"](15);
          _didIteratorError3 = true;
          _iteratorError3 = _context4.t0;

        case 23:
          _context4.prev = 23;
          _context4.prev = 24;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 26:
          _context4.prev = 26;

          if (!_didIteratorError3) {
            _context4.next = 29;
            break;
          }

          throw _iteratorError3;

        case 29:
          return _context4.finish(26);

        case 30:
          return _context4.finish(23);

        case 31:
          _context4.next = 33;
          return regeneratorRuntime.awrap(employee.updateOne({
            timetable: eTimetable
          }));

        case 33:
          eTimetable = [];

        case 34:
          _iteratorNormalCompletion2 = true;
          _context4.next = 10;
          break;

        case 37:
          _context4.next = 43;
          break;

        case 39:
          _context4.prev = 39;
          _context4.t1 = _context4["catch"](8);
          _didIteratorError2 = true;
          _iteratorError2 = _context4.t1;

        case 43:
          _context4.prev = 43;
          _context4.prev = 44;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 46:
          _context4.prev = 46;

          if (!_didIteratorError2) {
            _context4.next = 49;
            break;
          }

          throw _iteratorError2;

        case 49:
          return _context4.finish(46);

        case 50:
          return _context4.finish(43);

        case 51:
          res.status(200).send("Timetable has been saved");
          _context4.next = 59;
          break;

        case 54:
          _context4.prev = 54;
          _context4.t2 = _context4["catch"](1);
          console.log(_context4.t2);
          error = new HttpError("Timetable could not be saved", 500);
          return _context4.abrupt("return", next(error));

        case 59:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 54], [8, 39, 43, 51], [15, 19, 23, 31], [24,, 26, 30], [44,, 46, 50]]);
};

var getTimetables = function getTimetables(req, res, next) {
  var employees, timetables, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, employee, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, error;

  return regeneratorRuntime.async(function getTimetables$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          // Function to get timetable of all employees
          timetables = [];
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Employee.find({
            manager: req.userData.id
          }));

        case 4:
          employees = _context5.sent;
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context5.prev = 8;
          _iterator4 = employees[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context5.next = 34;
            break;
          }

          employee = _step4.value;
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context5.prev = 15;

          for (_iterator5 = employee.timetable[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            shift = _step5.value;
            timetables.push(shift);
          }

          _context5.next = 23;
          break;

        case 19:
          _context5.prev = 19;
          _context5.t0 = _context5["catch"](15);
          _didIteratorError5 = true;
          _iteratorError5 = _context5.t0;

        case 23:
          _context5.prev = 23;
          _context5.prev = 24;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 26:
          _context5.prev = 26;

          if (!_didIteratorError5) {
            _context5.next = 29;
            break;
          }

          throw _iteratorError5;

        case 29:
          return _context5.finish(26);

        case 30:
          return _context5.finish(23);

        case 31:
          _iteratorNormalCompletion4 = true;
          _context5.next = 10;
          break;

        case 34:
          _context5.next = 40;
          break;

        case 36:
          _context5.prev = 36;
          _context5.t1 = _context5["catch"](8);
          _didIteratorError4 = true;
          _iteratorError4 = _context5.t1;

        case 40:
          _context5.prev = 40;
          _context5.prev = 41;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 43:
          _context5.prev = 43;

          if (!_didIteratorError4) {
            _context5.next = 46;
            break;
          }

          throw _iteratorError4;

        case 46:
          return _context5.finish(43);

        case 47:
          return _context5.finish(40);

        case 48:
          return _context5.abrupt("return", res.status(200).send(timetables));

        case 51:
          _context5.prev = 51;
          _context5.t2 = _context5["catch"](1);
          error = new HttpError("Timetables could not be retrieved", 500);
          return _context5.abrupt("return", next(error));

        case 55:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 51], [8, 36, 40, 48], [15, 19, 23, 31], [24,, 26, 30], [41,, 43, 47]]);
};

var sendTimetables = function sendTimetables(req, res, next) {
  var employees, message, transporter, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, employee, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _shift, mailOptions, error;

  return regeneratorRuntime.async(function sendTimetables$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          // Function to send each employee their timetable
          message = ""; // Set up email authentication

          transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "thinkshiftproject@gmail.com",
              pass: "CA326Project"
            }
          });
          _context6.prev = 2;
          _context6.next = 5;
          return regeneratorRuntime.awrap(Manager.findById({
            _id: req.userData.id
          }));

        case 5:
          manager = _context6.sent;

          if (!(manager.emailSent >= Date.now() - 1000 * 600)) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", res.status(404).send("It has been less than 10 minutes since you last sent an email, please wait"));

        case 8:
          _context6.next = 10;
          return regeneratorRuntime.awrap(Employee.find({
            manager: req.userData.id
          }));

        case 10:
          employees = _context6.sent;
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context6.prev = 14;
          _iterator6 = employees[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
            _context6.next = 44;
            break;
          }

          employee = _step6.value;
          // Start of message
          message += "Hello " + employee.name + "\n\n" + "Here are your upcoming shifts:" + "\n\n";
          _iteratorNormalCompletion7 = true;
          _didIteratorError7 = false;
          _iteratorError7 = undefined;
          _context6.prev = 22;

          for (_iterator7 = employee.timetable[Symbol.iterator](); !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            _shift = _step7.value;

            // If the shift start date is later than todays date, add to the email 
            if (Date.parse(_shift.startDate) > Date.parse(new Date())) {
              message += _shift.startDate.toString().slice(0, 21) + " - " + _shift.endDate.toString().slice(0, 21) + "\n";
            }
          } // Set up email to be sent


          _context6.next = 30;
          break;

        case 26:
          _context6.prev = 26;
          _context6.t0 = _context6["catch"](22);
          _didIteratorError7 = true;
          _iteratorError7 = _context6.t0;

        case 30:
          _context6.prev = 30;
          _context6.prev = 31;

          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }

        case 33:
          _context6.prev = 33;

          if (!_didIteratorError7) {
            _context6.next = 36;
            break;
          }

          throw _iteratorError7;

        case 36:
          return _context6.finish(33);

        case 37:
          return _context6.finish(30);

        case 38:
          mailOptions = {
            from: 'thinkshiftproject@gmail.com',
            to: employee.email,
            subject: 'ThinkShift: Your shifts are online!',
            text: message
          }; // Send email, or log eror

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          message = "";

        case 41:
          _iteratorNormalCompletion6 = true;
          _context6.next = 16;
          break;

        case 44:
          _context6.next = 50;
          break;

        case 46:
          _context6.prev = 46;
          _context6.t1 = _context6["catch"](14);
          _didIteratorError6 = true;
          _iteratorError6 = _context6.t1;

        case 50:
          _context6.prev = 50;
          _context6.prev = 51;

          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }

        case 53:
          _context6.prev = 53;

          if (!_didIteratorError6) {
            _context6.next = 56;
            break;
          }

          throw _iteratorError6;

        case 56:
          return _context6.finish(53);

        case 57:
          return _context6.finish(50);

        case 58:
          _context6.next = 60;
          return regeneratorRuntime.awrap(manager.updateOne({
            emailSent: Date.now()
          }));

        case 60:
          _context6.next = 66;
          break;

        case 62:
          _context6.prev = 62;
          _context6.t2 = _context6["catch"](2);
          error = new HttpError("Emailing shifts failed", 500);
          return _context6.abrupt("return", next(error));

        case 66:
          return _context6.abrupt("return", res.status(200).send("Emails sent"));

        case 67:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[2, 62], [14, 46, 50, 58], [22, 26, 30, 38], [31,, 33, 37], [51,, 53, 57]]);
};

exports.createEmployee = createEmployee;
exports.getEmployees = getEmployees;
exports.deleteEmployee = deleteEmployee;
exports.setTimetable = setTimetable;
exports.getTimetables = getTimetables;
exports.sendTimetables = sendTimetables;