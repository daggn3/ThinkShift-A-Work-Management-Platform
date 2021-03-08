const express = require("express");
const router = express.Router("express-validator");

const myControllers = require("../controllers/myControllers");

const { check } = require("express-validator")


//Login + Create acoount routes

router.post()


// Manager routes



// Employee routes

router.get("/:mname", myControllers.getManagerByName);

router.get("/:ename", myControllers.getEmployeeByName);

router.post("/", 
            [
                check("name").not().isEmpty(),
                check("email").normalizeEmail().isEmail(),
            ],

            myControllers.createManager
            );

router.patch("/:mname", myControllers.updateManager);

router.patch("/:ename", myControllers.updateEmployee);

router.delete("/:mname", myControllers.deleteManager)

router.delete("/:ename", myControllers.deleteEmployee);

module.exports = router;