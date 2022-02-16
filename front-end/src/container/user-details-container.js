'use strict'

import React, { Component } from 'react'
import CareerDayData from 'service/career-day-data'
import EmployerDetailsComponent from 'component/user-details-components/employer-details-component'
import EmployeeDetailsComponent from 'component/user-details-components/employee-details-component'
import StudentDetailsComponent from 'component/user-details-components/student-details-component'
import AdminDetailsComponent from 'component/user-details-components/admin-details-component'
import ModifyUserDetailsComponent from 'component/user-details-components/modify-user-details-component'

class UserDetailsContainer extends Component {
    constructor (props) {
        super(props)

        this.state = {
            user: {},
            roles: {},
            pageOrigin: '',
            pageToDisplay: 'details',
            title: '',
            enterprise: {},
            enterprises: [],
            studentUser: {},
            studentCriteria: {},
            studentProgram: {},
            studentProvince: {},
            studentSkills: [],
            studentLanguages: [],
            userTimeSlots: [],
            userMeetings: [],
            programs: [],
            skills: [],
            languages: [],
            provinces: [],
            selectedSkills: [],
            skillsChanged: false,
            selectedLanguages: [],
            languagesChanged: false,
            errorModify: '',
            timeSlotisModifiable: false,
            selectedTimeSlots: [],
            unselectedTimeSlots: [],
            cvUrl: '',
            userPresent: false
        }

        this.handleModifyButtonClick = this.handleModifyButtonClick.bind(this)
        this.handleModifyFormSubmit = this.handleModifyFormSubmit.bind(this)
        this.handleCancelModifyFormClick = this.handleCancelModifyFormClick.bind(this)
        this.handleDeleteUserClick = this.handleDeleteUserClick.bind(this)
        this.handleSkillsSelectChange = this.handleSkillsSelectChange.bind(this)
        this.handleLanguagesSelectChange = this.handleLanguagesSelectChange.bind(this)
        this.handleDisplayAfterUserDelete = this.handleDisplayAfterUserDelete.bind(this)
        this.handleTimeSlotModifyClick = this.handleTimeSlotModifyClick.bind(this)
        this.handleTimeSlotClick = this.handleTimeSlotClick.bind(this)
        this.handleChangeFile = this.handleChangeFile.bind(this)
        this.getSignedRequest = this.getSignedRequest.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.handleChangeCV = this.handleChangeCV.bind(this)
        this.handleUserPresentClick = this.handleUserPresentClick.bind(this)
    }

