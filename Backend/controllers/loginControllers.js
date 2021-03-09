const HttpError = require("../models/httperror")
const {validationResult} = require("express-validator")
const Manager = require("../models/managerSchema")
const Employee = require("../models/employeeSchema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const createManager = async (req, res, next) => {

// Function to create a manager account

    const {name, email, password} = req.body;

    // Check if manager already exists
    let check = await Manager.find({email: email})

    // If manager already exists, return error
    if (check.length >= 1) {
        const error = new HttpError("Manager with this email already exists", 422)
        return next(error)
    }

    let hashedPassword;

    try {
        // Hash and salt password
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new HttpError("Password issue", 500);
        return next(error);
    }

    // Set department and staff manually
    let department = "Manager";
    let staff = [];
    let emailSent = Date.now() - 1000*600
    // Create manager
    const createdManager = new Manager ({
        name,
        email,
        password: hashedPassword,
        department,
        staff,
        emailSent
    });    

    try {
        // Save Manager
        await createdManager.save();
    } catch (err) {
        const error = new HttpError("Creating Manager failed", 500);
        return next(error);
    }

    let token;

    try {
        // Create token for manager to log in
        token = jwt.sign({name: createdManager.name, id: createdManager.id}, "secret_manager", {expiresIn: "3h"});        
    } catch (err) {
        const error = new HttpError("Creating manager failed", 500)
        return next(error)
    }

    // Send token as cookie, expirers in 3 hours
    return res.status(201).cookie('thinkToken', token, { expires: new Date(Date.now() + 3 * 3600000) })
    .send({name: createdManager.name, _id: createdManager.id})

};

const signInManager = async (req, res, next) => {

// Function to sign in a manager account
	
    let {email, password} = req.body
    let manager;

    try {
        manager = await Manager.find({email});
    } catch (err) {
        const error = new HttpError("Could not find Manager", 500);
        return next(error);
    }

    // manager will be an empty list if nothing is found
    if (manager.length === 0) {
        const error = new HttpError("Could not find manager", 500);
        return next(error)
    }

    // Check if the password entered matches the password in the database
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, manager[0].password);
    } catch (err) {
        const error = new HttpError("Could not log in, please check credentials (1)", 500);
        return next(error)
    }


    // If password isn't valid, return an error
    if (!isValidPassword) {
        const error = new HttpError("Could not log in, please check credentials (2)", 500);
        return next(error)
    }

    let token;

    try {
        // Create token for manager on log in
        token = jwt.sign({name: manager[0].name, id: manager[0].id}, "secret_manager", {expiresIn: "3h"});        
    } catch (err) {
        const error = new HttpError("Signing in manager failed", 500)
        return next(error)
    }

    // Send token as cookie, expires in 3 hours
    return res.status(201).cookie('thinkToken', token, {expires: new Date(Date.now() + 3 * 3600000)})
    .send({name: manager[0].name, _id: manager[0].id})

};

const signInEmployee = async (req, res, next) => {

// Function to sign in an employee
    
    let {email, password} = req.body
    let employee;

    try {
        employee = await Employee.find({email});
    } catch (err) {
        const error = new HttpError("Could not find employee", 500);
        return next(error);
    }

    // employee will be an empty list if nothing is found
    if (employee.length === 0) {
        const error = new HttpError("Could not find employee", 500);
        return next(error)
    }

    // Check if the password entered matches the password in the database
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, employee[0].password);
    } catch (err) {
        const error = new HttpError("Could not log in, please check credentials (1)", 500);
        return next(error)
    }

    // If password isn't valid, return an error
    if (!isValidPassword) {
        const error = new HttpError("Could not log in, please check credentials (2)", 500);
        return next(error)
    }

    let token;

    try {
        // Create token for employee on log in
        token = jwt.sign({name: employee[0].name, id: employee[0].id}, "secret_manager", {expiresIn: "3h"});        
    } catch (err) {
        const error = new HttpError("Signing in employee failed", 500)
        return next(error)
    }

    // Send token as cookie, expires in 3 hours
    return res.status(201).cookie('thinkToken', token, {expires: new Date(Date.now() + 3 * 3600000)})
    .send({name: employee[0].name, _id: employee[0].id})
};


exports.createManager = createManager
exports.signInManager = signInManager
exports.signInEmployee = signInEmployee
