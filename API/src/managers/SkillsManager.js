const pg = require('../managers/dao')

async function getAll () {
    const query = 'SELECT * FROM skills'
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })
    
    const skills = response.rows
    pg.disconnect()
    return skills
}

async function getByCriteriaId (criteriaId) {
    const query = `SELECT * FROM skills as s
    INNER JOIN user_skills as us ON s.id=us.id_skill
    WHERE us.id_criteria = ${criteriaId}`
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    const skills = response.rows
    pg.disconnect()
    return skills
}

async function add (idCriteria, idSkill) {
    const query = `INSERT INTO user_skills (id_criteria, id_skill) VALUES (${idCriteria}, ${idSkill})`
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

async function deleteSkillUser (id) {
    const query = 'DELETE FROM user_skills WHERE id=' + id
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

async function deleteAllSkillUser (id) {
    const query = 'DELETE FROM user_skills WHERE id_criteria=' + id
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
    getByCriteriaId: getByCriteriaId,
    add: add,
    deleteSkillUser: deleteSkillUser,
    deleteAllSkillUser: deleteAllSkillUser
}
