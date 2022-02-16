'use strict'

class CareerDayData {
    static axios = require('axios').default
    static herokuURL = 'https://aqueous-temple-81741.herokuapp.com/'
    static localHostURL = 'http://localhost:5000/'
    static URL = this.localHostURL

    static login (params, callback, callbackError) {
        this.axios.post(this.URL + 'login', params)
            .then(callback)
            .catch(callbackError)
    }

    static getAllRoles (callback) {
        this.axios.get(this.URL + 'roles')
            .then(callback)
            .catch((error) => {
                console.log('getAllRoles: ' + error)
            })
    }

    static getAllStudents (callback) {
        this.axios.get(this.URL + 'students')
            .then(callback)
            .catch((error) => {
                console.log('getAllStudents: ' + error)
            })
    }

    static getStudentByUserId (id, callback) {
        this.axios.get(this.URL + 'students/' + id)
            .then(callback)
            .catch((error) => {
                console.log('getStudentById: ' + error)
            })
    }

    static updateStudent (student, callback) {
        this.axios.put(this.URL + 'students/' + student.id_user, student)
            .then(callback)
            .catch((error) => {
                console.log('updateStudent: ' + error)
            })
    }

    static deleteStudent (idStudent, callback) {
        this.axios.delete(this.URL + 'students/' + idStudent)
            .then(callback)
            .catch((error) => {
                console.log('deleteStudent: ' + error)
            })
    }

    static addStudent (student, callback) {
        this.axios.post(this.URL + 'students', student)
            .then(callback)
            .catch((error) => {
                console.log('addStudent: ' + error)
            })
    }

    static getUsersByRole (idRole, callback) {
        this.axios.get(this.URL + 'users/roles/' + idRole)
            .then(callback)
            .catch((error) => {
                console.log('getUsersByRole: ' + error)
            })
    }

    static getUserById (id, callback) {
        this.axios.get(this.URL + 'users/' + id)
            .then(callback)
            .catch((error) => {
                console.log('getUserById: ' + error)
            })
    }

    static updateUser (user, callback) {
        this.axios.put(this.URL + 'users/' + user.id, user)
            .then(callback)
            .catch((error) => {
                console.log('updateUser: ' + error)
            })
    }

    static deleteUser (id, callback) {
        this.axios.delete(this.URL + 'users/' + id)
            .then(callback)
            .catch((error) => {
                console.log('deleteUser: ' + error)
            })
    }

    static addUser (user, callback, callbackError) {
        this.axios.post(this.URL + 'users', user)
            .then(callback)
            .catch(callbackError)
    }

    static getAllEnterprises (callback) {
        this.axios.get(this.URL + 'enterprises')
            .then(callback)
            .catch((error) => {
                console.log('getAllEnterprises: ' + error)
            })
    }

    static getEnterpriseById (idEnterprise, callback) {
        this.axios.get(this.URL + `enterprises/${idEnterprise}`)
            .then(callback)
            .catch((error) => {
                console.log('getEnterpriseById: ' + error)
            })
    }

    static deleteEnterpriseById (idEnterprise, callback) {
        this.axios.delete(this.URL + `enterprises/${idEnterprise}`)
            .then(callback)
            .catch(error => console.log('deleteEnterpriseById: ', error))
    }

    static getEmployeeById (id, callback) {
        this.axios.get(this.URL + `employees/${id}`)
            .then(callback)
            .catch((error) => {
                console.log('getEmployeeById: ' + error)
            })
    }

    static deleteEmployee (id, callback) {
        this.axios.delete(this.URL + 'employees/' + id)
            .then(callback)
            .catch((error) => {
                console.log('deleteEmployee: ' + error)
            })
    }

    static addEmployee (employee, callback) {
        this.axios.post(this.URL + 'employees', employee)
            .then(callback)
            .catch((error) => {
                console.log('addEmployee: ' + error)
            })
    }

    static updateEnterprise (enterprise, callback) {
        this.axios.put(this.URL + `enterprises/${enterprise.id}`, enterprise)
            .then(callback)
            .catch((error) => {
                console.log('updateEnterprise: ' + error)
            })
    }

    static getCriteriaById (id, callback) {
        this.axios.get(this.URL + 'criteria/' + id)
            .then(callback)
            .catch((error) => {
                console.log('getCriteriaById: ' + error)
            })
    }

