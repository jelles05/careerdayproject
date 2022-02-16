'use strict'

import React, { Component } from 'react'
import MeetingsListComponent from '../component/meeting-list-components/meetings-list-component'
import SearchBarComponent from '../component/search-bar-component'
import CareerDayData from '../service/career-day-data'
import MeetingCreationContainer from './meeting-creation-container'
import ReactModal from 'react-modal'

class MeetingsContainer extends Component {
    constructor (props) {
        super(props)

        this.displayType = {
            list: 1,
            createMeeting: 2,
            searchResult: 3,
            modifyMeeting: 4
        }

        this.state = {
            meetings: [],
            displayType: this.displayType.list,
            showingDetails: false,
            currentDetail: null,
            currentCareerDay: null,
            enterpriseId: 0,
            showModal: false,
            isRegisteredInCareerDay: false,
            meetingTypes: {},
            searchMeetings: [],
            adminCreateMeeting: '',
            selectedMeeting: {},
            selectedMeetingEmployeeFullName: '',
            selectedMeetingEmployeeTimeSlots: [],
            selectedMeetingStudentTimeSlots: []
        }

        this.handleDetailsClick = this.handleDetailsClick.bind(this)
        this.handleCreateMeetingClick = this.handleCreateMeetingClick.bind(this)
        this.handleCreateMeetingByMatchsClick = this.handleCreateMeetingByMatchsClick.bind(this)
        this.handleCloseModal = this.handleCloseModal.bind(this)
        this.handleReturnToMeetingsList = this.handleReturnToMeetingsList.bind(this)
        this.handleCancelMeetingClick = this.handleCancelMeetingClick.bind(this)
        this.handleSearchBarInput = this.handleSearchBarInput.bind(this)
        this.handleViewAllClick = this.handleViewAllClick.bind(this)
        this.isMeetingCareerDayOver = this.isMeetingCareerDayOver.bind(this)
        this.handleModifyMeetingButtonClick = this.handleModifyMeetingButtonClick.bind(this)
    }

