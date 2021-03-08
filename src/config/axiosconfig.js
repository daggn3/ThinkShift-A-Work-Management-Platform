

const axios = require("axios")
const myaxios = axios.create()
myaxios.defaults.withCredentials=true

module.exports = myaxios