    static getCriteriaByEnterpriseId (idEnterprise, idCareerDay, callback) {
        this.axios.get(this.URL + 'career_day/' + idCareerDay + '/enterprises/' + idEnterprise + '/criteria')
            .then(callback)
            .catch(error => console.log('getCriteriaByEnterpriseId: ' + error))
    }

    static addEnterpriseCriteria (params, callback) {
        this.axios.post(this.URL + 'enterprises/criteria', params)
            .then(callback)
            .catch(error => console.log('addEnterpriseCriteria: ' + error))
    }

    static deleteEnterpriseCriteria (idCriteria, callback) {
        this.axios.delete(this.URL + 'enterprises/criteria/' + idCriteria)
            .then(callback)
            .catch(error => console.log('deleteEnterpriseCriteria: ' + error))
    }

    static updateCriteria (criteria, callback) {
        this.axios.put(this.URL + 'criteria/' + criteria.id, criteria)
            .then(callback)
            .catch((error) => {
                console.log('updateCriteria: ' + error)
            })
    }

    static deleteCriteria (idCriteria, callback) {
        this.axios.delete(this.URL + 'criteria/' + idCriteria)
            .then(callback)
            .catch((error) => {
                console.log('deleteCriteria: ' + error)
            })
    }

    static addCriteria (criteria, callback) {
        this.axios.post(this.URL + 'criteria', criteria)
            .then(callback)
            .catch((error) => {
                console.log('addCriteria: ' + error)
            })
    }

    static getProvinceById (id, callback) {
        this.axios.get(this.URL + 'province/' + id)
            .then(callback)
            .catch((error) => {
                console.log('getProvinceById: ' + error)
            })
    }

    static getAllProvinces (callback) {
        this.axios.get(this.URL + 'province')
            .then(callback)
            .catch((error) => {
                console.log('getAllProvinces: ' + error)
            })
    }

    static getLanguagesByCriteriaId (idCriteria, callback) {
        this.axios.get(this.URL + 'criteria/' + idCriteria + '/languages')
            .then(callback)
            .catch((error) => {
                console.log('getLanguageByCriteriaId: ' + error)
            })
    }

    static getLanguageById (id, callback) {
        this.axios.get(this.URL + 'languages' + id)
            .then(callback)
            .catch((error) => {
                console.log('getLanguageById: ' + error)
            })
    }

    static getAllLanguages (callback) {
        this.axios.get(this.URL + 'languages')
            .then(callback)
            .catch((error) => {
                console.log('getAllLanguages: ' + error)
            })
    }

    static deleteAllLanguagesByCriteriaId (idCriteria, callback) {
        this.axios.delete(this.URL + 'languages/criteria/' + idCriteria)
            .then(callback)
            .catch((error) => {
                console.log('deleteAllLanguagesByCriteriaId: ' + error)
            })
    }

    static addUserLanguages (idCriteria, languagesIds, callback) {
        const requests = []
        languagesIds.forEach(id => {
            const request = this.axios.post(this.URL + 'languages', { id_criteria: idCriteria, id_language: parseInt(id) })
            requests.push(request)
        })
        this.axios.all(requests)
            .then(this.axios.spread(callback))
            .catch((errors) => {
                console.log(errors)
            })
    }

    static deleteUserLanguages (userLanguagesIds, callback) {
        const requests = []
        userLanguagesIds.forEach(id => {
            const request = this.axios.delete(this.URL + 'languages/' + id)
            requests.push(request)
        })
        this.axios.all(requests)
            .then(this.axios.spread(callback))
            .catch((errors) => {
                console.log(errors)
            })
    }

    static getSkillsByCriteriaId (idCriteria, callback) {
        this.axios.get(this.URL + 'criteria/' + idCriteria + '/skills')
            .then(callback)
            .catch((error) => {
                console.log('getSkillsByCriteriaId: ' + error)
            })
    }

    static getAllSkills (callback) {
        this.axios.get(this.URL + 'skills')
            .then(callback)
            .catch((error) => {
                console.log('getAllSkills: ' + error)
            })
    }

    static deleteAllSkillsByCriteriaId (idCriteria, callback) {
        this.axios.delete(this.URL + 'skills/criteria/' + idCriteria)
            .then(callback)
            .catch((error) => {
                console.log('deleteAllSkillsByCriteriaId: ' + error)
            })
    }

    static deleteUserSkill (id, callback) {
        this.axios.delete(this.URL + 'skills/' + id)
            .then(callback)
            .catch((error) => {
                console.log(error)
            })
    }

