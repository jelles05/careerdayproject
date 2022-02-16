'use strict'

const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('dist'))
app.use(function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    response.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS')
    response.header('Access-Control-Allow-Credentials', 'false')
    next()
})

const PORT = 8080
const HTTP_OK = 200
const CONTENT_TYPE_JSON = 'application/json'
const USERS = [
    {
        id: 1,
        id_role: 1,
        email: 'exemple@gmail.com',
        password: '1234',
        last_name: 'Meunier',
        name: 'Hugo'
    },
    {
        id: 2,
        id_role: 2,
        email: 'exemple2@gmail.com',
        password: '1234',
        last_name: 'Meunier2',
        name: 'Hugo2'
    },
    {
        id: 3,
        id_role: 3,
        email: 'exemple3@gmail.com',
        password: '1234',
        last_name: 'Meunier3',
        name: 'Hugo3'
    },
    {
        id: 5,
        id_role: 3,
        email: 'exemple3@gmail.com',
        password: '1234',
        last_name: 'Meunier3',
        name: 'Hugo3'
    },
    {
        id: 6,
        id_role: 3,
        email: 'exemple3@gmail.com',
        password: '1234',
        last_name: 'Meunier3',
        name: 'Hugo3'
    },
    {
        id: 7,
        id_role: 3,
        email: 'exemple3@gmail.com',
        password: '1234',
        last_name: 'Meunier3',
        name: 'Hugo3'
    },
    {
        id: 4,
        id_role: 4,
        email: 'exemple4@gmail.com',
        password: '1234',
        last_name: 'Meunier4',
        name: 'Hugo4'
    },
    {
        id: 8,
        id_role: 4,
        email: 'exemple4@gmail.com',
        password: '1234',
        last_name: 'Meunier4',
        name: 'Hugo4'
    },
    {
        id: 9,
        id_role: 4,
        email: 'exemple4@gmail.com',
        password: '1234',
        last_name: 'Meunier4',
        name: 'Hugo4'
    },
    {
        id: 10,
        id_role: 4,
        email: 'exemple4@gmail.com',
        password: '1234',
        last_name: 'Meunier4',
        name: 'Hugo4'
    },
    {
        id: 11,
        id_role: 4,
        email: 'exemple4@gmail.com',
        password: '1234',
        last_name: 'Meunier4',
        name: 'Hugo4'
    }
]
const STUDENTS = [
    {
        id_user: 1,
        email: 'exemple@gmail.com',
        last_name: 'Meunier',
        name: 'Hugo',
        id_criteria: 1,
        cv_url: '/cv.txt',
        biography: 'Lorem Ipsum',
        profile_image_url: '/user.png'
    },
    {
        id_user: 2,
        email: 'exemple2@gmail.com',
        last_name: 'Meunier',
        name: 'Hugo2',
        id_criteria: 2,
        cv_url: '/cv.txt',
        biography: 'Lorem Ipsum',
        profile_image_url: '/user.png'
    },
    {
        id_user: 3,
        email: 'exemple3@gmail.com',
        last_name: 'Meunier',
        name: 'Hugo3',
        id_criteria: 3,
        cv_url: '/cv.txt',
        biography: 'Lorem Ipsum',
        profile_image_url: '/user.png'
    },
    {
        id_user: 4,
        email: 'exemple4@gmail.com',
        last_name: 'Meunier',
        name: 'Hugo4',
        id_criteria: 4,
        cv_url: '/cv.txt',
        biography: 'Lorem Ipsum',
        profile_image_url: '/user.png'
    }
]
const ENTERPRISES = [
    {
        id: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        mission: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        room: 1234,
        employee_target: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        name: 'Entreprise 1',
        video_url: 'https://www.youtube.com/embed/d8k5DEnU0R4'
    },
    {
        id: 2,
        description: 'Lorem ipsum',
        mission: 'Lorem ipsum',
        room: 1234,
        employee_target: 'Lorem ipsum',
        name: 'Entreprise 2'
    },
    {
        id: 3,
        description: 'Lorem ipsum',
        mission: 'Lorem ipsum',
        room: 1234,
        employee_target: 'Lorem ipsum',
        name: 'Entreprise 3'
    }
]

// CHECK LOGIN INFO
app.post('/login', function (request, response) {
    if (request.body.email === USERS[0].email && request.body.password === USERS[0].password) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        const result = {
            status_code: HTTP_OK,
            message: 'User exist',
            data: USERS[0]
        }
        response.end(JSON.stringify(result))
    } else {
        response.writeHead(400, { 'Content-Type': CONTENT_TYPE_JSON })
        const result = {
            status_code: 400,
            message: 'User not found'
        }
        response.end(JSON.stringify(result))
    }
})

// GET ALL USERS
app.get('/users', function (request, response) {
    response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
    const result = {
        status_code: 200,
        message: 'User list',
        dataList: USERS
    }
    response.end(JSON.stringify(result))
})

// GET USERS BY ROLE ID
app.get('/users/role/:idRole', function (request, response) {
    response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
    const result = {
        status_code: 200,
        message: 'User list',
        dataList: USERS.filter(user => user.id_role === parseInt(request.params.idRole))
    }
    response.end(JSON.stringify(result))
})

// GET ALL STUDENTS
app.get('/students', function (request, response) {
    response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
    const result = {
        status_code: 200,
        message: 'Student exist',
        dataList: STUDENTS
    }
    response.end(JSON.stringify(result))
})

// GET ALL ENTERPRISES
app.get('/enterprise', function (request, response) {
    response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
    const result = {
        status_code: 200,
        message: 'enterprise list',
        dataList: ENTERPRISES
    }
    response.end(JSON.stringify(result))
})

app.get('/enterprise/:id', function (request, response) {
    response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
    const params = { id: request.params.id }

    function getEnterprise (id) {
        console.log(id)
        let enterprise = {}
        ENTERPRISES.forEach((e) => {
            if (e.id.toString() === id) {
                enterprise = e
            }
        })
        return enterprise
    }

    const enterprise = getEnterprise(params.id)
    const result = {
        status_code: HTTP_OK,
        message: 'enterprise found',
        data: enterprise
    }

    response.end(JSON.stringify(result))
})

app.listen(PORT, function () {
    console.log('Server listening on: http://localhost:%s', PORT)
})
