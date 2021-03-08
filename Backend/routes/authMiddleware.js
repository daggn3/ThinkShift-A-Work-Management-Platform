const express = require("express");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/httperror");

module.exports = (req, res, next) => {

    try {
        // Get token, error if not there
        const token = req.cookies.thinkToken
        if (!token) {
            const error = new HttpError("Token not found", 401);
            throw new Error
        }
    
        // Decode token, extract data
        const decodedToken = jwt.verify(token, "secret_manager")
        req.userData = ({name: decodedToken.name, email: decodedToken.email, id: decodedToken.id})
        next();

    } catch {
        const error = new HttpError("Authentication failed", 401);
        return next(error)
    }


}
