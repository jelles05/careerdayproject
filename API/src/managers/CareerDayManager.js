const pg = require('../managers/dao')

async function getById (id) {
    pg.connect()
    const query = `SELECT * FROM career_day WHERE id = ${id}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    const careerDays = result.rows
    pg.disconnect()
    return careerDays
}

async function getAll () {
    pg.connect()
    const query = 'SELECT * FROM career_day'
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    const careerDays = result.rows
    pg.disconnect()
    return careerDays
}

async function add (careerDay) {
    pg.connect()
    const query = `INSERT INTO career_day(title, date, is_active, meeting_duration, time_end, time_start) VALUES ('${careerDay.title}', '${careerDay.year}-${careerDay.month}-${careerDay.day}', ${careerDay.is_active}, ${careerDay.meeting_duration}, ${careerDay.time_end}, ${careerDay.time_start})`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rowCount
}

async function update (id, careerDay) {
    pg.connect()
    // const date = `${careerDay.day}-${careerDay.month}-${careerDay.year}`
    const date = `${careerDay.year}-${careerDay.month}-${careerDay.day}`
    const query = `UPDATE career_day SET title = '${careerDay.title}', date = '${date}', is_active = ${careerDay.is_active}, meeting_duration = ${careerDay.meeting_duration}, time_end = ${careerDay.time_end}, time_start = ${careerDay.time_start} WHERE id = ${id}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rowCount
}

async function deleteCareerDay (id) {
    pg.connect()
    const query = `DELETE FROM career_day WHERE id = ${id}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rowCount
}

async function isActive () {
    pg.connect()
    const query = `SELECT * FROM career_day WHERE is_active`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    const careerDays = result.rows
    pg.disconnect()
    return careerDays
}

module.exports = {
    getById: getById,
    getAll: getAll,
    add: add,
    update: update,
    delete: deleteCareerDay,
    isActive: isActive
}
