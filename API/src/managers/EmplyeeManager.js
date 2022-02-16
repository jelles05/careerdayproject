const pg = require('../managers/dao')

async function getByIdEntreprise (idEntreprise) {
    const query = `SELECT u.email, u.id, u.id_role, u.last_name, u.name, linker.id_enterprise FROM users as u
    INNER JOIN enterprise_user_linker as linker ON u.id=linker.id_user
    WHERE linker.id_enterprise=` + idEntreprise
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

async function getByIdUser (idUser) {
    const query = `SELECT u.email, u.id, u.id_role, u.last_name, u.name, linker.id_enterprise FROM users as u
    INNER JOIN enterprise_user_linker as linker ON u.id=linker.id_user
    WHERE u.id=` + idUser
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

async function add (idUser, idEntreprise) {
    const query = `INSERT INTO enterprise_user_linker (id_user, id_enterprise) VALUES (${idUser}, ${idEntreprise})`
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

async function deleteEmployee (idUser) {
    const query = 'DELETE FROM enterprise_user_linker WHERE id_user=' + idUser
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
    getByIdEntreprise: getByIdEntreprise,
    getByIdUser: getByIdUser,
    deleteEmployee: deleteEmployee,
    add: add
}
