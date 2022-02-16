const pg = require('./dao')

async function getAll () {
    const query = `SELECT u.email, u.id, u.id_role, u.last_name, u.name, sd.id_criteria, sd.cv_url, sd.biography, sd.profile_image_url FROM users as u
    INNER JOIN student_data as sd ON u.id=sd.id_user`
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        //console.log(value)
        response = value
    }).catch(error => {
        console.log(error)
    })
    
    const user = response.rows
    pg.disconnect()
    return user
}

async function getByIdUser (idUser) {
    const query = `SELECT u.email, u.id, u.id_role, u.last_name, u.name, sd.id_criteria, sd.cv_url, sd.biography, sd.profile_image_url FROM users as u
    INNER JOIN student_data as sd ON u.id=sd.id_user
    WHERE u.id=` + idUser
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        //console.log(value)
        response = value
    }).catch(error => {
        console.log(error)
    })

    const user = response.rows
    pg.disconnect()
    return user
}

async function create (student) {
    const query = `INSERT INTO student_data (id_user, id_criteria, cv_url, biography, profile_image_url) 
    VALUES ($1, $2, $3, $4, $5)`
    const values = [student.id_user, student.id_criteria, student.cv_url, student.biography, student.profile_image_url]
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

async function update (student, id) {
    const query = `UPDATE student_data SET id_criteria = $1, biography = $2 WHERE id_user = ${id}`
    const values = [student.id_criteria, student.biography]
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

async function updateImageUrl (profile_image_url, id) {
    const query = `UPDATE student_data SET profile_image_url = '${profile_image_url}' WHERE id_user = ${id}`
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

async function updateCVUrl (cv_url, id) {
    const query = `UPDATE student_data SET cv_url = '${cv_url}' WHERE id_user = ${id}`
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

async function deleteUser (targetedUserId) {
    const query = 'DELETE FROM student_data WHERE id_user=' + targetedUserId
    pg.connect()
    let response = null
    await pg.asyncQuery(query, []).then(value => {
        //console.log(value)
        response = value
    }).catch(error => {
        console.log(error)
    })
    
    pg.disconnect()
    return response.rowCount
}

module.exports = {
    getAll: getAll,
    getByIdUser: getByIdUser,
    create: create,
    update: update,
    deleteUser: deleteUser,
    updateImageUrl: updateImageUrl,
    updateCVUrl: updateCVUrl
}
