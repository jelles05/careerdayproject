const { asyncQuery } = require('../managers/dao')
const pg = require('../managers/dao')

async function getAll () {
    pg.connect()
    const query = `SELECT n.id, n.date, n.id_user, n.is_read, t.title, n.student_name, n.employee_name, n.enterprise_name FROM notifications as n
    INNER JOIN notifications_type as t ON n.type = t.id`
    let result = null
    await pg.asyncQuery(query, [])
    .then(value => {
        result = value
    })
    .catch(error => {
        console.log(error)
    })

    pg.disconnect()
    const notifications = result.rows
    return notifications
}

async function getByUserId (userId) {
    const query = `SELECT n.id, n.date, n.id_user, n.is_read, t.title, n.student_name, n.employee_name, n.enterprise_name FROM notifications as n
    INNER JOIN notifications_type as t ON n.type = t.id
    WHERE n.id_user=${userId}`
    pg.connect()
    let result = null
    await pg.asyncQuery(query, [])
    .then(value => {
        result = value
    })
    .catch(error => {
        console.log(error)
    })
    const notifications = result.rows
    pg.disconnect()
    return notifications
}

async function getById(id) {
    const query = `SELECT * FROM notifications WHERE id=${id}`
    pg.connect()
    let result = null
    await pg.asyncQuery(query, [])
    .then(value => {
        result = value
    })
    .catch(error => {
        console.log(error)
    })
    const notifications = result.rows
    pg.disconnect()
    return notifications
}

async function add (notification) {
    console.log(notification)
    const query = `INSERT INTO notifications (date, id_user, is_read, type, student_name, employee_name, enterprise_name)
     VALUES (now(),
       ${notification.id_user},
       false,
         ${notification.type},
         '${notification.student_name}',
         '${notification.employee_name}',
         '${notification.enterprise_name}')`
    pg.connect()
    let result = null
    await pg.asyncQuery(query, [])
    .then(value => {
        result = value
    })
    .catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rowCount
}

async function updateIsRead(id){
    const query = `UPDATE notifications SET is_read = true WHERE id = ${id}`
    pg.connect()
    let result = ''
    await pg.asyncQuery(query, [])
    .then(value => {
        result = value
    })
    .catch(error => {
        console.log(error)
    })
    pg.disconnect()
    return result.rowCount
}


async function deleteNotification (id) {
    const query = `DELETE FROM notifications WHERE id = ${id}`
    pg.connect()
    let result = null
    await asyncQuery(query, [])
    .then(value => {
        result = value
    })
    .catch(error => {
        console.log(error)
    })

    pg.disconnect()
    return result.rowCount
}

async function isRead (id) {
    const query = `SELECT is_read FROM notifications WHERE id=${id}`
    pg.connect()
    let result = null
    await asyncQuery(query, [])
    .then(value => {
        result = value
    })
    .catch(error => {
        console.log(error)
    })
    pg.disconnect()
    const isRead = result.rows
    return isRead
}

module.exports = {
    getAll: getAll,
    getByUserId: getByUserId,
    add: add,
    deleteNotification: deleteNotification,
    isRead: isRead,
    getById: getById,
    updateIsRead: updateIsRead
}
