"use strict";

var HttpError = require("../models/httperror");

var _require = require("express-validator"),
    validationResult = _require.validationResult;

var Manager = require("../models/managerSchema");

var Employee = require("../models/employeeSchema");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var createManager = function createManager(req, res, next) {
  var _req$body, name, email, password, check, error, hashedPassword, _error, department, staff, emailSent, createdManager, _error2, token, _error3;

  return regeneratorRuntime.async(function createManager$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Function to create a manager account
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password; // Check if manager already exists

          _context.next = 3;
          return regeneratorRuntime.awrap(Manager.find({
            email: email
          }));

        case 3:
          check = _context.sent;

          if (!(check.length >= 1)) {
            _context.next = 7;
            break;
          }

          error = new HttpError("Manager with this email already exists", 422);
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
          // Set department and staff manually
          department = "Manager";
          staff = [];
          emailSent = Date.now() - 1000 * 600; // Create manager

          createdManager = new Manager({
            name: name,
            email: email,
            password: hashedPassword,
            department: department,
            staff: staff,
            emailSent: emailSent
          });
          _context.prev = 21;
          _context.next = 24;
          return regeneratorRuntime.awrap(createdManager.save());

        case 24:
          _context.next = 30;
          break;

        case 26:
          _context.prev = 26;
          _context.t1 = _context["catch"](21);
          _error2 = new HttpError("Creating Manager failed", 500);
          return _context.abrupt("return", next(_error2));

        case 30:
          _context.prev = 30;
          // Create token for manager to log in
          token = jwt.sign({
            name: createdManager.name,
            id: createdManager.id
          }, "secret_manager", {
            expiresIn: "3h"
          });
          _context.next = 38;
          break;

        case 34:
          _context.prev = 34;
          _context.t2 = _context["catch"](30);
          _error3 = new HttpError("Creating manager failed", 500);
          return _context.abrupt("return", next(_error3));

        case 38:
          return _context.abrupt("return", res.status(201).cookie('thinkToken', token, {
            expires: new Date(Date.now() + 3 * 3600000)
          }).send({
            name: createdManager.name,
            _id: createdManager.id
          }));

        case 39:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[7, 13], [21, 26], [30, 34]]);
};

var signInManager = function signInManager(req, res, next) {
  var _req$body2, email, password, manager, error, _error4, isValidPassword, _error5, _error6, token, _error7;

  return regeneratorRuntime.async(function signInManager$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // Function to sign in a manager account
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Manager.find({
            email: email
          }));

        case 4:
          manager = _context2.sent;
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          error = new HttpError("Could not find Manager", 500);
          return _context2.abrupt("return", next(error));

        case 11:
          if (!(manager.length === 0)) {
            _context2.next = 14;
            break;
          }

          _error4 = new HttpError("Could not find manager", 500);
          return _context2.abrupt("return", next(_error4));

        case 14:
          // Check if the password entered matches the password in the database
          isValidPassword = false;
          _context2.prev = 15;
          _context2.next = 18;
          return regeneratorRuntime.awrap(bcrypt.compare(password, manager[0].password));

        case 18:
          isValidPassword = _context2.sent;
          _context2.next = 25;
          break;

        case 21:
          _context2.prev = 21;
          _context2.t1 = _context2["catch"](15);
          _error5 = new HttpError("Could not log in, please check credentials (1)", 500);
          return _context2.abrupt("return", next(_error5));

        case 25:
          if (isValidPassword) {
            _context2.next = 28;
            break;
          }

          _error6 = new HttpError("Could not log in, please check credentials (2)", 500);
          return _context2.abrupt("return", next(_error6));

        case 28:
          _context2.prev = 28;
          // Create token for manager on log in
          token = jwt.sign({
            name: manager[0].name,
            id: manager[0].id
          }, "secret_manager", {
            expiresIn: "3h"
          });
          _context2.next = 36;
          break;

        case 32:
          _context2.prev = 32;
          _context2.t2 = _context2["catch"](28);
          _error7 = new HttpError("Signing in manager failed", 500);
          return _context2.abrupt("return", next(_error7));

        case 36:
          return _context2.abrupt("return", res.status(201).cookie('thinkToken', token, {
            expires: new Date(Date.now() + 3 * 3600000)
          }).send({
            name: manager[0].name,
            _id: manager[0].id
          }));

        case 37:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 7], [15, 21], [28, 32]]);
};

var signInEmployee = function signInEmployee(req, res, next) {
  var _req$body3, email, password, employee, error, _error8, isValidPassword, _error9, _error10, token, _error11;

  return regeneratorRuntime.async(function signInEmployee$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // Function to sign in an employee
          _req$body3 = req.body, email = _req$body3.email, password = _req$body3.password;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Employee.find({
            email: email
          }));

        case 4:
          employee = _context3.sent;
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](1);
          error = new HttpError("Could not find employee", 500);
          return _context3.abrupt("return", next(error));

        case 11:
          if (!(employee.length === 0)) {
            _context3.next = 14;
            break;
          }

          _error8 = new HttpError("Could not find employee", 500);
          return _context3.abrupt("return", next(_error8));

        case 14:
          // Check if the password entered matches the password in the database
          isValidPassword = false;
          _context3.prev = 15;
          _context3.next = 18;
          return regeneratorRuntime.awrap(bcrypt.compare(password, employee[0].password));

        case 18:
          isValidPassword = _context3.sent;
          _context3.next = 25;
          break;

        case 21:
          _context3.prev = 21;
          _context3.t1 = _context3["catch"](15);
          _error9 = new HttpError("Could not log in, please check credentials (1)", 500);
          return _context3.abrupt("return", next(_error9));

        case 25:
          if (isValidPassword) {
            _context3.next = 28;
            break;
          }

          _error10 = new HttpError("Could not log in, please check credentials (2)", 500);
          return _context3.abrupt("return", next(_error10));

        case 28:
          _context3.prev = 28;
          // Create token for employee on log in
          token = jwt.sign({
            name: employee[0].name,
            id: employee[0].id
          }, "secret_manager", {
            expiresIn: "3h"
          });
          _context3.next = 36;
          break;

        case 32:
          _context3.prev = 32;
          _context3.t2 = _context3["catch"](28);
          _error11 = new HttpError("Signing in employee failed", 500);
          return _context3.abrupt("return", next(_error11));

        case 36:
          return _context3.abrupt("return", res.status(201).cookie('thinkToken', token, {
            expires: new Date(Date.now() + 3 * 3600000)
          }).send({
            name: employee[0].name,
            _id: employee[0].id
          }));

        case 37:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 7], [15, 21], [28, 32]]);
};

exports.createManager = createManager;
exports.signInManager = signInManager;
exports.signInEmployee = signInEmployee;