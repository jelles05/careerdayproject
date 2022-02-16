const pg = require('../managers/dao')

async function getAll () {
    const query = 'SELECT * FROM programs'
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    const programs = response.rows
    pg.disconnect()
    return programs
}

async function getById (id) {
    const query = `SELECT * FROM programs WHERE id = ${id}`
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    const program = response.rows
    pg.disconnect()
    return program
}

module.exports = {
    getAll: getAll,
    getById: getById
}
