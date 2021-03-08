const express = require("express");
const router = express.Router("express-validator");

const loginControllers = require("../controllers/loginControllers");
const managerControllers = require("../controllers/managerControllers")
const employeeControllers = require("../controllers/employeeControllers")

const checkAuth = require("./authMiddleware")


// Login + Create acoount routes

router.post("/create", loginControllers.createManager)

router.post("/manager", loginControllers.signInManager)

router.post("/employee", loginControllers.signInEmployee)


// Check authentication

router.use(checkAuth)

// Manager routes

router.get("/employees", managerControllers.getEmployees)
router.post("/employees", managerControllers.createEmployee)
router.delete("/employees", managerControllers.deleteEmployee)

router.post("/timetable", managerControllers.setTimetable)
router.get("/timetable", managerControllers.getTimetables)
router.get("/timetable/send", managerControllers.sendTimetables)


// Employee routes

router.get("/schedule", employeeControllers.getTimetable)

// Fallback error

router.use((req, res, next) => {
	res.status(500).send("Error, route does not exist")
});


module.exports = router;
