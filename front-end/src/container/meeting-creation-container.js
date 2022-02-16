'use strict'

import React, { Component } from 'react'
import CareerDayData from '../service/career-day-data'
import CriteriaCreationComponent from '../component/meeting-creation-components/criteria-creation-component'
import JobListComponent from '../component/meeting-creation-components/job-list-component'
import MatchListComponent from '../component/meeting-creation-components/match-list-component'
import UserDetailsContainer from './user-details-container'
import MeetingCreationComponent from '../component/meeting-creation-components/meeting-creation-component'
import EnterpriseListComponent from '../component/enterprise-list-component'
import ModifyMeetingComponent from '../component/meeting-creation-components/modify-meeting-component'

class MeetingCreationContainer extends Component {
    constructor (props) {
        super(props)

        this.displayType = {
            jobList: 1,
            createJob: 2,
            matchList: 3,
            studentDetails: 4,
            adminCreateMeeting: 5,
            adminCreateMatchs: 6,
            modifyMeeting: 7
        }

        this.state = {
            currentCareerDay: {},
            title: 'Liste Postes',
            display: this.displayType.jobList,
            enterpriseCriteria: [],
            enterpriseEmployees: [],
            activeStudents: [],
            allEnterprises: [],
            programs: [],
            skills: [],
            languages: [],
            provinces: [],
            meetingTypes: {},
            selectedSkills: [],
            selectedLanguages: [],
            addJobError: '',
            jobDetailsDisplay: 'none',
            jobDetailsIdCriteria: 0,
            jobDetailsProvince: {},
            jobDetailsSkills: [],
            jobDetailsLanguages: [],
            matchStudents: [],
            selectedStudent: {},
            selectedStudentTimeSlots: [],
            selectedEmployee: {},
            selectedEmployeeTimeSlots: [],
            selectedMeetingTime: {},
            selectedMeetingUrl: '',
            selectedMeetingType: {},
            errorForm: '',
            enterpriseName: ''
        }

        this.handleDisplayCreateJobForm = this.handleDisplayCreateJobForm.bind(this)
        this.handleSkillsSelectChange = this.handleSkillsSelectChange.bind(this)
        this.handleLanguagesSelectChange = this.handleLanguagesSelectChange.bind(this)
        this.handleAddJobSubmit = this.handleAddJobSubmit.bind(this)
        this.handleCancelClick = this.handleCancelClick.bind(this)
        this.handleJobDetailsClick = this.handleJobDetailsClick.bind(this)
        this.handleJobDetailsCreateMeetingBtnClick = this.handleJobDetailsCreateMeetingBtnClick.bind(this)
        this.handleDeleteJobBtnClick = this.handleDeleteJobBtnClick.bind(this)
        this.handleMatchStudentDetailsClick = this.handleMatchStudentDetailsClick.bind(this)
        this.handleStudentDetailsReturnClick = this.handleStudentDetailsReturnClick.bind(this)
        this.handleScheduleMeetingClick = this.handleScheduleMeetingClick.bind(this)
        this.handleEmployeeSelectChange = this.handleEmployeeSelectChange.bind(this)
        this.handleMatchStudentClick = this.handleMatchStudentClick.bind(this)
        this.handleOkSelectEmployeeClick = this.handleOkSelectEmployeeClick.bind(this)
        this.handleMatchMeetingSubmit = this.handleMatchMeetingSubmit.bind(this)
        this.handleTimeSlotSelectChange = this.handleTimeSlotSelectChange.bind(this)
        this.handleMeetingTypeSelectChange = this.handleMeetingTypeSelectChange.bind(this)
        this.handleEnterpriseSelectChange = this.handleEnterpriseSelectChange.bind(this)
        this.handleActiveStudentSelectChange = this.handleActiveStudentSelectChange.bind(this)
        this.handleEnterpriseListClick = this.handleEnterpriseListClick.bind(this)
        this.handleEnterpriseJobListReturn = this.handleEnterpriseJobListReturn.bind(this)
        this.handleEnterpriseMatchListReturn = this.handleEnterpriseMatchListReturn.bind(this)
        this.handleModifyMeetingSubmit = this.handleModifyMeetingSubmit.bind(this)
    }

