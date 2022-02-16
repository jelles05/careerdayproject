const pg = require('../managers/dao')

async function getAll () {
    pg.connect()
    const query = 'SELECT * FROM meetings'
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rows
}

async function getAllMeetingType () {
    pg.connect()
    const query = 'SELECT * FROM meeting_types'
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rows
}

async function getAllComplete (idCareerDay) {
    pg.connect()
    const query = `SELECT p.program, m.id, e.name as enterprise_name, e.logo_url, e.room, emp.name as employee_name, etu.name as student_name, m.id_employee, m.id_student, m.virtual_meeting_url, m.date_time, m.id_meeting_type, m.id_career_day FROM meetings as m
    INNER JOIN users as emp ON emp.id=m.id_employee
    INNER JOIN users as etu ON etu.id=m.id_student
    INNER JOIN student_data as sd ON m.id_student=sd.id_user
    INNER JOIN criteria as c ON c.id=sd.id_criteria
    INNER JOIN programs as p ON p.id=c.id_program
    INNER JOIN enterprise_user_linker as eul ON m.id_employee=eul.id_user
    INNER JOIN enterprises as e ON e.id=eul.id_enterprise
    WHERE m.id_career_day = ${idCareerDay}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rows
}

async function getById (id) {
    pg.connect()
    const query = `SELECT * FROM meetings WHERE id = ${id}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rows
}

async function getByIdComplete (id) {
    pg.connect()
    const query = `SELECT p.program, e.id as enterprise_id, e.name as enterprise_name, e.logo_url, e.room, emp.name as employee_name, etu.name as student_name, m.id_employee, m.id_student, m.virtual_meeting_url, m.date_time, m.id_meeting_type, m.id_career_day FROM meetings as m
    INNER JOIN users as emp ON emp.id=m.id_employee
    INNER JOIN users as etu ON etu.id=m.id_student
    INNER JOIN student_data as sd ON m.id_student=sd.id_user
    INNER JOIN criteria as c ON c.id=sd.id_criteria
    INNER JOIN programs as p ON p.id=c.id_program
    INNER JOIN enterprise_user_linker as eul ON m.id_employee=eul.id_user
    INNER JOIN enterprises as e ON e.id=eul.id_enterprise
    WHERE m.id = ${id}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rows
}

async function getByIdUser (id) {
    pg.connect()
    const query = `SELECT * FROM meetings WHERE id_student = ${id} OR id_employee = ${id}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rows
}

async function getByIdUserComplete (id, idCareerDay) {
    pg.connect()
    const query = `SELECT m.id, p.program, e.id as enterprise_id, e.name as enterprise_name, e.logo_url, e.room, emp.name as employee_name, etu.name as student_name, m.id_employee, m.id_student, m.virtual_meeting_url, m.date_time, m.id_meeting_type, m.id_career_day FROM meetings as m
    INNER JOIN users as emp ON emp.id=m.id_employee
    INNER JOIN users as etu ON etu.id=m.id_student
    INNER JOIN student_data as sd ON m.id_student=sd.id_user
    INNER JOIN criteria as c ON c.id=sd.id_criteria
    INNER JOIN programs as p ON p.id=c.id_program
    INNER JOIN enterprise_user_linker as eul ON m.id_employee=eul.id_user
    INNER JOIN enterprises as e ON e.id=eul.id_enterprise
    WHERE (id_student = ${id} OR id_employee = ${id}) AND m.id_career_day = ${idCareerDay}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rows
}

async function getByIdEntreprise (id, idCareerDay) {
    pg.connect()
    const query = `SELECT p.program, m.id, e.name as enterprise_name, e.logo_url, e.room, emp.name as employee_name, etu.name as student_name, m.id_employee, m.id_student, m.virtual_meeting_url, m.date_time, m.id_meeting_type, m.id_career_day FROM meetings as m
    INNER JOIN users as emp ON emp.id=m.id_employee
    INNER JOIN users as etu ON etu.id=m.id_student
    INNER JOIN student_data as sd ON m.id_student=sd.id_user
    INNER JOIN criteria as c ON c.id=sd.id_criteria
    INNER JOIN programs as p ON p.id=c.id_program
    INNER JOIN enterprise_user_linker as eul ON m.id_employee=eul.id_user
    INNER JOIN enterprises as e ON e.id=eul.id_enterprise
    WHERE e.id = ${id} AND m.id_career_day = ${idCareerDay}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rows
}

async function add (meeting) {
    pg.connect()
    const query = `INSERT INTO meetings (id_employee, id_student, virtual_meeting_url, date_time, id_meeting_type, id_career_day) VALUES (${meeting.id_employee}, ${meeting.id_student}, '${meeting.virtual_meeting_url}', '${meeting.date_time}', ${meeting.id_meeting_type},${meeting.id_career_day})`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rowCount
}

async function update (id, meeting) {
    pg.connect()
    const query = `UPDATE meetings SET id_employee = ${meeting.id_employee}, id_student = ${meeting.id_student}, virtual_meeting_url = '${meeting.virtual_meeting_url}', date_time = '${meeting.date_time}', id_meeting_type = ${meeting.id_meeting_type}, id_career_day = ${meeting.id_career_day} WHERE id = ${id}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rowCount
}

async function deleteMeeting (id) {
    pg.connect()
    const query = `DELETE FROM meetings WHERE id = ${id}`
    let result = null
    await pg.asyncQuery(query, []).then(value => {
        result = value
    }).catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rowCount
}

async function getByHour (hour, careerDayId) {
    // let hourString = `${hour}h${minutes}`
    // if(minutes !== undefined && minutes !== null && minutes !== '0'){
    //     hourString = `${hour}h${minutes}`
    // }
    // else{
    //     hourString = `${hour}h`
    // }

    pg.connect()
    console.log('hour + 1: ', parseInt(hour) + 1)
    const query = `SELECT * FROM meetings WHERE (date_time LIKE '${hour}h%' OR date_time LIKE '${(parseInt(hour) + 1)}h') AND id_career_day = ${careerDayId}`
    let result = null
    await pg.asyncQuery(query, [])
    .then(value => {
        result = value
    })
    .catch(error => {
        console.log(error)
    })

    pg.disconnect()
    const meetings = result.rows
    console.log('Meetings manager', meetings)
    return meetings
}

module.exports = {
    getAll: getAll,
    getById: getById,
    getByIdUser: getByIdUser,
    add: add,
    update: update,
    delete: deleteMeeting,
    getByIdComplete: getByIdComplete,
    getAllComplete: getAllComplete,
    getByIdUserComplete: getByIdUserComplete,
    getByIdEntreprise: getByIdEntreprise,
    getAllMeetingType: getAllMeetingType,
    getByHour: getByHour
}