    componentDidMount () {
        // GET PROPS
        this.setState({ user: this.props.user, roles: this.props.roles, pageOrigin: this.props.pageOrigin })
        // SET TITLE
        if (this.props.pageOrigin === 'users' || this.props.pageOrigin === 'enterprise' || this.props.pageOrigin === 'matches') {
            switch (this.props.user.id_role) {
            case this.props.roles.Employer:
                this.setState({ title: 'Profil Employeur' })
                break
            case this.props.roles.Employee:
                this.setState({ title: 'Profil Employé' })
                break
            case this.props.roles.Student:
                this.setState({ title: 'Profil Étudiant' })
                break
            }
        } else if (this.props.pageOrigin === 'menu') {
            this.setState({ title: 'Mon Profil' })
        }
        // SET STATE
        CareerDayData.isUserPresent(this.props.user.id, this.props.activeCareerDay.id, (resultAttendance) => {
            this.setState({ userPresent: resultAttendance.data.data })
            if (this.props.user.id_role === this.props.roles.Employer || this.props.user.id_role === this.props.roles.Employee) {
                // GET ALL ENTERPRISES
                CareerDayData.getAllEnterprises((resultEnterprises) => {
                    this.setState({ enterprises: resultEnterprises.data.data })
                    // IF IT'S EMPLOYER OR EMPLOYEE, SET ENTERPRISE
                    CareerDayData.getEmployeeById(this.props.user.id, (resultEmployee) => {
                        CareerDayData.getEnterpriseById(resultEmployee.data.data[0].id_enterprise, (resultEnterprise) => {
                            this.setState({ enterprise: resultEnterprise.data.data[0] })
                            // GET TIME SLOTS IF EMPLOYEE
                            if (this.props.user.id_role === this.props.roles.Employee) {
                                CareerDayData.getTimeSlotsByUserId(this.props.user.id, (resultTimeSlots) => {
                                    if (resultTimeSlots.data.data) {
                                        this.setState({ userTimeSlots: resultTimeSlots.data.data })
                                    } else {
                                        this.setState({ userTimeSlots: [] })
                                    }
                                    // GET MEETINGS
                                    CareerDayData.getAllMeetingsByUser(this.props.activeCareerDay.id, this.props.user.id, (resultMeetings) => {
                                        if (resultMeetings.data.data) {
                                            this.setState({ userMeetings: resultMeetings.data.data })
                                        } else {
                                            this.setState({ userMeetings: [] })
                                        }
                                    })
                                })
                            }
                        })
                    })
                })
            } else if (this.props.user.id_role === this.props.roles.Student) {
                // GET STUDENT DATA IF STUDENT
                CareerDayData.getStudentByUserId(this.props.user.id, (resultStudent) => {
                    this.setState({ user: resultStudent.data.data[0] })
                    // GET STUDENT USER
                    CareerDayData.getUserById(this.props.user.id, (resultUser) => {
                        this.setState({ studentUser: resultUser.data.data[0] })
                        // GET STUDENT CRITERIA
                        CareerDayData.getCriteriaById(resultStudent.data.data[0].id_criteria, (resultCriteria) => {
                            this.setState({ studentCriteria: resultCriteria.data.data[0] })
                            // GET STUDENT PROVINCE
                            CareerDayData.getProvinceById(resultCriteria.data.data[0].id_province, (resultProvince) => {
                                this.setState({ studentProvince: resultProvince.data.province[0] })
                                // GET STUDENT SKILLS
                                CareerDayData.getSkillsByCriteriaId(resultStudent.data.data[0].id_criteria, (resultSkills) => {
                                    this.setState({ studentSkills: resultSkills.data.skills })
                                    // GET STUDENT LANGUAGES
                                    CareerDayData.getLanguagesByCriteriaId(resultStudent.data.data[0].id_criteria, (resultLanguages) => {
                                        this.setState({ studentLanguages: resultLanguages.data.languages })
                                        // GET STUDENT PROGRAM
                                        CareerDayData.getProgramById(resultCriteria.data.data[0].id_program, (resultProgram) => {
                                            this.setState({ studentProgram: resultProgram.data.language[0] })
                                            // GET TIME SLOTS
                                            CareerDayData.getTimeSlotsByUserId(this.props.user.id, (resultTimeSlots) => {
                                                if (resultTimeSlots.data.data) {
                                                    this.setState({ userTimeSlots: resultTimeSlots.data.data })
                                                } else {
                                                    this.setState({ userTimeSlots: [] })
                                                }
                                                // GET MEETINGS
                                                CareerDayData.getAllMeetingsByUser(this.props.activeCareerDay.id, this.props.user.id, (resultMeetings) => {
                                                    if (resultMeetings.data.data) {
                                                        this.setState({ userMeetings: resultMeetings.data.data })
                                                    } else {
                                                        this.setState({ userMeetings: [] })
                                                    }
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            }
        })
    }

    // GO TO MODIFY USER FORM
    handleModifyButtonClick () {
        if (this.state.user.id_role === this.state.roles.Student) {
            // GET ALL PROGRAMS
            CareerDayData.getAllPrograms((resultPrograms) => {
                this.setState({ programs: resultPrograms.data.languages })
                // GET ALL SKILLS
                CareerDayData.getAllSkills((resultSkills) => {
                    this.setState({ skills: resultSkills.data.skills })
                    // GET ALL LANGUAGES
                    CareerDayData.getAllLanguages((resultLanguages) => {
                        this.setState({ languages: resultLanguages.data.languages })
                        // GET ALL PROVINCES
                        CareerDayData.getAllProvinces((resultProvinces) => {
                            this.setState({ provinces: resultProvinces.data.province, pageToDisplay: 'modify' })
                        })
                    })
                })
            })
        } else {
            this.setState({ pageToDisplay: 'modify' })
        }
    }

    modifyEmployerEmployeeAdmin (lastName, name, email, password) {
        const updatedUser = {
            id: this.state.user.id,
            id_role: this.state.user.id_role,
            last_name: lastName,
            name: name,
            email: email,
            password: password
        }
        // UPDATE USER
        CareerDayData.updateUser(updatedUser, (updateUser) => {
            this.setState({ pageToDisplay: 'details', user: updatedUser })
        })
    }

    // GET ALL SELECTED SKILLS
    handleSkillsSelectChange = (skills) => {
        this.setState({ selectedSkills: skills, skillsChanged: true })
    }

    // GET ALL SELECTED LANGUAGES
    handleLanguagesSelectChange = (languages) => {
        this.setState({ selectedLanguages: languages, languagesChanged: true })
    }

    checkSelectedSkills () {
        // CHECK WHICH SKILLS TO ADD AND WHICH TO REMOVE
        if (this.state.selectedSkills.length !== 0) {
            const idUserSkillsToRemove = []
            const idSkillsToAdd = []
            this.state.selectedSkills.forEach((selecSkill) => {
                let isAdded = false
                this.state.studentSkills.forEach((skill) => {
                    if (skill.id_skill === selecSkill.value) {
                        isAdded = true
                    }
                })
                if (!isAdded) {
                    idSkillsToAdd.push(selecSkill.value)
                }
            })
            this.state.studentSkills.forEach((skill) => {
                let isDeleted = true
                this.state.selectedSkills.forEach((selecSkill) => {
                    if (skill.id_skill === selecSkill.value) {
                        isDeleted = false
                    }
                })
                if (isDeleted) {
                    idUserSkillsToRemove.push(skill.id)
                }
            })
            const setState = () => {
                CareerDayData.getSkillsByCriteriaId(this.state.user.id_criteria, (resultSkills) => {
                    this.setState({ studentSkills: resultSkills.data.skills })
                })
            }
            if (idSkillsToAdd.length !== 0) {
                CareerDayData.addUserSkills(this.state.user.id_criteria, idSkillsToAdd, (...responses) => {
                    console.log(responses)
                    if (idUserSkillsToRemove.length !== 0) {
                        CareerDayData.deleteUserSkills(idUserSkillsToRemove, (...responsesDelete) => {
                            console.log(responsesDelete)
                            setState()
                        })
                    } else {
                        setState()
                    }
                })
            } else {
                if (idUserSkillsToRemove.length !== 0) {
                    CareerDayData.deleteUserSkills(idUserSkillsToRemove, (...responsesDelete) => {
                        console.log(responsesDelete)
                        setState()
                    })
                }
            }
        }
    }

    checkSelectedLanguages () {
        // CHECK WHICH LANGUAGES TO ADD AND WHICH TO REMOVE
        if (this.state.selectedLanguages.length !== 0) {
            const idUserLanguagesToRemove = []
            const idLanguagesToAdd = []
            this.state.selectedLanguages.forEach((selecLang) => {
                let isAdded = false
                this.state.studentLanguages.forEach((lang) => {
                    if (lang.id_language === selecLang.value) {
                        isAdded = true
                    }
                })
                if (!isAdded) {
                    idLanguagesToAdd.push(selecLang.value)
                }
            })
            this.state.studentLanguages.forEach((lang) => {
                let isDeleted = true
                this.state.selectedLanguages.forEach((seleclang) => {
                    if (lang.id_language === seleclang.value) {
                        isDeleted = false
                    }
                })
                if (isDeleted) {
                    idUserLanguagesToRemove.push(lang.id)
                }
            })
            const setState = () => {
                CareerDayData.getLanguagesByCriteriaId(this.state.user.id_criteria, (resultLanguages) => {
                    this.setState({ studentLanguages: resultLanguages.data.languages })
                })
            }
            if (idLanguagesToAdd.length !== 0) {
                CareerDayData.addUserLanguages(this.state.user.id_criteria, idLanguagesToAdd, (...responses) => {
                    console.log(responses)
                    if (idUserLanguagesToRemove.length !== 0) {
                        CareerDayData.deleteUserLanguages(idUserLanguagesToRemove, (...responsesDelete) => {
                            console.log(responsesDelete)
                            setState()
                        })
                    } else {
                        setState()
                    }
                })
            } else {
                if (idUserLanguagesToRemove.length !== 0) {
                    CareerDayData.deleteUserLanguages(idUserLanguagesToRemove, (...responsesDelete) => {
                        console.log(responsesDelete)
                        setState()
                    })
                }
            }
        }
    }

    modifyStudent (lastName, name, email, password, idProgram, idProvince, workFromHome, workStartDate, bio) {
        let error = ''
        if (this.state.skillsChanged && this.state.selectedSkills.length === 0) {
            error += '* Veuillez sélectionner au moins une compétence '
        }
        if (this.state.languagesChanged && this.state.selectedLanguages.length === 0) {
            error += '* Veuillez sélectionner au moins une langue '
        }
        if (error === '') {
            // MISSING LANGUAGES AND SKILLS
            const updatedUser = {
                id: this.state.user.id,
                id_role: this.state.user.id_role,
                last_name: lastName,
                name: name,
                email: email,
                password: password
            }
            const updatedStudentData = {
                id_user: this.state.user.id,
                id_criteria: this.state.user.id_criteria,
                biography: bio
                // profile_image_url: this.state.user.profile_image_url
            }
            const updatedStudentCriteria = {
                id: this.state.studentCriteria.id,
                id_program: parseInt(idProgram),
                id_province: parseInt(idProvince),
                work_from_home: (workFromHome === '1'),
                work_start_date: workStartDate
            }
            // UPDATE USER
            CareerDayData.updateUser(updatedUser, (upUser) => {
                // UPDATE STUDENT DATA
                CareerDayData.updateStudent(updatedStudentData, (upStudentData) => {
                    // UPDATE CRITERIA
                    CareerDayData.updateCriteria(updatedStudentCriteria, (upCriteria) => {
                        // GET NEW PROGRAM
                        CareerDayData.getProgramById(parseInt(idProgram), (resultProgram) => {
                            // GET NEW PROVINCE
                            CareerDayData.getProvinceById(parseInt(idProvince), (resultProvince) => {
                                this.checkSelectedSkills()
                                this.checkSelectedLanguages()
                                const newUser = {
                                    id: this.state.user.id,
                                    id_role: this.state.user.id_role,
                                    id_criteria: this.state.user.id_criteria,
                                    name: name,
                                    last_name: lastName,
                                    email: email,
                                    cv_url: this.state.cvUrl,
                                    biography: bio,
                                    profile_image_url: this.state.user.profile_image_url
                                }
                                this.setState({
                                    pageToDisplay: 'details',
                                    user: newUser,
                                    studentCriteria: updatedStudentCriteria,
                                    studentUser: updatedUser,
                                    studentProgram: resultProgram.data.language[0],
                                    studentProvince: resultProvince.data.province[0],
                                    errorModify: '',
                                    skillsChanged: false,
                                    languagesChanged: false
                                })
                            })
                        })
                    })
                })
            })
        } else {
            this.setState({ errorModify: error })
        }
    }

    // CHECK MODIFY FORM
    handleModifyFormSubmit (event) {
        event.preventDefault()
        const formFields = event.target.elements
        if (this.state.user.id_role === this.state.roles.Admin || this.state.user.id_role === this.state.roles.Employer || this.state.user.id_role === this.state.roles.Employee) {
            // UPDATE EMPLOYER OR EMPLOYEE OR ADMIN
            this.modifyEmployerEmployeeAdmin(
                formFields.lastName.value,
                formFields.name.value,
                formFields.email.value,
                formFields.password.value
            )
        } else if (this.state.user.id_role === this.state.roles.Student) {
            // UPDATE STUDENT
            this.modifyStudent(
                formFields.lastName.value,
                formFields.name.value,
                formFields.email.value,
                formFields.password.value,
                formFields.programs.value,
                formFields.provinces.value,
                formFields.workFromHome.value,
                formFields.workStartDate.value,
                formFields.bio.value
                // formFields.cvUrl.value
            )
        }
    }

    // CANCEL USER MODIFICATIONS
    handleCancelModifyFormClick () {
        this.setState({ pageToDisplay: 'details' })
    }

    handleDisplayAfterUserDelete () {
        if (this.state.pageOrigin === 'menu') {
            this.props.onLogout()
        } else {
            this.props.onReturnBtnClick()
        }
    }

    deleteEmployerEmployee () {
        // CHECK IF EMPLOYER HAS ENTERPRISE
        if (Object.keys(this.state.enterprise).length !== 0) {
            CareerDayData.deleteEmployee(this.state.user.id, (deleteEmployeur) => {
                console.log(deleteEmployeur)
                CareerDayData.deleteUser(this.state.user.id, (deleteUser) => {
                    console.log(deleteUser)
                    this.handleDisplayAfterUserDelete()
                })
            })
        } else {
            CareerDayData.deleteUser(this.state.user.id, (deleteUser) => {
                console.log(deleteUser)
                this.handleDisplayAfterUserDelete()
            })
        }
    }

    handleChangeFile (e) {
        const files = e.target.files
        const file = files[0]
        if (file === null) {
            return alert('No file selected.')
        } else if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            return alert('Wrong file type')
        }
        this.getSignedRequest(file)
    }

    handleChangeCV (e) {
        const files = e.target.files
        const file = files[0]
        if (file === null) {
            return alert('No file selected.')
        } else if (file.type !== 'application/pdf') {
            return alert('Wrong file type')
        }
        this.getSignedRequest(file)
    }

    getSignedRequest (file) {
        const xhr = new XMLHttpRequest()
        let name = ''
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
            name = 'ETU' + this.state.user.id + file.name
        } else {
            name = 'ECV' + this.state.user.id + file.name
            const user = this.state.user
            user.cv_url = name
            this.setState({ user: user, cvUrl: name })
        }

        encodeURIComponent(file.name)
        encodeURIComponent(file.type)
        console.log(name)
        console.log(file.type)
        xhr.open('GET', `https://aqueous-temple-81741.herokuapp.com/sign-s3?file-name=${name}&file-type=${file.type}&id=${this.state.user.id}`)
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText)
                    this.uploadFile(file, response.signedRequest, response.url)
                } else {
                    alert('Could not get signed URL.')
                }
            }
        }
        xhr.send()
    }

    uploadFile (file, signedRequest, url) {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', signedRequest)
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                console.log(xhr)
                if (xhr.status === 200) {
                    if (file.type === 'image/png' || file.type === 'image/jpeg') {
                        document.getElementById('preview').src = url
                    }
                    // else {
                    //    document.getElementById('previewCV').href = url
                    // }
                } else {
                    alert('Could not upload file.')
                }
            }
        }
        xhr.send(file)
    }

    deleteStudent () {
        // DELETE ALL STUDENT LANGUAGES
        CareerDayData.deleteAllLanguagesByCriteriaId(this.state.user.id_criteria, (deleteLang) => {
            console.log(deleteLang)
            // DELETE ALL STUDENT SKILLS
            CareerDayData.deleteAllSkillsByCriteriaId(this.state.user.id_criteria, (deleteSkills) => {
                console.log(deleteSkills)
                // DELETE ALL TIME SLOTS
                CareerDayData.deleteAllTimeSlots(this.state.user.id, (deleteTimeSlots) => {
                    console.log(deleteTimeSlots)
                    // DELETE STUDENT'S ATTENDANCE
                    CareerDayData.deleteAttendance(this.state.user.id, (deleteAttendance) => {
                        console.log(deleteAttendance)
                        // DELETE STUDENT DATA
                        CareerDayData.deleteStudent(this.state.user.id, (deleteStudentData) => {
                            console.log(deleteStudentData)
                            // DELETE STUDENT CRITERIA
                            CareerDayData.deleteCriteria(this.state.user.id_criteria, (deleteCrit) => {
                                console.log(deleteCrit)
                                // DELETE USER
                                CareerDayData.deleteUser(this.state.user.id, (deleteUser) => {
                                    console.log(deleteUser)
                                    this.handleDisplayAfterUserDelete()
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    // DELETE USER FROM DB
    handleDeleteUserClick () {
        if (this.state.user.id_role === this.state.roles.Employer || this.state.user.id_role === this.state.roles.Employee) {
            // DELETE EMPLOYER OR EMPLOYEE
            this.deleteEmployerEmployee()
        } else if (this.state.user.id_role === this.state.roles.Admin) {
            // DELETE ADMIN
            CareerDayData.deleteUser(this.state.user.id, (deleteUser) => {
                console.log(deleteUser)
                this.handleDisplayAfterUserDelete()
            })
        } else if (this.state.user.id_role === this.state.roles.Student) {
            // DELETE STUDENT
            this.deleteStudent()
        }
    }

    // HANDLE CLICK ON MODIFY TIME SLOT BUTTON
    handleTimeSlotModifyClick () {
        if (this.state.timeSlotisModifiable) {
            this.setState({ timeSlotisModifiable: false })
            // SAVE TIME SLOTS IN DB
            const timeSlotsToAdd = []
            this.state.selectedTimeSlots.forEach(ts => {
                const timeSlotAlreadyAdded = this.state.userTimeSlots.filter(t => t.time_slot === ts)
                if (timeSlotAlreadyAdded.length === 0) {
                    timeSlotsToAdd.push(ts)
                }
            })
            const setState = () => {
                // REFRESH TIME SLOTS IN STATE
                CareerDayData.getTimeSlotsByUserId(this.state.user.id, (resultTimeSlots) => {
                    if (resultTimeSlots.data.data) {
                        this.setState({ userTimeSlots: resultTimeSlots.data.data })
                    } else {
                        this.setState({ userTimeSlots: [] })
                    }
                })
            }
            // ADD TIME SLOTS
            if (timeSlotsToAdd.length !== 0) {
                CareerDayData.addTimeSlots(this.state.user.id, timeSlotsToAdd, (...responses) => {
                    console.log(responses)
                    if (this.state.unselectedTimeSlots.length !== 0) {
                        CareerDayData.deleteTimeSlots(this.state.unselectedTimeSlots, (...deleteResponses) => {
                            console.log(deleteResponses)
                            setState()
                        })
                    } else {
                        setState()
                    }
                })
            } else {
                if (this.state.unselectedTimeSlots.length !== 0) {
                    CareerDayData.deleteTimeSlots(this.state.unselectedTimeSlots, (...deleteResponses) => {
                        console.log(deleteResponses)
                        setState()
                    })
                }
            }
        } else {
            this.setState({ timeSlotisModifiable: true })
        }
    }

    handleTimeSlotClick (timeSlot) {
        return (event) => {
            let isFree = false
            event.target.classList.forEach(className => {
                if (className === 'time-slot-box-free') {
                    isFree = true
                }
            })
            if (isFree) {
                // CHANGE COLOR
                event.target.classList.add('time-slot-box-busy')
                event.target.classList.remove('time-slot-box-free')
                // ADD TO SELECTED TIME SLOT LIST
                const isAdded = this.state.selectedTimeSlots.indexOf(timeSlot) !== -1
                if (!isAdded) {
                    this.setState({ selectedTimeSlots: this.state.selectedTimeSlots.concat([timeSlot]) })
                }
                // REMOVE FROM UNSELECTED TIME SLOT LIST IF IT'S THERE
                let index = -1
                this.state.unselectedTimeSlots.forEach(ts => {
                    if (ts.time_slot === timeSlot) {
                        index = this.state.unselectedTimeSlots.indexOf(ts)
                    }
                })
                if (index !== -1) {
                    const unselectedTimeSlots = this.state.unselectedTimeSlots
                    unselectedTimeSlots.splice(index, 1)
                    this.setState({ unselectedTimeSlots: unselectedTimeSlots })
                }
            } else {
                // CHANGE COLOR
                event.target.classList.remove('time-slot-box-busy')
                event.target.classList.add('time-slot-box-free')
                // REMOVE FROM SELECTED TIME SLOT LIST
                const index = this.state.selectedTimeSlots.indexOf(timeSlot)
                if (index !== -1) {
                    const timeSlots = this.state.selectedTimeSlots
                    timeSlots.splice(index, 1)
                    this.setState({ selectedTimeSlots: timeSlots })
                }
                // ADD TO UNSELECTED TIME SLOT LIST IF IT'S ALREADY IN DB
                let isAdded = false
                this.state.userTimeSlots.forEach(ts => {
                    if (ts.time_slot === timeSlot) {
                        isAdded = true
                    }
                    if (isAdded) {
                        this.setState({ unselectedTimeSlots: this.state.unselectedTimeSlots.concat([ts]) })
                    }
                })
            }
        }
    }

    handleUserPresentClick (userPresent) {
        return () => {
            const refreshAttendance = () => {
                CareerDayData.isUserPresent(this.state.user.id, this.props.activeCareerDay.id, (resultAttendance) => {
                    this.setState({ userPresent: resultAttendance.data.data })
                })
            }
            if (userPresent) {
                //  UNSUBSCRIBE FROM CAREER DAY
                CareerDayData.deleteAttendance(this.state.user.id, (unsubscribe) => {
                    console.log(unsubscribe)
                    refreshAttendance()
                })
            } else {
                // SUBSCRIBE TO CAREER DAY
                CareerDayData.addAttendance(this.state.user.id, this.props.activeCareerDay.id, (subscribe) => {
                    console.log(subscribe)
                    refreshAttendance()
                })
            }
        }
    }

    checkPageToDisplay () {
        let page = ''
        if (this.state.pageToDisplay === 'details') {
            switch (this.state.user.id_role) {
            case this.state.roles.Employer:
                page = (
                    <EmployerDetailsComponent
                        employer={this.state.user}
                        enterprise={this.state.enterprise}
                        onModifyButtonClick={this.handleModifyButtonClick}
                        onDeleteButtonClick={this.handleDeleteUserClick}
                        userRole={this.props.userRole}
                        roles={this.state.roles}
                        userPresent={this.state.userPresent}
                        onUserPresentClick={this.handleUserPresentClick}
                    />
                )
                break
            case this.state.roles.Employee:
                page = (
                    <EmployeeDetailsComponent
                        activeCareerDay={this.props.activeCareerDay}
                        employee={this.state.user}
                        enterprise={this.state.enterprise}
                        userTimeSlots={this.state.userTimeSlots}
                        timeSlotisModifiable={this.state.timeSlotisModifiable}
                        onTimeSlotModifyClick={this.handleTimeSlotModifyClick}
                        onTimeSlotClick={this.handleTimeSlotClick}
                        userMeetings={this.state.userMeetings}
                        onModifyButtonClick={this.handleModifyButtonClick}
                        onDeleteButtonClick={this.handleDeleteUserClick}
                    />
                )
                break
            case this.state.roles.Student:
                page = (
                    <StudentDetailsComponent
                        onFileChange={this.handleChangeFile}
                        activeCareerDay={this.props.activeCareerDay}
                        student={this.state.user}
                        studentCriteria={this.state.studentCriteria}
                        studentProvince={this.state.studentProvince}
                        userTimeSlots={this.state.userTimeSlots}
                        timeSlotisModifiable={this.state.timeSlotisModifiable}
                        onTimeSlotModifyClick={this.handleTimeSlotModifyClick}
                        onTimeSlotClick={this.handleTimeSlotClick}
                        userMeetings={this.state.userMeetings}
                        userRole={this.props.userRole}
                        roles={this.state.roles}
                        studentSkills={this.state.studentSkills}
                        studentLanguages={this.state.studentLanguages}
                        studentProgram={this.state.studentProgram}
                        onModifyButtonClick={this.handleModifyButtonClick}
                        onDeleteButtonClick={this.handleDeleteUserClick}
                        userPresent={this.state.userPresent}
                        onUserPresentClick={this.handleUserPresentClick}
                    />
                )
                break
            case this.state.roles.Admin:
                page = (
                    <AdminDetailsComponent
                        admin={this.state.user}
                        onModifyButtonClick={this.handleModifyButtonClick}
                        onDeleteButtonClick={this.handleDeleteUserClick}
                    />
                )
                break
            }
        } else {
            page = (
                <ModifyUserDetailsComponent
                    onFileChange={this.handleChangeCV}
                    errorModify={this.state.errorModify}
                    user={this.state.user}
                    studentUser={this.state.studentUser}
                    studentCriteria={this.state.studentCriteria}
                    program={this.state.studentProgram}
                    programs={this.state.programs}
                    skills={this.state.studentSkills}
                    allSkills={this.state.skills}
                    onSkillsSelectChange={this.handleSkillsSelectChange}
                    languages={this.state.studentLanguages}
                    allLanguages={this.state.languages}
                    onLanguagesSelectChange={this.handleLanguagesSelectChange}
                    province={this.state.studentProvince}
                    allProvinces={this.state.provinces}
                    roles={this.state.roles}
                    onSubmit={this.handleModifyFormSubmit}
                    onCancelClick={this.handleCancelModifyFormClick}
                />
            )
        }
        return page
    }

    render () {
        return (
            <div className='main-container'>
                <h1 className='list-title'>{this.state.title}</h1>
                {this.state.pageOrigin === 'menu' ? '' : <button className='return-btn' onClick={this.props.onReturnBtnClick}>Retour</button>}
                {this.checkPageToDisplay()}
            </div>
        )
    }
}

export default UserDetailsContainer
