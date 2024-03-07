const queries = {}
const fs = require('fs')
const path = require('path')

/**
 * Function to load the local queries with mongoose json query snippets
 * @param {string} target from which directories will the queries be loaded onto local queries array
 * @returns {void}
 */
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