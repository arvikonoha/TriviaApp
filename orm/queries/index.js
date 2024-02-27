const queries = {}
const fs = require('fs')
const path = require('path')


function loadGlobalMongoQueries(target=path.join(__dirname)) {
    for (let service of fs.readdirSync(target)) {
        if (fs.statSync(path.join(target, service)).isDirectory()) {
            for (let query of fs.readdirSync(path.join(target, service))) {
                queries[service] = require(path.join(target, service, query))
            }
        }
    }
}

loadGlobalMongoQueries()

module.exports = queries