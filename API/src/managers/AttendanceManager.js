const pg = require('../managers/dao')

async function getAllByIdCareerDay (idCareerDay) {
    pg.connect()
    const query = 'SELECT * FROM attendance WHERE id_career_day=' + idCareerDay
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    const attendances = result.rows
    return attendances
}

async function getAllEnterpriseByIdCareerDay (idCareerDay) {
    pg.connect()
    const query = `SELECT e.id, e.name, e.description, e.employe_target, e.logo_url, e.mission, e.room, e.video_url FROM enterprises as e
    INNER JOIN enterprise_user_linker as eul ON e.id=eul.id_enterprise
    INNER JOIN users as u ON u.id=eul.id_user
    INNER JOIN attendance as a ON u.id=a.id_user
    WHERE a.id_career_day=` + idCareerDay
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    const attendances = result.rows
    return attendances
}

async function getAllStudentByIdCareerDay (idCareerDay) {
    pg.connect()
    const query = `SELECT u.email, u.id, u.id_role, u.last_name, u.name, sd.id_criteria, sd.cv_url, sd.biography, sd.profile_image_url, c.work_from_home, c.work_start_date, c.id_program, c.id_province FROM users as u
    INNER JOIN student_data as sd ON u.id=sd.id_user
    INNER JOIN criteria as c ON c.id=sd.id_criteria
    INNER JOIN attendance as a ON u.id=a.id_user
    WHERE a.id_career_day=` + idCareerDay
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    const attendances = result.rows
    return attendances
}

async function isPresent (idUser, idCareerDay) {
    pg.connect()
    const query = `SELECT * FROM attendance WHERE id_career_day=${idCareerDay} AND id_user=${idUser}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    const attendances = result.rowCount
    return attendances
}

async function add (idUser, idCareerDay) {
    const query = `INSERT INTO attendance(id_career_day, id_user) VALUES (${idCareerDay}, ${idUser})`
    pg.connect()
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rowCount
}

async function deleteAttendance (id) {
    const query = 'DELETE FROM attendance WHERE id_user=' + id
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
    getAllByIdCareerDay: getAllByIdCareerDay,
    isPresent: isPresent,
    add: add,
    getAllStudentByIdCareerDay: getAllStudentByIdCareerDay,
    getAllEnterpriseByIdCareerDay: getAllEnterpriseByIdCareerDay,
    deleteAttendance: deleteAttendance
}
