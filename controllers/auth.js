const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const orm = require('../orm/index')
const bcrypt = require('bcrypt')

module.exports.login = (req, res) => {
    try {
        const privateKey = fs.readFileSync(path.join(__dirname,'..','keys','private-key.pem'));
        const token = jwt.sign({ userId: req.user.id }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
      
        res.json({ token });
    } catch (error) {
        console.log('Error: ', error)
        res.status(500).json({error: 'Internal server error'})
    }
}

module.exports.register = async (req, res) => {
    try {
        const privateKey = fs.readFileSync(path.join(__dirname,'..','keys','private-key.pem'));
        const {name, password} = req.body
        
        const prevUser = await orm.users.findByName(name)
        if (prevUser) return res.status(400).json({message: 'User already exists'})
    
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)
    
        const user = await orm.users.saveUser({name, password: hashedPassword})
    
        const token = jwt.sign({ userId: user.id }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
      
        return res.json({ token });
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'})
    }
}