    static addUserSkills (idCriteria, skillsIds, callback) {
        const requests = []
        skillsIds.forEach(id => {
            const request = this.axios.post(this.URL + 'skills', { id_criteria: idCriteria, id_skill: parseInt(id) })
            requests.push(request)
        })
        this.axios.all(requests)
            .then(this.axios.spread(callback))
            .catch((errors) => {
                console.log(errors)
            })
    }

    static deleteUserSkills (userSkillsIds, callback) {
        const requests = []
        userSkillsIds.forEach(id => {
            const request = this.axios.delete(this.URL + 'skills/' + id)
            requests.push(request)
        })
        this.axios.all(requests)
            .then(this.axios.spread(callback))
            .catch((errors) => {
                console.log(errors)
            })
    }

    static getProgramById (id, callback) {
        this.axios.get(this.URL + 'programs/' + id)
            .then(callback)
            .catch((error) => {
                console.log('getProgramById: ' + error)
            })
    }

    static getAllPrograms (callback) {
        this.axios.get(this.URL + 'programs')
            .then(callback)
            .catch((error) => {
                console.log('getAllPrograms: ' + error)
            })
    }

    static getAllCareerDay (callback) {
        this.axios.get(this.URL + 'career_day')
            .then(callback)
            .catch((error) => {
                console.log('getAllCareerDay: ' + error)
            })
    }

    static getCareerDayById (id, callback) {
        this.axios.get(this.URL + `career_day/${id}`)
            .then(callback)
            .catch((error) => console.log('getCareerDayById:', error))
    }

    static updateCareerDay (careerDay, callback) {
        this.axios.put(this.URL + `career_day/${careerDay.id}`, careerDay)
            .then(callback)
            .catch((error) => {
                console.log('updateCareerDay: ', error)
            })
    }

    static getEnterprisesByCareerDayId (careerDay, callback) {
        this.axios.get(this.URL + `enterprises/attendance/${careerDay.id}`, careerDay)
            .then(callback)
            .catch(error => console.log('getEnterprisesByCareerDayId: ' + error))
    }

    static getStudentsByCareerDayId (careerDay, callback) {
        this.axios.get(this.URL + `students/attendance/${careerDay.id}`, careerDay)
            .then(callback)
            .catch(error => console.log('getStudentsByCareerDayId: ', error))
    }

    static addCareerDay (careerDay, callback) {
        this.axios.post(this.URL + 'career_day', careerDay)
            .then(callback)
            .catch(error => console.log('addCareerDay:', error))
    }

    static getActiveCareerDay (callback) {
        this.axios.get(this.URL + 'career_day/is_active')
            .then(callback)
            .catch(error => console.log('GetActiveCareerDay: ', error))
    }

    static addEnterprise (enterprise, callback) {
        this.axios.post(this.URL + 'enterprises', enterprise)
            .then(callback)
            .catch(error => console.log('addEnterprise: ', error))
    }

    static getAllEmployeesByEnterpriseId (enterpriseId, callback) {
        this.axios.get(this.URL + `employees/enterprises/${enterpriseId}`)
            .then(callback)
            .catch(error => console.log('getAllEmployeesByEnterpriseId: ' + error))
    }

    static getTimeSlotById (id, callback) {
        this.axios.get(this.URL + 'time-slots/' + id)
            .then(callback)
            .catch(error => console.log('getTimeSlotById: ' + error))
    }

    static getTimeSlotsByUserId (idUser, callback) {
        this.axios.get(this.URL + 'users/' + idUser + '/time-slots')
            .then(callback)
            .catch(error => console.log('getTimeSlotsByUserId: ' + error))
    }

    static addTimeSlot (timeSlot, callback) {
        this.axios.post(this.URL + 'time-slots', timeSlot)
            .then(callback)
            .catch(error => console.log('addTimeSlot: ' + error))
    }

    static addTimeSlots (idUser, timeSlots, callback) {
        const requests = []
        timeSlots.forEach(ts => {
            const request = this.axios.post(this.URL + 'time-slots', { id_user: idUser, time_slot: ts })
            requests.push(request)
        })
        this.axios.all(requests)
            .then(this.axios.spread(callback))
            .catch(errors => console.log(errors))
    }

    static deleteTimeSlot (id, callback) {
        this.axios.delete(this.URL + 'time-slots/' + id)
            .then(callback)
            .catch(error => console.log('deleteTimeSlot: ' + error))
    }

