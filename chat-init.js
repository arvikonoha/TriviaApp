const axios = require("axios")

const chatProject = {
    connected: false
}

axios.put('http://localhost:4000/projects/quiz-app')
.then((response) => {
    chatProject.connected = response.data.status === 'OK'
})
.catch(console.log)

module.exports = chatProject