const managers = require('./importModule')
const express = require('express')
const app = express()
const path = require('path')

const aws = require('aws-sdk')
const PORT = process.env.PORT || 5000
const S3_BUCKET = process.env.S3_BUCKET
aws.config.region = 'us-east-2'

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    response.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS')
    response.header('Access-Control-Allow-Credentials', 'false')
    next()
})

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static('images'))

const HTTP_OK = 200
const HTTP_ERROR = 400
const CONTENT_TYPE_JSON = 'application/json'


//base

app.get('/', (request, response)=>{
  response.end("Toto")
})

// aws - use updateImageUrl from student manager
app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3({
        apiVersion: '2006-03-01',
        signatureVersion: 'v4',})
    const fileName = req.query['file-name']
    const fileType = req.query['file-type']
    const id = req.query['id']
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    }

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err)
        return res.end()
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      }
      if (fileName.substring(0,3) === 'ETU') {
            managers.StudentManager.updateImageUrl(fileName, id)
      } else if(fileName.substring(0,3) === 'VID'){
            managers.EnterpriseManager.updateVideo(id,fileName)
      } else if(fileName.substring(0,3) === 'ECV'){
            managers.StudentManager.updateCVUrl(fileName, id)
      } else {
            managers.EnterpriseManager.updateLogo(id,fileName)
      }

      res.write(JSON.stringify(returnData))
      res.end()
    })
})

  // Languages
