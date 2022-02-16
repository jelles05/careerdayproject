const pg = require('../managers/dao')

async function getCriteria (criteriaId) {
    pg.connect()
    const query = `SELECT * FROM criteria WHERE id=${criteriaId}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    const criteria = result.rows
    return criteria
}

async function add (criteria) {
    pg.connect()
    //const date = `${criteria.year}-${criteria.month}-${criteria.day}`
    const query = `INSERT INTO criteria (id_province, work_from_home, id_program, work_start_date) VALUES (${criteria.id_province}, ${criteria.work_from_home}, ${criteria.id_program}, '${criteria.work_start_date}') RETURNING id`
    //console.log(query)
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rows[0].id
}

async function update (id, criteria) {
    pg.connect()
    //const date = `${criteria.year}-${criteria.month}-${criteria.day}`
    const query = `UPDATE CRITERIA SET id_province = ${criteria.id_province}, work_from_home = ${criteria.work_from_home}, id_program = ${criteria.id_program}, work_start_date = '${criteria.work_start_date}' WHERE id = ${id}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rowCount
}

async function deleteCriteria (id) {
    pg.connect()
    const query = `DELETE FROM criteria WHERE id=${id}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rowCount
}

module.exports = {
    getCriteria: getCriteria,
    add: add,
    update: update,
    delete: deleteCriteria
}
