const Users = require("../models/Users");

module.exports.findByName = (name) => Users.findOne({name})
module.exports.findById = (id) => Users.findById(id)
module.exports.saveUser = (userDetails) => {
    let newUser = new Users(userDetails)
    return newUser.save()
}