    static deleteMeetingTimeSlot (idUser, timeSlot, callback) {
        this.axios.delete(this.URL + 'user/' + idUser + '/time-slots/' + timeSlot)
            .then(callback)
            .catch(error => console.log('deleteMeetingTimeSlot: ' + error))
    }

    static deleteTimeSlots (timeSlots, callback) {
        const requests = []
        timeSlots.forEach(ts => {
            const request = this.axios.delete(this.URL + 'time-slots/' + ts.id)
            requests.push(request)
        })
        this.axios.all(requests)
            .then(this.axios.spread(callback))
            .catch(errors => console.log(errors))
    }

    static deleteAllTimeSlots (idUser, callback) {
        this.axios.delete(this.URL + 'user/' + idUser + '/time-slots')
            .then(callback)
            .catch(error => console.log('deleteAllTimeSlots: ' + error))
    }

    static deleteAttendance (idUser, callback) {
        this.axios.delete(this.URL + 'user/' + idUser + '/attendance')
            .then(callback)
            .catch(error => console.log('deleteAttendance: ' + error))
    }

    static getMeetingsByUserId (idUser, callback) {
        this.axios.get(this.URL + 'users/' + idUser + '/meetings')
            .then(callback)
            .catch(error => console.log('getMeetingsByUserId: ' + error))
    }

    static getAllMeetings (idCareerDay, callback) {
        this.axios.get(this.URL + `career_day/${idCareerDay}/meetingsComplete`)
            .then(callback)
            .catch(error => console.log('getAllMeetings', error))
    }

    static getAllMeetingsByUser (idCareerDay, idUser, callback) {
        this.axios.get(this.URL + `career_day/${idCareerDay}/users/${idUser}/meetingsComplete`)
            .then(callback)
            .catch(error => console.log('getAllMetingsByUser', error))
    }

    static getAllMeetingsByEnterpriseId (idCareerDay, idEnterprise, callback) {
        this.axios.get(this.URL + `career_day/${idCareerDay}/enterprises/${idEnterprise}/meetingsComplete`)
            .then(callback)
            .catch(error => console.log('getAllMeetingsByEnterpriseId', error))
    }

    static addMeeting (meeting, callback) {
        this.axios.post(this.URL + 'meetings', meeting)
            .then(callback)
            .catch(error => console.log('addMeeting: ' + error))
    }

    static deleteMeeting (idMeeting, callback) {
        this.axios.delete(this.URL + 'meetings/' + idMeeting)
            .then(callback)
            .catch(error => console.log('deleteMeeting: ' + error))
    }

    static updateMeeting (meeting, callback) {
        this.axios.put(this.URL + 'meetings/' + meeting.id, meeting)
            .then(callback)
            .catch(error => console.log('updateMeeting: ' + error))
    }

    static getAllMeetingTypes (callback) {
        this.axios.get(this.URL + 'meeting_types')
            .then(callback)
            .catch(error => console.log('getAllMeetingTypes: ' + error))
    }

    static isUserPresent (idUser, idCareerDay, callback) {
        this.axios.get(this.URL + `user/${idUser}/attendance/${idCareerDay}`)
            .then(callback)
            .catch(error => console.log('isUserPresent: ', error))
    }

    static addAttendance (idUser, idCareerDay, callback) {
        const body = {
            id_user: idUser,
            id_career_day: idCareerDay
        }
        this.axios.post(this.URL + 'attendance', body)
            .then(callback)
            .catch(error => console.log('addAttendance: ', error))
    }

    static getNotificationsByUserId (idUser, callback) {
        this.axios.get(`${this.URL}users/${idUser}/notifications`)
            .then(callback)
            .catch(error => console.warn('getNotificationsByUserId: ', error))
    }

    static updateNotification (notification, callback) {
        this.axios.put(this.URL + 'notifications/' + notification.id)
            .then(callback)
            .catch(error => console.log('updateMeeting: ' + error))
    }

    static addNotification (userId, nofiticationType, studentName, employeeName, enterpriseName, callback) {
        const notification = {
            date: 'now()',
            id_user: userId,
            type: nofiticationType,
            student_name: studentName,
            employee_name: employeeName,
            enterprise_name: enterpriseName
        }
        console.log(notification)
        this.axios.post(this.URL + 'notifications', notification)
            .then(callback)
            .catch(error => console.log('addNotification: ' + error))
    }
}

export default CareerDayData
