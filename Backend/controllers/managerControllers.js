const HttpError = require("../models/httperror")
const {validationResult} = require("express-validator")
const Employee = require("../models/employeeSchema")
const Manager = require("../models/managerSchema")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")

const createEmployee = async (req, res, next) => {

// Function to create an employee

    const {name, email, password, department, mobile} = req.body;

    let check = await Employee.find({email: email})

    // If employee already exists, return error
    if (check.length >= 1) {
        const error = new HttpError("Employee with this email already exists", 422)
        return next(error)
    }

    let hashedPassword;

    try {
        // encrypting password
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new HttpError("Password issue", 500);
        return next(error);
    }

    // Manually creating timetable and adding the employee's manager
    let timetable = [];
    let manager = req.userData.id;
    // Creating employee
    const createdEmployee = new Employee({
        name,
        email,
        password: hashedPassword, 
        department,
        mobile,
        timetable,
        manager
    });

    let creator;

    try {
        // Finding manager in database
        creator = await Manager.findById(manager)
    } catch (err) {
        const error = new HttpError("Creating Employee failed (1)", 500);
        return next(error);
    }

    if (!creator) {
        const error = new HttpError("Could not find manager", 404)
        return next(error);
    }

    try {
        // Adding employee to database and adding employee in the managers document
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdEmployee.save( { session: sess } );
        creator.employees.push(createdEmployee);
        await creator.save( { session: sess } )
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError("Creating Employee failed (2)", 500);
        return next(error);
    }

    // Send email to new employee with their login details
    // Set up email authentication
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "thinkshiftproject@gmail.com",
            pass: "CA326Project"
        }
    });

    let message = 
    "Hi " + createdEmployee.name + ",\n\nYour new employee account has been made, here are your details:\n\n" + 
    "Name: " + createdEmployee.name + "\nPIN: " + req.body.password + "\nMobile No: " + createdEmployee.mobile +
    "\nManager: " + req.userData.name + "\n\nIf there is anything incorrect, please contact your manager."

    const mailOptions = {
        from: 'thinkshiftproject@gmail.com',
        to: createdEmployee.email,
        subject: 'ThinkShift: Your new employee account has been created!',
        text: message
    };

    // Send email, or log eror
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });

    res.status(201).send({_id: createdEmployee.id, name: createdEmployee.name})
};


const getEmployees = async (req, res, next) => {

// Function to get all employees attached to a specific manager

    let eDetails = []

    const employees = await Employee.find({manager: req.userData.id})
    
    for (const e of employees) {
        eDetails.push({_id: e.id ,name: e.name, email: e.email, department: e.department, mobile: e.mobile, timetable: e.timetable, manager: e.manager})
    }
    return res.status(201).send(eDetails)
}

const deleteEmployee = async (req, res, next) => {

// Function to delete a certain employee

    const {id} = req.body;

    let employee;

    try {
        // Find employee
        employee = await Employee.findById(id)
        if (employee === null) {
            const error = new HttpError("Employee was not found", 500)
            return next(error)
        }
        // Delete employee
        await Employee.deleteOne( { _id: id } )
        res.status(201).send("Employee deleted")
    } catch (err) {
        const error = new HttpError("Employee not found", 500)
        return next(error)
    }

}

const setTimetable = async (req, res, next) => {

// Function to set the Timetable state

    let employees;
    let eTimetable = [];


    // find all employees
    // for employee, find all entry in timetable
    // create list of timetable objects
    // save to database

    try {
        // Finding list of all employees
        employees = await Employee.find( {manager: req.userData.id} )
        for (const employee of employees) {
            for (const entry of req.body) {
                if (entry.staffId == employee.id) {
                    eTimetable.push(entry)
                }
            }
            // Update an individal employees timetable, reset eTimetable for next employee
            await employee.updateOne( {timetable: eTimetable} )
            eTimetable = [];
        }
        res.status(200).send("Timetable has been saved")
    } catch (err) {
        console.log(err)
        const error = new HttpError("Timetable could not be saved", 500)
        return next(error)
    }

}

const getTimetables = async (req, res, next) => {

// Function to get timetable of all employees

    let employees;
    let timetables = [];

    try {
        // Find all employees attached to the manager logged in
        employees = await Employee.find( {manager: req.userData.id} )
        for (const employee of employees) {
            for (shift of employee.timetable) {
                timetables.push(shift)                
            }
        }
        res.status(200).send(timetables)
    } catch (err) {
        const error = new HttpError("Timetables could not be retrieved", 500)
        return next(error)
    }

}

const sendTimetables = async (req, res, next) => {

// Function to send each employee their timetable

    let employees;
    let message = "";

    // Set up email authentication
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "thinkshiftproject@gmail.com",
            pass: "CA326Project"
        }
    });


    try {
        // Find all employees attached to the manager logged in
        employees = await Employee.find( {manager: req.userData.id} )
        for (const employee of employees) {
            // Start of message
            message += "Hello " + employee.name + "\n\n" + "Here are your upcoming shifts:" + "\n\n"
            for (const shift of employee.timetable) {
                // If the shift start date is later than todays date, add to the email 
                if (Date.parse(shift.startDate) > Date.parse(new Date())) {
                    message += shift.startDate.toString().slice(0, 21) + " - " + shift.endDate.toString().slice(0, 21) + "\n"
                }
            }

            // Set up email to be sent
            const mailOptions = {
                from: 'thinkshiftproject@gmail.com',
                to: employee.email,
                subject: 'ThinkShift: Your shifts are online!',
                text: message
            };

            // Send email, or log eror
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
            message = ""
        }
    } catch (err) {
        const error = new HttpError("Emailing shifts failed", 500)
        return next(error)
    }

    return res.status(200).send("Emails sent")

}

exports.createEmployee = createEmployee
exports.getEmployees = getEmployees
exports.deleteEmployee = deleteEmployee

exports.setTimetable = setTimetable
exports.getTimetables = getTimetables
exports.sendTimetables = sendTimetables
