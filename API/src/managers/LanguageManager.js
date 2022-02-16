const pg = require('../managers/dao')

async function getAll () {
    const query = 'SELECT * FROM languages'
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    const languages = response.rows
    pg.disconnect()
    return languages
}

async function getById (id) {
    const query = `SELECT * FROM languages WHERE id = ${id}`
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    const language = response.rows
    pg.disconnect()
    return language
}

async function getByIdCriteria (idCriteria) {
    const query = `SELECT * FROM languages as l 
    INNER JOIN user_languages as ul ON l.id=ul.id_language
    WHERE id_criteria = ${idCriteria}`
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })
    
    const languages = response.rows
    pg.disconnect()
    return languages
}

async function add (idCriteria, idLanguage) {
    const query = `INSERT INTO user_languages (id_criteria, id_language) VALUES (${idCriteria}, ${idLanguage})`
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

async function deleteLanguageUser (id) {
    const query = 'DELETE FROM user_languages WHERE id=' + id
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

async function deleteAllLanguageUser (id) {
    const query = 'DELETE FROM user_languages WHERE id_criteria=' + id
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
    getAll: getAll,
    getByIdCriteria: getByIdCriteria,
    getById: getById,
    deleteLanguageUser: deleteLanguageUser,
    add: add,
    deleteAllLanguageUser: deleteAllLanguageUser
}
