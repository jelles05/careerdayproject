const pg = require('../managers/dao')

async function createUser (user) {
    // const query = 'INSERT INTO users' + ' (' + [...colunms] + ') VALUES (' + [...values] + ')'
    const query = `INSERT INTO users (email, id_role, last_name, name, password) 
    VALUES ($1, $2, $3, $4, $5)`
    const values = [user.email, user.id_role, user.last_name, user.name, user.password]
    pg.connect()
    let response = null
    await pg.asyncQuery(query, values).then(value => {
        //console.log(value)
        response = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return response.rowCount
}

async function checkEmail (email) {
    const query = `SELECT * FROM users WHERE email LIKE $1`
    const values = [email]
    pg.connect()
    let response = null
    await pg.asyncQuery(query, values).then(value => {
        //console.log(value)
        response = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return response.rowCount
}

async function login (email, password) {
    const query = `SELECT email, id, id_role, last_name, name FROM users WHERE email LIKE $1 AND password LIKE $2`
    const values = [email, password]
    pg.connect()
    let response = null
    await pg.asyncQuery(query, values).then(value => {
        //console.log(value)
        response = value
    }).catch(error => {
        console.log(error)
    })

    const user = response.rows
    pg.disconnect()
    return user
}

async function getAll () {
    const query = 'SELECT * FROM users'
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        //console.log(value)
        response = value
    }).catch(error => {
        console.log(error)
    })

    const users = response.rows
    pg.disconnect()
    return users
}

async function getById (targetedUserId) {
    const query = 'SELECT * FROM users WHERE id=' + targetedUserId
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        //console.log(value)
        response = value
    }).catch(error => {
        console.log(error)
    })

    const user = response.rows
    pg.disconnect()
    return user
}

async function getByIdRole (targetedUserIdRole) {
    const query = 'SELECT * FROM users WHERE id_role=' + targetedUserIdRole
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    const user = response.rows
    pg.disconnect()
    return user
}

async function updateUser (userToUpdate, id) {
    const query = `UPDATE users SET email = $1, id_role = $2, last_name = $3, name = $4, password = $5 WHERE id = ${id}`
    const values = [userToUpdate.email, userToUpdate.id_role, userToUpdate.last_name, userToUpdate.name, userToUpdate.password]
    pg.connect()
    let response = null
    await pg.asyncQuery(query, values).then(value => {
        //console.log(value)
        response = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return response.rowCount
}

async function deleteUser (targetedUserId) {
    const query = 'DELETE FROM users WHERE id=' + targetedUserId
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return response.rowCount
}

module.exports = {
    createUser: createUser,
    getAll: getAll,
    login: login,
    getById: getById,
    getByIdRole: getByIdRole,
    updateUser: updateUser,
    deleteUser: deleteUser,
    checkEmail: checkEmail
}