    componentDidMount () {
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
            CareerDayData.getActiveCareerDay(resultCareerDay => {
                console.log(resultCareerDay)
                if (resultCareerDay.data.data) {
                    this.setState({ currentCareerDay: resultCareerDay.data.data[0] })
                } else {
                    this.setState({ currentCareerDay: {} })
                }
                switch (this.props.user.id_role) {
                case this.props.roles.Admin:
                    CareerDayData.getAllMeetings(this.state.currentCareerDay.id, (result) => this.setState({ meetings: result.data.data }))
                    break
                case this.props.roles.Student:
                case this.props.roles.Employee:
                    CareerDayData.getAllMeetingsByUser(this.state.currentCareerDay.id, this.props.user.id, (result) => {
                        this.setState({ meetings: result.data.data })
                        if (this.props.user.id_role === this.props.roles.Student) {
                            this.checkIfUserIsRegistered(this.props.user.id, this.state.currentCareerDay.id)
                        }
                    })
                    break
                case this.props.roles.Employer:
                    CareerDayData.getEmployeeById(this.props.user.id, (result) => {
                        this.setState({ enterpriseId: result.data.data[0].id_enterprise })
                        CareerDayData.getAllMeetingsByEnterpriseId(this.state.currentCareerDay.id, result.data.data[0].id_enterprise, (r) => {
                            this.setState({ meetings: r.data.data })
                            this.checkIfUserIsRegistered(this.props.user.id, this.state.currentCareerDay.id)
                        })
                    })
                    break
                }
            })
        })
    }

    isMeetingCareerDayOver (meeting) {
        const currentDate = new Date(Date.now())
        const careerDayDate = new Date(this.state.currentCareerDay.date.split('T')[0].replace('-', '/'))
        let isOver = false

        if (currentDate.getFullYear() < careerDayDate.getFullYear() && currentDate.getMonth() < careerDayDate.getMonth() && currentDate.getDate() < careerDayDate.getDate()) {
            // avant la journee carriere
            isOver = false
        } else if (currentDate.getFullYear() === careerDayDate.getFullYear() && currentDate.getMonth() === careerDayDate.getMonth() && currentDate.getDate() === careerDayDate.getDate()) {
            // pendant la journee carriere
            const currentHour = currentDate.getHours()
            const currentMinutes = currentDate.getMinutes()

            const meetingDate = meeting.date_time.split('h')

            const meetingHour = parseInt(meetingDate[0])
            const meetingMinutes = meetingDate[1] !== '' ? parseInt(meetingDate[1]) : 0

            let finalHour = -1
            let finalMinute = -1
            const meetingDuration = meetingMinutes + this.state.currentCareerDay.meeting_duration

            if (meetingDuration > 60) {
                finalHour = meetingHour + 1
                finalMinute = meetingDuration - 60
            }
            if (meetingDuration === 60) {
                finalMinute = 0
                finalHour = meetingHour + 1
            }
            if (meetingDuration < 60) {
                finalHour = meetingHour
                finalMinute = meetingDuration
            }

            if (finalHour < currentHour) {
                isOver = true
            } else if (finalHour === currentHour) {
                if (currentMinutes > finalMinute) {
                    isOver = true
                }
            }
        } else {
            // apres la journee carriere
            isOver = true
        }

        return isOver
    }

    handleModifyMeetingButtonClick (meeting) {
        return () => {
            CareerDayData.getEmployeeById(meeting.id_employee, (resultEmployee) => {
                CareerDayData.getTimeSlotsByUserId(meeting.id_employee, (resultEmployeeTimeSlots) => {
                    CareerDayData.getTimeSlotsByUserId(meeting.id_student, (resultStudentTimeSlots) => {
                        this.setState({
                            enterpriseId: resultEmployee.data.data[0].id_enterprise,
                            selectedMeeting: meeting,
                            displayType: this.displayType.modifyMeeting,
                            selectedMeetingEmployeeFullName: resultEmployee.data.data[0].name + ' ' + resultEmployee.data.data[0].last_name,
                            selectedMeetingEmployeeTimeSlots: resultEmployeeTimeSlots.data.data,
                            selectedMeetingStudentTimeSlots: resultStudentTimeSlots.data.data
                        })
                    })
                })
            })
        }
    }

    registerScreen () {
        if (!this.state.isRegisteredInCareerDay) {
            this.setState({ showModal: true })
        }
    }

    checkIfUserIsRegistered (idUser, idCareerDay) {
        CareerDayData.isUserPresent(idUser, idCareerDay, (result) => {
            if (result.data.data) {
                console.log('data')
                this.setState({ isRegisteredInCareerDay: true })
            } else {
                console.log('no')
                this.setState({ isRegisteredInCareerDay: false, showModal: true })
            }
        })
    }

    handleDetailsClick (currentDetail) {
        this.setState({ showingDetails: !this.state.showingDetails, currentDetail: currentDetail })
    }

    handleCreateMeetingClick () {
        this.setState({ displayType: this.displayType.createMeeting, adminCreateMeeting: 'manual' })
    }

    handleCreateMeetingByMatchsClick () {
        this.setState({ displayType: this.displayType.createMeeting, adminCreateMeeting: 'matches' })
    }

    displayCreateMeetingBtn () {
        let btn = ''
        if (!(this.state.currentCareerDay === null) || !(this.state.currentCareerDay === undefined)) {
            if (this.props.user.id_role === this.props.roles.Admin) {
                btn = (
                    <div>
                        <div>
                            <button onClick={this.handleCreateMeetingClick} className='s-add-user-button'>Créer un meeting manuellement</button>
                        </div>
                        <div>
                            <button onClick={this.handleCreateMeetingByMatchsClick} className='s-add-user-button'>Créer un meeting par matchs</button>
                        </div>
                    </div>
                )
            } else if (this.props.user.id_role === this.props.roles.Employer) {
                btn = (
                    <div>
                        <button onClick={this.handleCreateMeetingClick} className='s-add-user-button'>Créer un meeting</button>
                    </div>
                )
            }
        }
        return btn
    }

    handleCloseModal () {
        CareerDayData.addAttendance(this.props.user.id, this.state.currentCareerDay.id, (result) => {
            console.log(result.data.data)
        })
        this.setState({ showModal: false })
    }

    handleReturnToMeetingsList () {
        if (Object.keys(this.state.currentCareerDay).length !== 0) {
            // REFRESH MEETINGS LIST
            switch (this.props.user.id_role) {
            case this.props.roles.Admin:
                CareerDayData.getAllMeetings(this.state.currentCareerDay.id, (result) => this.setState({ meetings: result.data.data, displayType: this.displayType.list }))
                break
            case this.props.roles.Student:
            case this.props.roles.Employee:
                CareerDayData.getAllMeetingsByUser(this.state.currentCareerDay.id, this.props.user.id, (result) => {
                    this.setState({ meetings: result.data.data, displayType: this.displayType.list })
                })
                break
            case this.props.roles.Employer:
                CareerDayData.getAllMeetingsByEnterpriseId(this.state.currentCareerDay.id, this.state.enterpriseId, (r) => {
                    this.setState({ meetings: r.data.data, displayType: this.displayType.list })
                })
                break
            }
        } else {
            this.setState({ displayType: this.displayType.list })
        }
    }

    handleCancelMeetingClick (meeting) {
        return () => {
            // DELETE MEETING
            CareerDayData.deleteMeeting(meeting.id, (deleteMeeting) => {
                // DELETE EMPLOYEE'S MEETING TIME SLOT
                CareerDayData.deleteMeetingTimeSlot(meeting.id_employee, meeting.date_time, (deleteTimeSlotEmployee) => {
                    // DELETE STUDENT'S MEETING TIME SLOT
                    CareerDayData.deleteMeetingTimeSlot(meeting.id_student, meeting.date_time, (deleteTimeSlotStudent) => {
                        this.handleReturnToMeetingsList()

                        // NOTIFICATION EMPLOYEE
                        CareerDayData.addNotification(
                            meeting.id_employee,
                            2,
                            meeting.student_name,
                            meeting.employee_name,
                            meeting.enterprise_name,
                            (notifEmployee) => {
                                console.log(notifEmployee)
                            })
                        // NOTIFICATION STUDENT
                        CareerDayData.addNotification(
                            meeting.id_student,
                            2,
                            meeting.student_name,
                            meeting.employee_name,
                            meeting.enterprise_name,
                            (notifStudent) => {
                                console.log(notifStudent)
                            })
                    })
                })
            })
        }
    }

    handleSearchBarInput (event) {
        let searchMeetings = []
        if (this.props.user.id_role === this.props.roles.Employer) {
            searchMeetings = this.state.meetings.filter(meet => meet.employee_name.toLowerCase().includes(event.target.value.toLowerCase()) || meet.student_name.toLowerCase().includes(event.target.value.toLowerCase()))
        } else if (this.props.user.id_role === this.props.roles.Employee) {
            searchMeetings = this.state.meetings.filter(meet => meet.student_name.toLowerCase().includes(event.target.value.toLowerCase()))
        } else if (this.props.user.id_role === this.props.roles.Student) {
            searchMeetings = this.state.meetings.filter(meet => meet.enterprise_name.toLowerCase().includes(event.target.value.toLowerCase()))
        } else {
            searchMeetings = this.state.meetings.filter(meet => meet.enterprise_name.toLowerCase().includes(event.target.value.toLowerCase()) || meet.student_name.toLowerCase().includes(event.target.value.toLowerCase()))
        }
        this.setState({ searchMeetings: searchMeetings, displayType: this.displayType.searchResult })
    }

    handleViewAllClick () {
        this.setState({ displayType: this.displayType.list })
    }

    display (displayType) {
        let display = ''
        switch (displayType) {
        case this.displayType.list:
        case this.displayType.searchResult:
            display = (
                <div>
                    <ReactModal
                        isOpen={this.state.showModal}
                        contentLabel='onRequestClose Example'
                        onRequestClose={this.handleCloseModal}
                        shouldCloseOnOverlayClick={false}
                        className='Modal'
                        overlayClassName='Overlay'
                        ariaHideApp={false}
                    >
                        <p>Vous n'êtes pas encore inscrit à la journée carrière courrante. Voulez-vous vous inscrire?</p>
                        <button className='s-button s-button-accept' onClick={this.handleCloseModal}>Oui</button>
                        <button className='s-button s-button-decline' onClick={this.props.onLogout}>Non</button>
                    </ReactModal>
                    <h1 className='list-title'>Liste Meetings</h1>
                    <div className='admin-user-bar'>
                        <SearchBarComponent onSearchBarInput={this.handleSearchBarInput} onViewAllClick={this.handleViewAllClick} />
                        {this.displayCreateMeetingBtn()}
                    </div>
                    <MeetingsListComponent
                        meetings={displayType === this.displayType.list ? this.state.meetings : this.state.searchMeetings}
                        user={this.props.user}
                        roles={this.props.roles}
                        showingDetails={this.state.showingDetails}
                        onHandleDetailsClick={this.handleDetailsClick}
                        currentDetails={this.state.currentDetail}
                        onCancelMeetingClick={this.handleCancelMeetingClick}
                        meetingTypes={this.state.meetingTypes}
                        isMeetingCareerDayOver={this.isMeetingCareerDayOver}
                        onModifyMeetingButtonClick={this.handleModifyMeetingButtonClick}
                    />
                    <div className='margin-bottom' />
                </div>
            )
            break
        case this.displayType.createMeeting:
            display = (
                <MeetingCreationContainer
                    user={this.props.user}
                    roles={this.props.roles}
                    enterpriseId={this.state.enterpriseId}
                    onMeetingsListReturn={this.handleReturnToMeetingsList}
                    adminCreateMeeting={this.state.adminCreateMeeting}
                />
            )
            break
        case this.displayType.modifyMeeting:
            display = (
                <MeetingCreationContainer
                    user={this.props.user}
                    roles={this.props.roles}
                    enterpriseId={this.state.enterpriseId}
                    onMeetingsListReturn={this.handleReturnToMeetingsList}
                    adminCreateMeeting={this.state.adminCreateMeeting}
                    selectedMeeting={this.state.selectedMeeting}
                    renderPage='modify'
                    selectedMeetingEmployeeFullName={this.state.selectedMeetingEmployeeFullName}
                    selectedMeetingEmployeeTimeSlots={this.state.selectedMeetingEmployeeTimeSlots}
                    selectedMeetingStudentTimeSlots={this.state.selectedMeetingStudentTimeSlots}
                />
            )
            break
        }
        return display
    }

    render () {
        return (
            <div className='main-container'>
                {this.display(this.state.displayType)}
            </div>
        )
    }
}

export default MeetingsContainer
