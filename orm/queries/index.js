const queries = {}
const fs = require('fs')
const path = require('path')


function loadGlobalMongoQueries(target=path.join(__dirname)) {
    for (const service of fs.readdirSync(target)) {
        if (fs.statSync(path.join(target, service)).isDirectory()) {
            for (const query of fs.readdirSync(path.join(target, service))) {
                queries[service] = require(path.join(target, service, query))
            }
        }
    }
}

loadGlobalMongoQueries()

module.exports = queries