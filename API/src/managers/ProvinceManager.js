const pg = require('../managers/dao')

async function getAll () {
    pg.connect()
    const query = 'SELECT * FROM province'
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    const province = response.rows
    return province
}

async function getById (id) {
    pg.connect()
    const query = `SELECT * FROM province WHERE id = ${id}`
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    const province = response.rows
    return province
}

module.exports = {
    getAll: getAll,
    getById: getById
}
