const pg = require('../managers/dao')

async function getAll () {
    const query = 'SELECT * FROM roles'
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    const roles = response.rows
    pg.disconnect()
    return roles
}

async function getById (id) {
    const query = 'SELECT * FROM roles WHERE id=' + id
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })
    
    const role = response.rows
    pg.disconnect()
    return role
}

module.exports = {
    getAll: getAll,
    getById: getById
}