    componentDidMount () {
        if (this.props.user.id_role === this.props.roles.Admin) {
            if (this.props.adminCreateMeeting === 'manual') {
                this.setState({ title: 'Créer Meeting', display: this.displayType.adminCreateMeeting })
            } else if (this.props.adminCreateMeeting === 'matches') {
                this.setState({
                    title: 'Postes Par Entreprise',
                    display: this.displayType.adminCreateMatchs
                })
            }
        }
        if (this.props.renderPage === 'modify') {
            this.setState({
                title: 'Modifier Meeting',
                display: this.displayType.modifyMeeting,
                selectedEmployeeTimeSlots: this.props.selectedMeetingEmployeeTimeSlots,
                selectedStudentTimeSlots: this.props.selectedMeetingStudentTimeSlots
            })
        }
        // GET ALL SKILLS
        CareerDayData.getAllSkills((resultSkills) => {
            this.setState({ skills: resultSkills.data.skills })
            // GET ALL LANGUAGES
            CareerDayData.getAllLanguages((resultLanguages) => {
                this.setState({ languages: resultLanguages.data.languages })
                // GET ALL PROGRAMS
                CareerDayData.getAllPrograms((resultPrograms) => {
                    this.setState({ programs: resultPrograms.data.languages })
                    // GET ALL PROVINCES
                    CareerDayData.getAllProvinces((resultProvinces) => {
                        this.setState({ provinces: resultProvinces.data.province })
                        // GET ALL MEETING TYPES
                        CareerDayData.getAllMeetingTypes((resultMeetingTypes) => {
                            const meetingTypes = {}
                            resultMeetingTypes.data.data.forEach(type => {
                                if (type.type === 'présentiel') {
                                    meetingTypes.presentiel = type.id
                                } else {
                                    meetingTypes[type.type] = type.id
                                }
                            })
                            this.setState({ meetingTypes: meetingTypes })
                            // GET CURRENT CAREER DAY ID
                            CareerDayData.getActiveCareerDay((resultCareerDay) => {
                                if (resultCareerDay.data.data) {
                                    this.setState({ currentCareerDay: resultCareerDay.data.data[0] })
                                } else {
                                    this.setState({ currentCareerDay: {} })
                                }
                                // GET ALL ACTIVE STUDENTS
                                CareerDayData.getStudentsByCareerDayId(resultCareerDay.data.data[0], (resultStudents) => {
                                    this.setState({ activeStudents: resultStudents.data.data })
                                    // GET ALL ENTERPRISES
                                    CareerDayData.getEnterprisesByCareerDayId({ id: resultCareerDay.data.data[0].id }, (resultEnterprises) => {
                                        if (resultEnterprises.data.data) {
                                            this.setState({ allEnterprises: resultEnterprises.data.data })
                                        } else {
                                            this.setState({ allEnterprises: [] })
                                        }
                                        // IF CURRENT USER IS EMPLOYER
                                        if (this.props.user.id_role === this.props.roles.Employer || this.props.renderPage === 'modify') {
                                            // GET SAVED JOBS
                                            CareerDayData.getCriteriaByEnterpriseId(this.props.enterpriseId, resultCareerDay.data.data[0].id, (resultCriteria) => {
                                                this.setState({ enterpriseCriteria: resultCriteria.data.data })
                                                // GET ALL EMPLOYEES FROM ENTERPRISE
                                                CareerDayData.getAllEmployeesByEnterpriseId(this.props.enterpriseId, (resultEmployees) => {
                                                    this.setState({ enterpriseEmployees: resultEmployees.data.data })
                                                    // if (this.props.user.id_role === this.props.Employer) {
                                                    CareerDayData.getEnterpriseById(this.props.enterpriseId, (resultEnterpriseInfo) => {
                                                        console.log(resultEnterpriseInfo)
                                                        this.setState({ enterpriseName: resultEnterpriseInfo.data.data[0].name })
                                                    })
                                                    // }
                                                })
                                            })
                                        }
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    handleDisplayCreateJobForm () {
        this.setState({ display: this.displayType.createJob, title: 'Ajouter Un Poste' })
    }

    handleSkillsSelectChange = (skills) => {
        this.setState({ selectedSkills: skills })
    }

    handleLanguagesSelectChange = (languages) => {
        this.setState({ selectedLanguages: languages })
    }

    handleEmployeeSelectChange = (employee) => {
        this.setState({ selectedEmployee: employee })
        CareerDayData.getTimeSlotsByUserId(employee.value, (resultTimeSlots) => {
            this.setState({ selectedEmployeeTimeSlots: resultTimeSlots.data.data })
        })
    }

    handleTimeSlotSelectChange = (timeSlot) => {
        this.setState({ selectedMeetingTime: timeSlot })
    }

    handleMeetingTypeSelectChange = (meetingType) => {
        this.setState({ selectedMeetingType: meetingType })
    }

    handleEnterpriseSelectChange = (enterprise) => {
        this.setState({ enterpriseName: enterprise.label })
        // GET ALL EMPLOYEES FROM ENTERPRISE
        CareerDayData.getAllEmployeesByEnterpriseId(enterprise.value, (resultEmployees) => {
            this.setState({ enterpriseEmployees: resultEmployees.data.data })
        })
    }

    // SAVE SELECTED STUDENT AND GET STUDENT'S TIME SLOTS
    handleActiveStudentSelectChange = (student) => {
        this.setState({ selectedStudent: student })
        CareerDayData.getTimeSlotsByUserId(student.value, (resultTimeSlots) => {
            this.setState({ selectedStudentTimeSlots: resultTimeSlots.data.data })
        })
    }

    handleOkSelectEmployeeClick (event) {
        if (Object.keys(this.state.selectedEmployee).length !== 0) {
            event.target.parentElement.nextSibling.style.display = 'block'
        }
    }

    handleAddJobSubmit (event) {
        event.preventDefault()
        const formFields = event.target.elements
        let addJobError = ''
        if (this.state.selectedSkills.length === 0) {
            addJobError += '* Veuillez choisir au moins une compétence '
        }
        if (this.state.selectedLanguages.length === 0) {
            addJobError += '* Veuillez choisir au moins un langage '
        }
        // CHECK IF THERE ARE ERRORS
        if (addJobError !== '') {
            this.setState({ addJobError: addJobError })
        } else {
            // NO ERRORS
            this.setState({ addJobError: '' })
            const newJobCriteria = {
                id_program: parseInt(formFields.programs.value),
                id_province: parseInt(formFields.provinces.value),
                work_from_home: (formFields.workFromHome.value === '1'),
                work_start_date: formFields.workStartDate.value
            }
            const newEnterpriseCriteriaLinker = {
                idCareerDay: this.state.currentCareerDay.id,
                idEnterprise: this.props.enterpriseId,
                idCriteria: 0,
                title: formFields.jobTitle.value,
                description: formFields.jobDescription.value
            }
            // ADD JOB CRITERIA
            CareerDayData.addCriteria(newJobCriteria, (addCrit) => {
                // ADD ENTERPRISE CRITERIA
                newEnterpriseCriteriaLinker.idCriteria = addCrit.data.data
                CareerDayData.addEnterpriseCriteria(newEnterpriseCriteriaLinker, (addEntCrit) => {
                    // ADD LANGUAGES
                    const languagesIds = []
                    this.state.selectedLanguages.forEach(lang => {
                        languagesIds.push(lang.value)
                    })
                    CareerDayData.addUserLanguages(addCrit.data.data, languagesIds, (...addLang) => {
                        // ADD SKILLS
                        const skillsIds = []
                        this.state.selectedSkills.forEach(skill => {
                            skillsIds.push(skill.value)
                        })
                        CareerDayData.addUserSkills(addCrit.data.data, skillsIds, (...addSkills) => {
                            this.handleCancelClick()
                        })
                    })
                })
            })
        }
    }

    handleCancelClick () {
        // METTRE À JOUR LA LISTE DES POSTES
        CareerDayData.getCriteriaByEnterpriseId(this.props.enterpriseId, this.state.currentCareerDay.id, (resultCriteria) => {
            this.setState({ enterpriseCriteria: resultCriteria.data.data, display: this.displayType.jobList, title: 'Liste Postes' })
        })
    }

    handleJobDetailsClick (criteria) {
        return () => {
            // GET JOB SKILLS
            CareerDayData.getSkillsByCriteriaId(criteria.id_criteria, (resultSkills) => {
                this.setState({ jobDetailsSkills: resultSkills.data.skills })
                // GET JOB LANGUAGES
                CareerDayData.getLanguagesByCriteriaId(criteria.id_criteria, (resultLang) => {
                    this.setState({ jobDetailsLanguages: resultLang.data.languages })
                    // GET JOB PROVINCE
                    CareerDayData.getProvinceById(criteria.id_province, (resultProvince) => {
                        this.setState({ jobDetailsProvince: resultProvince.data.province[0], jobDetailsIdCriteria: criteria.id_criteria })
                        // SET DISPLAY
                        if (this.state.jobDetailsDisplay === 'none') {
                            this.setState({ jobDetailsDisplay: 'block' })
                        } else {
                            this.setState({ jobDetailsDisplay: 'none' })
                        }
                    })
                })
            })
        }
    }

    handleJobDetailsCreateMeetingBtnClick (jobCriteria, jobSkills, jobLanguages) {
        return () => {
            const matchStudents = []
            this.state.activeStudents.forEach(student => {
                if (student.id_program === jobCriteria.id_program) {
                    let matchPoints = 0
                    // CHECK IF PROVINCE MATCHES
                    if (student.id_province === jobCriteria.id_province) {
                        matchPoints += 2
                    }
                    // CHECK IF WORK FROM HOME MATCHES
                    if (student.work_from_home === jobCriteria.work_from_home) {
                        matchPoints++
                    }
                    // CHECK IF DATE MATCHES
                    const dateStudent = new Date(student.work_start_date?.split('T')[0].replace('-', '/'))
                    const dateJob = new Date(jobCriteria.work_start_date?.split('T')[0].replace('-', '/'))
                    if (dateJob.getTime() > dateStudent.getTime()) {
                        matchPoints += 2
                    }
                    // CHECK IF SKILLS MATCH
                    let skillsCount = 0
                    student.skills.forEach(skill => {
                        jobSkills.forEach(jobSkill => {
                            if (skill.id_skill === jobSkill.id_skill) {
                                skillsCount++
                            }
                        })
                    })
                    matchPoints += ((skillsCount * 5) / jobSkills.length)
                    // CHECK IF LANGUAGES MATCH
                    let languagesCount = 0
                    student.languages.forEach(lang => {
                        jobLanguages.forEach(jobLang => {
                            if (lang.id_language === jobLang.id_language) {
                                languagesCount++
                            }
                        })
                    })
                    matchPoints += ((languagesCount * 5) / jobLanguages.length)
                    // CHECK IF STUDENT'S ALREADY ADDED
                    let isAdded = false
                    matchStudents.forEach(stu => {
                        if (stu.student.id === student.id) {
                            isAdded = true
                        }
                    })
                    if (!isAdded) {
                        // ADD STUDENTS TO MATCH LIST WITH THE POINTS OBTAINED
                        const points = (matchPoints * 100) / 15
                        matchStudents.push({ student: student, points: points.toFixed(2) })
                        matchStudents.sort((a, b) => {
                            return parseFloat(a.points) - parseFloat(b.points)
                        })
                    }
                }
            })
            this.setState({ matchStudents: matchStudents.reverse(), display: this.displayType.matchList, title: 'Liste Matches' })
        }
    }

    handleDeleteJobBtnClick (jobCriteria) {
        return () => {
            CareerDayData.deleteEnterpriseCriteria(jobCriteria.id_criteria, (deleteEntCrit) => {
                console.log(deleteEntCrit)
                CareerDayData.deleteAllLanguagesByCriteriaId(jobCriteria.id_criteria, (deleteLang) => {
                    console.log(deleteLang)
                    CareerDayData.deleteAllSkillsByCriteriaId(jobCriteria.id_criteria, (deleteSkills) => {
                        console.log(deleteSkills)
                        CareerDayData.deleteCriteria(jobCriteria.id_criteria, (deleteCrit) => {
                            console.log(deleteCrit)
                            this.handleCancelClick()
                        })
                    })
                })
            })
        }
    }

    // SAVE STUDENT AND GET STUDENT'S TIME SLOTS
    handleMatchStudentClick (student) {
        return (event) => {
            this.setState({ selectedStudent: student })
            CareerDayData.getTimeSlotsByUserId(student.id, (resultTimeSlots) => {
                this.setState({ selectedStudentTimeSlots: resultTimeSlots.data.data })
            })
            if (event.currentTarget.nextSibling.style.display === 'none') {
                const allMatchDetails = document.getElementsByClassName('match-details')
                for (let i = 0; i < allMatchDetails.length; i++) {
                    allMatchDetails[i].style.display = 'none'
                }
                const allMatchSchedule = document.getElementsByClassName('match-schedule')
                for (let i = 0; i < allMatchSchedule.length; i++) {
                    allMatchSchedule[i].style.display = 'none'
                }
                event.currentTarget.nextSibling.style.display = 'flex'
            } else {
                event.currentTarget.nextSibling.style.display = 'none'
                event.currentTarget.nextSibling.nextSibling.style.display = 'none'
            }
        }
    }

    handleMatchStudentDetailsClick (student) {
        return () => {
            this.setState({ selectedStudent: student, display: this.displayType.studentDetails })
        }
    }

    handleStudentDetailsReturnClick () {
        this.setState({ display: this.displayType.matchList })
    }

    handleScheduleMeetingClick (event) {
        event.target.parentElement.parentElement.nextSibling.style.display = 'block'
    }

    handleMatchMeetingSubmit () {
        return (event) => {
            event.preventDefault()
            let errorForm = ''
            if (Object.keys(this.state.selectedStudent).length === 0) {
                errorForm += ' * Veuillez sélectionner un étudiant '
            }
            if (typeof this.state.enterpriseEmployees === 'undefined') {
                errorForm += ' * Veuillez sélectionner une entreprise '
            }
            if (Object.keys(this.state.selectedEmployee).length === 0) {
                errorForm += ' * Veuillez sélectionner un employé '
            }
            if (Object.keys(this.state.selectedMeetingTime).length === 0) {
                errorForm += ' * Veuillez sélectionner une heure de meeting '
            }
            if (Object.keys(this.state.selectedMeetingType).length === 0) {
                errorForm += ' * Veuillez sélectionner un type de meeting '
            }
            // CHECK IF THERE'S ERRORS
            if (errorForm !== '') {
                this.setState({ errorForm: errorForm })
            } else {
                this.setState({ errorForm: '' })
                const newMeeting = {
                    id_employee: this.state.selectedEmployee.value,
                    id_student: (this.props.user.id_role === this.props.roles.Employer || this.props.adminCreateMeeting === 'matches' ? this.state.selectedStudent.id : this.state.selectedStudent.value),
                    virtual_meeting_url: (event.target.elements.virtualMeetingUrl.value === '' ? null : event.target.elements.virtualMeetingUrl.value),
                    id_meeting_type: this.state.selectedMeetingType.value,
                    id_career_day: this.state.currentCareerDay.id,
                    date_time: this.state.selectedMeetingTime.value
                }
                console.log(newMeeting)
                // CREATE MEETING
                CareerDayData.addMeeting(newMeeting, (addMeeting) => {
                    console.log(addMeeting)
                    // ADD STUDENT'S UNAVAILABLE TIME SLOT
                    CareerDayData.addTimeSlot({ id_user: newMeeting.id_student, time_slot: this.state.selectedMeetingTime.value }, (addStudentTimeSlot) => {
                        console.log(addStudentTimeSlot)
                        // ADD EMPLOYEE'S UNAVAILABLE TIME SLOT
                        CareerDayData.addTimeSlot({ id_user: this.state.selectedEmployee.value, time_slot: this.state.selectedMeetingTime.value }, (addEmployeeTimeSlot) => {
                            console.log(addEmployeeTimeSlot)
                            if (this.props.user.id_role === this.props.roles.Admin && this.props.adminCreateMeeting === 'manual') {
                                this.props.onMeetingsListReturn()
                            }
                            alert('Meeting crée!')

                            // NOTIFICATIONS
                            CareerDayData.getEmployeeById(newMeeting.id_employee, (resultEmployee) => {
                                CareerDayData.getAllEmployeesByEnterpriseId(resultEmployee.data.data[0].id_enterprise, (resultEmployees) => {
                                    const employer = resultEmployees.data.data.filter(e => e.id_role === this.props.roles.Employer)
                                    console.log(employer)
                                    // NOTIFICATION EMPLOYEE
                                    CareerDayData.addNotification(
                                        newMeeting.id_employee,
                                        1,
                                        this.props.user.id_role === this.props.roles.Employer || this.props.adminCreateMeeting === 'matches' ? this.state.selectedStudent.name + ' ' + this.state.selectedStudent.last_name : this.state.selectedStudent.label,
                                        this.state.selectedEmployee.label,
                                        this.state.enterpriseName,
                                        (notifEmployee) => {
                                            console.log(notifEmployee)
                                            // NOTIFICATION STUDENT
                                            CareerDayData.addNotification(
                                                newMeeting.id_student,
                                                1,
                                                this.props.user.id_role === this.props.roles.Employer || this.props.adminCreateMeeting === 'matches' ? this.state.selectedStudent.name + ' ' + this.state.selectedStudent.last_name : this.state.selectedStudent.label,
                                                this.state.selectedEmployee.label,
                                                this.state.enterpriseName,
                                                (notifStudent) => {
                                                    console.log(notifStudent)
                                                    // NOTIFICATION EMPLOYER
                                                    CareerDayData.addNotification(
                                                        employer[0].id,
                                                        1,
                                                        this.props.user.id_role === this.props.roles.Employer || this.props.adminCreateMeeting === 'matches' ? this.state.selectedStudent.name + ' ' + this.state.selectedStudent.last_name : this.state.selectedStudent.label,
                                                        this.state.selectedEmployee.label,
                                                        this.state.enterpriseName,
                                                        (notifEmployer) => {
                                                            console.log(notifEmployer)
                                                        })
                                                })
                                        })
                                })
                            })
                        })
                    })
                })
            }
        }
    }

    handleEnterpriseListClick (enterprise) {
        console.log(enterprise)
        this.setState({ enterpriseName: enterprise.name })
        // GET SAVED JOBS
        CareerDayData.getCriteriaByEnterpriseId(enterprise.id, this.state.currentCareerDay.id, (resultCriteria) => {
            this.setState({ enterpriseCriteria: resultCriteria.data.data })
            // GET ALL EMPLOYEES FROM ENTERPRISE
            CareerDayData.getAllEmployeesByEnterpriseId(enterprise.id, (resultEmployees) => {
                this.setState({ enterpriseEmployees: resultEmployees.data.data, display: this.displayType.jobList })
            })
        })
    }

    handleEnterpriseJobListReturn () {
        this.setState({ display: this.displayType.adminCreateMatchs, title: 'Postes Par Entreprise' })
    }

    handleEnterpriseMatchListReturn () {
        this.setState({ display: this.displayType.jobList, title: 'Postes Par Entreprise' })
    }

    handleModifyMeetingSubmit (meeting) {
        return (event) => {
            event.preventDefault()
            const modifiedMeeting = {
                id: meeting.id,
                id_employee: (Object.keys(this.state.selectedEmployee).length === 0 ? meeting.id_employee : this.state.selectedEmployee.value),
                id_student: meeting.id_student,
                virtual_meeting_url: (event.target.elements.virtualMeetingUrl.value === '' ? null : event.target.elements.virtualMeetingUrl.value),
                date_time: (Object.keys(this.state.selectedMeetingTime).length === 0 ? meeting.date_time : this.state.selectedMeetingTime.value),
                id_meeting_type: (Object.keys(this.state.selectedMeetingType).length === 0 ? meeting.id_meeting_type : this.state.selectedMeetingType.value),
                id_career_day: meeting.id_career_day
            }
            // UPDATE MEETING
            CareerDayData.updateMeeting(modifiedMeeting, (resultUpdateMeeting) => {
                console.log(resultUpdateMeeting)
                // VERIFY IT TIME SLOT WAS CHANGED
                if (Object.keys(this.state.selectedMeetingTime).length !== 0) {
                    // DELETE OLD TIME SLOTS
                    CareerDayData.deleteMeetingTimeSlot(meeting.id_employee, meeting.date_time, (resultDeleteTimeSlotEmployee) => {
                        console.log(resultDeleteTimeSlotEmployee)
                        CareerDayData.deleteMeetingTimeSlot(meeting.id_student, meeting.date_time, (resultDeleteTimeSlotStudent) => {
                            console.log(resultDeleteTimeSlotStudent)
                            // SAVE NEW TIME SLOTS
                            CareerDayData.addTimeSlot({ id_user: modifiedMeeting.id_employee, time_slot: modifiedMeeting.date_time }, (addTimeEmployee) => {
                                console.log(addTimeEmployee)
                                CareerDayData.addTimeSlot({ id_user: modifiedMeeting.id_student, time_slot: modifiedMeeting.date_time }, (addTimeEmployee) => {
                                    console.log(addTimeEmployee)
                                    this.props.onMeetingsListReturn()
                                })
                            })
                        })
                    })
                } else {
                    // GO BACK TO MEETINGS LIST
                    this.props.onMeetingsListReturn()
                }
                // NOTIFICATIONS
                // CareerDayData.getEmployeeById(modifiedMeeting.id_employee, (resultEmployee) => {
                // CareerDayData.getAllEmployeesByEnterpriseId(resultEmployee.data.data[0].id_enterprise, (resultEmployees) => {
                //     const employer = resultEmployees.data.data.filter(e => e.id_role === this.props.roles.Employer)
                //     console.log(employer)
                // NOTIFICATION EMPLOYEE
                // CareerDayData.addNotification(
                //     modifiedMeeting.id_employee,
                //     4,
                //     meeting.student_name,
                //     (Object.keys(this.state.selectedEmployee).length === 0 ? meeting.employee_name : this.state.selectedEmployee.label),
                //     meeting.enterprise_name,
                //     (notifEmployee) => {
                //         console.log(notifEmployee)
                //         // NOTIFICATION STUDENT
                //         CareerDayData.addNotification(
                //             modifiedMeeting.id_student,
                //             4,
                //             meeting.student_name,
                //             (Object.keys(this.state.selectedEmployee).length === 0 ? meeting.employee_name : this.state.selectedEmployee.label),
                //             meeting.enterprise_name,
                //             (notifStudent) => {
                //                 console.log(notifStudent)
                //                 // NOTIFICATION EMPLOYER
                //                 // CareerDayData.addNotification(
                //                 //     employer[0].id,
                //                 //     4,
                //                 //     meeting.student_name,
                //                 //     (Object.keys(this.state.selectedEmployee).length === 0 ? meeting.employee_name : this.state.selectedEmployee.label),
                //                 //     meeting.enterprise_name,
                //                 //     (notifStudent) => {
                //                 //         console.log(notifStudent)
                //                 //     })
                //             })
                //     })
                // })
                // })
                // NOTIFICATION EMPLOYEE
                CareerDayData.addNotification(
                    modifiedMeeting.id_employee,
                    4,
                    meeting.student_name,
                    (Object.keys(this.state.selectedEmployee).length === 0 ? meeting.employee_name : this.state.selectedEmployee.label),
                    meeting.enterprise_name,
                    (notifEmployee) => {
                        console.log(notifEmployee)
                    })
                // NOTIFICATION STUDENT
                CareerDayData.addNotification(
                    modifiedMeeting.id_student,
                    4,
                    meeting.student_name,
                    (Object.keys(this.state.selectedEmployee).length === 0 ? meeting.employee_name : this.state.selectedEmployee.label),
                    meeting.enterprise_name,
                    (notifStudent) => {
                        console.log(notifStudent)
                    })
            })
        }
    }

    display () {
        let display = ''
        switch (this.state.display) {
        case this.displayType.jobList:
            display = (
                <JobListComponent
                    enterpriseCriteria={this.state.enterpriseCriteria}
                    programs={this.state.programs}
                    jobDetailsDisplay={this.state.jobDetailsDisplay}
                    onDetailsClick={this.handleJobDetailsClick}
                    jobDetailsProvince={this.state.jobDetailsProvince}
                    jobDetailsSkills={this.state.jobDetailsSkills}
                    jobDetailsLanguages={this.state.jobDetailsLanguages}
                    jobDetailsIdCriteria={this.state.jobDetailsIdCriteria}
                    onCreateMeetingClick={this.handleJobDetailsCreateMeetingBtnClick}
                    onDeleteJobClick={this.handleDeleteJobBtnClick}
                />
            )
            break
        case this.displayType.createJob:
            display = (
                <CriteriaCreationComponent
                    addJobError={this.state.addJobError}
                    programs={this.state.programs}
                    skills={this.state.skills}
                    languages={this.state.languages}
                    provinces={this.state.provinces}
                    onSkillsSelectChange={this.handleSkillsSelectChange}
                    onLanguagesSelectChange={this.handleLanguagesSelectChange}
                    onFormSubmit={this.handleAddJobSubmit}
                    onCancelClick={this.handleCancelClick}
                />
            )
            break
        case this.displayType.matchList:
            display = (
                <MatchListComponent
                    user={this.props.user}
                    matchStudents={this.state.matchStudents}
                    onStudentClick={this.handleMatchStudentClick}
                    onStudentDetailsClick={this.handleMatchStudentDetailsClick}
                    onScheduleMeetingClick={this.handleScheduleMeetingClick}
                    employees={this.state.enterpriseEmployees}
                    roles={this.props.roles}
                    onEmployeeSelectChange={this.handleEmployeeSelectChange}
                    currentCareerDay={this.state.currentCareerDay}
                    studentTimeSlots={this.state.selectedStudentTimeSlots}
                    employeeTimeSlots={this.state.selectedEmployeeTimeSlots}
                    onOkSelectEmployeeClick={this.handleOkSelectEmployeeClick}
                    onTimeSlotSelectChange={this.handleTimeSlotSelectChange}
                    meetingTypes={this.state.meetingTypes}
                    onMeetingTypeSelectChange={this.handleMeetingTypeSelectChange}
                    onMatchMeetingSubmit={this.handleMatchMeetingSubmit}
                    errorForm={this.state.errorForm}
                />
            )
            break
        case this.displayType.studentDetails:
            display = (
                <UserDetailsContainer
                    user={this.state.selectedStudent}
                    roles={this.props.roles}
                    pageOrigin='matches'
                    userRole={this.props.user.id_role}
                    onReturnBtnClick={this.handleStudentDetailsReturnClick}
                    activeCareerDay={this.state.currentCareerDay}
                />
            )
            break
        case this.displayType.adminCreateMeeting:
            display = (
                <MeetingCreationComponent
                    typeForm='admin'
                    allEnterprises={this.state.allEnterprises}
                    onEnterpriseSelectChange={this.handleEnterpriseSelectChange}
                    currentCareerDay={this.state.currentCareerDay}
                    studentTimeSlots={this.state.selectedStudentTimeSlots}
                    employeeTimeSlots={this.state.selectedEmployeeTimeSlots}
                    onTimeSlotSelectChange={this.handleTimeSlotSelectChange}
                    meetingTypes={this.state.meetingTypes}
                    onMeetingTypeSelectChange={this.handleMeetingTypeSelectChange}
                    onMatchMeetingSubmit={this.handleMatchMeetingSubmit}
                    activeStudents={this.state.activeStudents}
                    onActiveStudentSelectChange={this.handleActiveStudentSelectChange}
                    enterpriseEmployees={this.state.enterpriseEmployees}
                    roles={this.props.roles}
                    onEmployeeSelectChange={this.handleEmployeeSelectChange}
                    errorForm={this.state.errorForm}
                    checkIfCareerDayHasStudents={this.checkIfCareerDayHasStudents}
                    checkIfCareerDayHasEnterprises={this.checkIfCareerDayHasEnterprises}
                />
            )
            break
        case this.displayType.adminCreateMatchs:
            display = (
                <EnterpriseListComponent
                    enterprises={this.state.allEnterprises}
                    onHandleDetailsClick={this.handleEnterpriseListClick}
                    showImage
                />
            )
            break
        case this.displayType.modifyMeeting:
            display = (
                <ModifyMeetingComponent
                    user={this.props.user}
                    roles={this.props.roles}
                    meeting={this.props.selectedMeeting}
                    employeeFullName={this.props.selectedMeetingEmployeeFullName}
                    enterpriseEmployees={this.state.enterpriseEmployees}
                    onEmployeeSelectChange={this.handleEmployeeSelectChange}
                    meetingTypes={this.state.meetingTypes}
                    onMeetingTypeSelectChange={this.handleMeetingTypeSelectChange}
                    currentCareerDay={this.state.currentCareerDay}
                    studentTimeSlots={this.state.selectedStudentTimeSlots}
                    employeeTimeSlots={this.state.selectedEmployeeTimeSlots}
                    onTimeSlotSelectChange={this.handleTimeSlotSelectChange}
                    onModifyMeetingSubmit={this.handleModifyMeetingSubmit}
                />
            )
            break
        }
        return display
    }

    checkIfCareerDayHasStudents (activeStudents) {
        let careerDayHasStudents = false
        if (activeStudents !== undefined && activeStudents !== null) {
            if (activeStudents.length > 0) { careerDayHasStudents = true }
        }
        return careerDayHasStudents
    }

    checkIfCareerDayHasEnterprises (allEnterprises) {
        let careerDayHasEnterprises = false
        if (allEnterprises !== undefined && allEnterprises !== null) {
            if (allEnterprises.length > 0) { careerDayHasEnterprises = true }
        }
        return careerDayHasEnterprises
    }

    pageAccess () {
        let page = ''
        let title = <h1 className='list-title'>{this.state.title}</h1>
        let btnReturn = ''
        // SET NO TITLE IF IT'S STUDENT DETAILS PAGE
        if (this.state.display === this.displayType.studentDetails) {
            title = ''
        }
        // IF USER IS EMPLOYER
        if (this.props.user.id_role === this.props.roles.Employer) {
            let btnAddJob = ''
            if (this.state.display === this.displayType.jobList) {
                btnAddJob = (
                    <div className='cancel-button'>
                        <button className='s-modify-button' onClick={this.handleDisplayCreateJobForm}>
                            Ajouter un poste
                        </button>
                    </div>
                )
            }
            // SET RETURN BUTTON
            if (this.state.display === this.displayType.studentDetails) {
                btnReturn = ''
            } else if (this.state.display === this.displayType.createJob || this.state.display === this.displayType.matchList) {
                btnReturn = <button className='return-btn' onClick={this.handleCancelClick}>Retour</button>
            } else {
                btnReturn = <button className='return-btn' onClick={this.props.onMeetingsListReturn}>Retour</button>
            }
            page = (
                <div>
                    {title}
                    {btnReturn}
                    <div>
                        {btnAddJob}
                        {this.display()}
                    </div>
                </div>
            )
        } else if (this.props.user.id_role === this.props.roles.Admin) {
            if (this.state.display === this.displayType.studentDetails) {
                btnReturn = ''
            } else if (this.state.display === this.displayType.jobList) {
                // RETOUR VERS LISTE D'ENTREPRISES
                btnReturn = <button className='return-btn' onClick={this.handleEnterpriseJobListReturn}>Retour</button>
            } else if (this.state.display === this.displayType.matchList) {
                // RETOUR VERS LIST DE POSTES
                btnReturn = <button className='return-btn' onClick={this.handleEnterpriseMatchListReturn}>Retour</button>
            } else {
                // RETOUR VERS LISTE DE MEETINGS
                btnReturn = <button className='return-btn' onClick={this.props.onMeetingsListReturn}>Retour</button>
            }
            page = (
                <div>
                    {title}
                    {btnReturn}
                    <div>
                        {this.display()}
                    </div>
                </div>
            )
        } else if (this.props.user.id_role === this.props.roles.Employee) {
            page = (
                <div>
                    {title}
                    <button className='return-btn' onClick={this.props.onMeetingsListReturn}>Retour</button>
                    <div>
                        {this.display()}
                    </div>
                </div>
            )
        }
        return page
    }

    render () {
        return (
            <div className='main-container'>
                {this.pageAccess()}
            </div>
        )
    }
}

export default MeetingCreationContainer
