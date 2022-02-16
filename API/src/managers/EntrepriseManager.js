const pg = require('../managers/dao')

async function getAll () {
    const query = 'SELECT * FROM enterprises'
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    const enterprises = response.rows
    pg.disconnect()
    return enterprises
}

async function getById (idEntreprise) {
    const query = 'SELECT * FROM enterprises WHERE id=' + idEntreprise
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    const entreprise = response.rows
    pg.disconnect()
    return entreprise
}

async function update (idEntreprise, enterprise) {
    const query = `UPDATE enterprises SET description = $1, employe_target = $2, mission = $3, name = $4, room = $5 WHERE id = ${idEntreprise}`
    const values = [enterprise.description, enterprise.employe_target, enterprise.mission, enterprise.name, enterprise.room]
    pg.connect()
    let response = null
    await pg.asyncQuery(query, values).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return response.rowCount
}

async function updateLogo (idEntreprise, logo_url) {
    const query = `UPDATE enterprises SET logo_url = '${logo_url}' WHERE id = ${idEntreprise}`
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

async function updateVideo (idEntreprise, video_url) {
    const query = `UPDATE enterprises SET video_url = '${video_url}' WHERE id = ${idEntreprise}`
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

async function deleteEntreprise (idEntreprise) {
    const query = 'DELETE FROM enterprises WHERE id=' + idEntreprise
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

async function add (enterprise) {
    const values = [enterprise.name, enterprise.description, enterprise.employe_target, enterprise.mission, enterprise.room, 'defaultEnterprise.png']
    const query = `INSERT INTO enterprises (name, description, employe_target, mission, room, logo_url) VALUES ($1, $2, $3, $4, $5, $6)`
    pg.connect()
    let response = null
    await pg.asyncQuery(query, values).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return response.rowCount
}

async function addCriteria (poste) {
    const query = `INSERT INTO enterprise_criteria_linker (id_criteria, id_enterprise, id_career_day, title, description)
    VALUES ($1, $2, $3, $4, $5)`
    const values = [poste.idCriteria, poste.idEnterprise, poste.idCareerDay, poste.title, poste.description]
    pg.connect()
    let response = null
    await pg.asyncQuery(query, values).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return response.rowCount
}

async function deleteCriteria (idCriteria) {
    const query = 'DELETE FROM enterprise_criteria_linker WHERE id_criteria=' + idCriteria
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

async function getCriteriaByIdEnterprise (idEntreprise, idCareerDay) {
    const query = `SELECT linker.title, linker.description, linker.id_criteria, c.id_program, c.id_province, c.work_from_home, c.work_start_date FROM enterprise_criteria_linker as linker
    INNER JOIN criteria as c ON c.id=linker.id_criteria
    WHERE linker.id_enterprise=${idEntreprise} AND linker.id_career_day=${idCareerDay}`
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    const entreprise = response.rows
    pg.disconnect()
    return entreprise
}

module.exports = {
    getAll: getAll,
    getById: getById,
    update: update,
    deleteEntreprise: deleteEntreprise,
    add: add,
    updateLogo: updateLogo,
    addCriteria: addCriteria,
    deleteCriteria: deleteCriteria,
    getCriteriaByIdEnterprise: getCriteriaByIdEnterprise,
    updateVideo: updateVideo
}
