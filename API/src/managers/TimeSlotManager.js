const pg = require('../managers/dao')

async function getTimeSlotByIdUser (idUser) {
    pg.connect()
    const query = 'SELECT * FROM time_slots WHERE id_user=' + idUser
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    const timeSlots = response.rows
    pg.disconnect()
    return timeSlots
}

async function getById (id) {
    const query = 'SELECT * FROM time_slots WHERE id=' + id
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        response = value
    }).catch(error => {
        console.log(error)
    })

    const timeSlots = response.rows
    pg.disconnect()
    return timeSlots
}

async function add (idUser, timeSlot) {
    const query = `INSERT INTO time_slots (time_slot, id_user) VALUES ('${timeSlot}', ${idUser})`
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

async function deleteTimeSlot (id) {
    const query = 'DELETE FROM time_slots WHERE id=' + id
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

async function deleteAllTimeSlot (id) {
    const query = 'DELETE FROM time_slots WHERE id_user=' + id
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

async function deleteMeetingTimeSlot (id, timeSlot) {
    const query = `DELETE FROM time_slots WHERE id_user=${id} AND time_slot LIKE '${timeSlot}'`
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
    getTimeSlotByIdUser: getTimeSlotByIdUser,
    getById: getById,
    add: add,
    deleteTimeSlot: deleteTimeSlot,
    deleteAllTimeSlot: deleteAllTimeSlot,
    deleteMeetingTimeSlot: deleteMeetingTimeSlot
}