app.get('/languages', async function (request, response) {
    let result = ''
    const languages = await managers.LanguageManager.getAll()
    if (languages.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Languages List',
            languages: languages
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/criteria/:criteria_id/languages', async function (request, response) {
    let result = ''
    const params = { criteria_id: request.params.criteria_id }
    const languages = await managers.LanguageManager.getByIdCriteria(params.criteria_id)
    if (languages.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Languages List',
            languages: languages
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error',
            languages: []
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/languages/:language_id', async function (request, response) {
    let result = ''
    const params = { language_id: request.params.language_id }
    const language = await managers.LanguageManager.getById(params.language_id)
    if (language.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Language',
            language: language
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.post('/languages', async function (request, response) {
    let result = ''
    const languages = request.body
    const res = await managers.LanguageManager.add(languages.id_criteria, languages.id_language)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Added',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/languages/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const res = await managers.LanguageManager.deleteLanguageUser(params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/languages/criteria/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const res = await managers.LanguageManager.deleteAllLanguageUser(params.id)
    if (res >= 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

// Skills


app.get('/skills', async function (request, response) {
    let result = ''
    const skills = await managers.SkillsManager.getAll()
    if (skills.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Skills List',
            skills: skills
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/criteria/:criteria_id/skills', async function (request, response) {
    let result = ''
    const params = { criteria_id: request.params.criteria_id }
    const skills = await managers.SkillsManager.getByCriteriaId(params.criteria_id)
    if (skills.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Skill List',
            skills: skills
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error',
            skills: []
        }
    }

    response.end(JSON.stringify(result))
})

app.post('/skills', async function (request, response) {
    let result = ''
    const skills = request.body
    const res = await managers.SkillsManager.add(skills.id_criteria, skills.id_skill)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Added',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/skills/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const res = await managers.SkillsManager.deleteSkillUser(params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/skills/criteria/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const res = await managers.SkillsManager.deleteAllSkillUser(params.id)
    if (res >= 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

// Criteria

app.get('/criteria/:criteria_id', async function (request, response) {
    let result = ''
    const params = { criteria_id: request.params.criteria_id }
    const criteria = await managers.CriteriaManager.getCriteria(params.criteria_id)
    if (criteria.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Criteria Exist',
            data: criteria
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.post('/criteria', async function (request, response) {
    let result = ''
    const criteria = request.body
    const res = await managers.CriteriaManager.add(criteria)
    if (res !== null) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Criteria added',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result, null, 4))
})

app.put('/criteria/:criteria_id', async function (request, response) {
    let result = ''
    const params = { criteria_id: request.params.criteria_id }
    const criteria = request.body
    const res = await managers.CriteriaManager.update(params.criteria_id, criteria)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Criteria updated',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result, null, 4))
})

app.delete('/criteria/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const res = await managers.CriteriaManager.delete(params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

// Career Day Manager

app.get('/career_day/is_active', async function (request, response) {
    let result = ''
    const careerDays = await managers.CareerDayManager.isActive()
    if (careerDays.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Career Day Exists',
            data: careerDays
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/career_day/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const careerDays = await managers.CareerDayManager.getById(params.id)
    if (careerDays.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Career Day Exists',
            data: careerDays
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/career_day', async function (request, response) {
    let result = ''
    const careerDays = await managers.CareerDayManager.getAll()
    if (careerDays.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Career Day List',
            data: careerDays
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.post('/career_day', async function (request, response) {
    let result = ''
    const careerDay = request.body
    const res = await managers.CareerDayManager.add(careerDay)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Added',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.put('/career_day/:id', async function (request, response) {
    let result = ''
    const careerDay = request.body
    const params = { id: request.params.id }
    const res = await managers.CareerDayManager.update(params.id, careerDay)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Updated',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/career_day/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const res = await managers.CareerDayManager.delete(params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

// Provinces

app.get('/province', async function (request, response) {
    let result = ''
    const province = await managers.ProvinceManager.getAll()
    if (province.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Provinces',
            province: province
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/province/:province_id', async function (request, response) {
    let result = ''
    const params = { province_id: request.params.province_id }
    const province = await managers.ProvinceManager.getById(params.province_id)
    if (province.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Province',
            province: province
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

// Meeting

app.get('/meetings', async function (request, response) {
    let result = ''
    const meetings = await managers.MeetingManager.getAll()
    if (meetings.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Meetings list',
            data: meetings
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/meeting_types', async function (request, response) {
    let result = ''
    const meetings = await managers.MeetingManager.getAllMeetingType()
    if (meetings.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Meeting types list',
            data: meetings
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/career_day/:idCareerDay/meetingsComplete', async function (request, response) {
    let result = ''
    const params = { idCareerDay: request.params.idCareerDay }
    const meetings = await managers.MeetingManager.getAllComplete(params.idCareerDay)
    if (meetings.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Meetings list',
            data: meetings
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/meetings/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const meeting = await managers.MeetingManager.getById(params.id)
    if (meeting.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Meeting found',
            data: meeting
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/meetingsComplete/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const meeting = await managers.MeetingManager.getByIdComplete(params.id)
    if (meeting.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Meeting found',
            data: meeting
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/users/:id/meetings', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const meetings = await managers.MeetingManager.getByIdUser(params.id)
    if (meetings.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: `Meetings found - USER ${params.id}`,
            data: meetings
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/career_day/:idCareerDay/users/:id/meetingsComplete', async function (request, response) {
    let result = ''
    const params = { id: request.params.id, idCareerDay: request.params.idCareerDay }
    const meetings = await managers.MeetingManager.getByIdUserComplete(params.id, params.idCareerDay)
    if (meetings.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: `Meetings found - USER ${params.id}`,
            data: meetings
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/career_day/:idCareerDay/enterprises/:id/meetingsComplete', async function (request, response) {
    let result = ''
    const params = { id: request.params.id, idCareerDay: request.params.idCareerDay }
    const meetings = await managers.MeetingManager.getByIdEntreprise(params.id, params.idCareerDay)
    if (meetings.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: `Meetings found - Enterprise ${params.id}`,
            data: meetings
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.post('/meetings', async function (request, response) {
    let result = ''
    const meeting = request.body
    const res = await managers.MeetingManager.add(meeting)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Meeting added',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.put('/meetings/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const meeting = request.body
    const res = await managers.MeetingManager.update(params.id, meeting)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Meeting updated',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/meetings/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const res = await managers.MeetingManager.delete(params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/career_day/:id/meetings/hour/:hour', async function (request, response) {
    let result = ''
    const params = { hour: request.params.hour, id: request.params.id }
    const meetings = await managers.MeetingManager.getByHour(params.hour, params.id)
    if (meetings.length !== 0) {
        console.log('Meetings index: ', meetings)
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: `Meetings Found`,
            data: meetings
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    console.log('result', result)

    response.end(JSON.stringify(result))
})

//User

app.get('/users', async function (request, response) {
    let result = ''
    const users = await managers.UserManager.getAll()
    if (users.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Users list',
            data: users
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

//create users params:
app.post('/users', async function (request, response) {
    let result = ''
    const user = request.body
    const checkEmail = await managers.UserManager.checkEmail(user.email)
    if (checkEmail === 0) {
        const res = await managers.UserManager.createUser(user)
        if (res === 1) {
            response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
            result = {
                status_code: HTTP_OK,
                message: 'User added',
                data: res
            }
        } else {
            response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
            result = {
                status_code: HTTP_ERROR,
                message: 'Error'
            }
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
            result = {
                status_code: HTTP_ERROR,
                message: 'Error'
            }
    }

    response.end(JSON.stringify(result))
})

//change pour /users + param email et pw
app.post('/login', async function (request, response) {
    let result = ''
    const userData = request.body
    const user = await managers.UserManager.login(userData.email, userData.password)
    if (user.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'logged in',
            data: user
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error log in'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/users/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const user = await managers.UserManager.getById(params.id)
    if (user.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'User found',
            data: user
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

//change pour /users/idRole
app.get('/users/roles/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const user = await managers.UserManager.getByIdRole(params.id)
    if (user.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'User list',
            data: user
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.put('/users/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const user = request.body
    const res = await managers.UserManager.updateUser(user, params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'User updated',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/users/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const res = await managers.UserManager.deleteUser(params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

// enterprises

app.get('/enterprises', async function (request, response) {
    let result = ''
    const enterprises = await managers.EnterpriseManager.getAll()
    if (enterprises.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Enterprise list',
            data: enterprises
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/enterprises/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const enterprise = await managers.EnterpriseManager.getById(params.id)
    if (enterprise.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Enterprise found',
            data: enterprise
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.post('/enterprises', async function (request, response) {
    let result = ''
    const enterprise = request.body
    const res = await managers.EnterpriseManager.add(enterprise)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Enterprise added',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.put('/enterprises/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const enterprise = request.body
    const res = await managers.EnterpriseManager.update(params.id, enterprise)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Enterprise updated',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/enterprises/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const res = await managers.EnterpriseManager.deleteEntreprise(params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.post('/enterprises/criteria', async function (request, response) {
    let result = ''
    const enterpriseCriteria = request.body
    const res = await managers.EnterpriseManager.addCriteria(enterpriseCriteria)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Enterprise added',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/enterprises/criteria/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const res = await managers.EnterpriseManager.deleteCriteria(params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/career_day/:idCareerDay/enterprises/:id/criteria', async function (request, response) {
    let result = ''
    const params = { id: request.params.id, idCareerDay: request.params.idCareerDay }
    const enterprise = await managers.EnterpriseManager.getCriteriaByIdEnterprise(params.id, params.idCareerDay)
    if (enterprise.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Enterprise found',
            data: enterprise
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error',
            data: []
        }
    }

    response.end(JSON.stringify(result))
})

// students

app.get('/students', async function (request, response) {
    let result = ''
    const students = await managers.StudentManager.getAll()
    if (students.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Student list',
            data: students
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/students/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const student = await managers.StudentManager.getByIdUser(params.id)
    if (student.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Student found',
            data: student
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.post('/students', async function (request, response) {
    let result = ''
    const student = request.body
    const res = await managers.StudentManager.create(student)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Student added',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.put('/students/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const student = request.body
    const res = await managers.StudentManager.update(student, params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Student updated',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/students/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const res = await managers.StudentManager.deleteUser(params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

// Employee

app.get('/employees/enterprises/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const employees = await managers.EmployeeManager.getByIdEntreprise(params.id)
    if (employees.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Employee list',
            data: employees
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/employees/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const employee = await managers.EmployeeManager.getByIdUser(params.id)
    if (employee.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Employee found',
            data: employee
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.post('/employees', async function (request, response) {
    let result = ''
    const employee = request.body
    const res = await managers.EmployeeManager.add(employee.id_user, employee.id_enterprise)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Employee added',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/employees/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    //const employee = request.body
    const res = await managers.EmployeeManager.deleteEmployee(params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

// roles

app.get('/roles', async function (request, response) {
    let result = ''
    const roles = await managers.RoleManager.getAll()
    if (roles.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Role list',
            data: roles
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/roles/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const role = await managers.RoleManager.getById(params.id)
    if (role.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Role found',
            data: role
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

// TimeSlot

app.post('/time-slots', async function (request, response) {
    let result = ''
    const timeSlot = request.body
    const res = await managers.TimeSlotManager.add(timeSlot.id_user, timeSlot.time_slot)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Time-slot added',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/time-slots/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const timeSlot = await managers.TimeSlotManager.getById(params.id)
    if (timeSlot.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Time-slot found',
            data: timeSlot
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/users/:id/time-slots', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const timeSlots = await managers.TimeSlotManager.getTimeSlotByIdUser(params.id)
    if (timeSlots.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Time-slot list',
            data: timeSlots
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error',
            data: []
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/time-slots/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const res = await managers.TimeSlotManager.deleteTimeSlot(params.id)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/user/:idUser/time-slots', async function (request, response) {
    let result = ''
    const params = { idUser: request.params.idUser }
    const res = await managers.TimeSlotManager.deleteAllTimeSlot(params.idUser)
    if (res >= 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/user/:idUser/time-slots/:timeSlot', async function (request, response) {
    let result = ''
    const params = { idUser: request.params.idUser, timeSlot: request.params.timeSlot }
    const res = await managers.TimeSlotManager.deleteMeetingTimeSlot(params.idUser, params.timeSlot)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

// Attendance

app.get('/students/attendance/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const tab = []
    const attendances = await managers.AttendanceManager.getAllStudentByIdCareerDay(params.id)
    if (attendances.length !== 0) {
        for (let index = 0; index < attendances.length; index++) {
            const skills = await managers.SkillsManager.getByCriteriaId(attendances[index].id_criteria)
            const langs = await managers.LanguageManager.getByIdCriteria(attendances[index].id_criteria)
            attendances[index].skills = skills
            attendances[index].languages = langs

        }

        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Attendance list',
            data: attendances
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/enterprises/attendance/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const attendances = await managers.AttendanceManager.getAllEnterpriseByIdCareerDay(params.id)
    if (attendances.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Attendance list',
            data: attendances
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/user/:idUser/attendance/:idCareerDay', async function (request, response) {
    let result = ''
    const params = { idUser: request.params.idUser, idCareerDay: request.params.idCareerDay }
    const attendances = await managers.AttendanceManager.isPresent(params.idUser, params.idCareerDay)
    if (attendances === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'User present',
            data: true
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'User not present',
            data: false
        }
    }

    response.end(JSON.stringify(result))
})

app.post('/attendance', async function (request, response) {
    let result = ''
    const attendance = request.body
    const res = await managers.AttendanceManager.add(attendance.id_user, attendance.id_career_day)
    if (res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Attendance added',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.delete('/user/:idUser/attendance', async function (request, response) {
    let result = ''
    const params = { idUser: request.params.idUser }
    const res = await managers.AttendanceManager.deleteAttendance(params.idUser)
    if (res >= 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Deleted',
            data: res
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

// Programs

app.get('/programs', async function (request, response) {
    let result = ''
    const programs = await managers.ProgramManager.getAll()
    if (programs.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Programs List',
            languages: programs
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/programs/:id', async function (request, response) {
    let result = ''
    const params = { id: request.params.id }
    const program = await managers.ProgramManager.getById(params.id)
    if (program.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Program',
            language: program
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

// Notifications

app.get('/notifications', async function(request, response) {
    let result = ''
    const notifications = await managers.NotificationManager.getAll()
    if(notifications.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Notifications List',
            notifications: notifications
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error',
            notifications: []
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/users/:userId/notifications', async function(request, response) {
    let result = ''
    const params = { userId: request.params.userId }
    const notifications = await managers.NotificationManager.getByUserId(params.userId)

    if(notifications.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Notifications List',
            notifications: notifications
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error',
            notifications: []
        }
    }

    response.end(JSON.stringify(result))
})

app.get('/notifications/:id', async function(request, response) {
    let result = ''
    const params = { id: request.params.id }
    const notifications = await managers.NotificationManager.getById(params.id)

    if(notifications.length !== 0) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Notifications List',
            notifications: notifications
        }
    } else {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Error',
            notifications: []
        }
    }

    response.end(JSON.stringify(result))
})

app.post('/notifications', async function (request, response) {
    let result = ''
    const notification = request.body
    const res = await managers.NotificationManager.add(notification)
    if(res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Notification added',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))
})

app.put('/notifications/:id', async function (request, response) {
    const params = { id: request.params.id }
    const res = await managers.NotificationManager.updateIsRead(params.id)
    let result = ''
    console.log(res)

    if(res === 1) {
        response.writeHead(HTTP_OK, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_OK,
            message: 'Notification readed',
            data: res
        }
    } else {
        response.writeHead(HTTP_ERROR, { 'Content-Type': CONTENT_TYPE_JSON })
        result = {
            status_code: HTTP_ERROR,
            message: 'Error'
        }
    }

    response.end(JSON.stringify(result))


})

app.listen(PORT, function () {
    console.log('Server listening on: http://localhost:%s', PORT)
})
