'use strict'

import React, { Component } from 'react'
import '../css/style.css'
import CareerDayData from 'service/career-day-data'
import ConnectionContainer from 'container/connection-container'
import MainMenuComponent from 'component/main-menu-component'
import CareerDayContainer from 'container/career-day-container'
import MeetingsContainer from 'container/meetings-container'
import EnterprisesContainer from 'container/enterprises-container'
import UsersContainer from 'container/users-container'
import UserDetailsContainer from 'container/user-details-container'
import UserCreationContainer from './user-creation-container'

class MainContainer extends Component {
    constructor () {
        super()

        this.state = {
            roles: {},
            pageToRender: 'connection',
            user: {},
            errorLogin: '',
            errorSignUp: '',
            activeCareerDay: {},
            notifications: [],
            nbNewNotifications: 0
        }

        this.handleLogin = this.handleLogin.bind(this)
        this.handleSignUp = this.handleSignUp.bind(this)
        this.handleMenuClick = this.handleMenuClick.bind(this)
        this.handleLogoutClick = this.handleLogoutClick.bind(this)
        this.handleProfileSave = this.handleProfileSave.bind(this)
        this.handleResetSignUpError = this.handleResetSignUpError.bind(this)
        this.handleSetCareerDay = this.handleSetCareerDay.bind(this)
        this.getNotificationsByUserId = this.getNotificationsByUserId.bind(this)
        this.handleNotificationCLick = this.handleNotificationCLick.bind(this)
    }

    componentDidMount () {
        // GET ALL ROLES
        CareerDayData.getAllRoles((result) => {
            const roles = {}
            result.data.data.forEach(roleInfo => {
                roles[roleInfo.role] = roleInfo.id
            })
            this.setState({ roles: roles })
            // GET ACTIVE CAREER DAY
            CareerDayData.getActiveCareerDay((resultCareerDay) => {
                if (resultCareerDay.data.data) {
                    this.setState({ activeCareerDay: resultCareerDay.data.data[0] })
                } else {
                    this.setState({ activeCareerDay: {} })
                }
            })
        })
    }

    getNotificationsByUserId (userId, pageToRender) {
        let notifications = ''
        CareerDayData.getNotificationsByUserId(userId, result => {
            console.log('Notifications: ', result.data.notifications)
            notifications = result.data.notifications
            const notRead = notifications.filter((notification) => !notification.is_read)
            this.setState({ pageToRender: pageToRender, notifications: notifications, nbNewNotifications: notRead.length })
        })

        return notifications
    }

    // CHECK LOGIN INFORMATION
    handleLogin (event) {
        event.preventDefault()
        CareerDayData.login({ email: event.target.elements.email.value, password: event.target.elements.password.value },
            // IF USER EXISTS
            (result) => {
                CareerDayData.getUserById(result.data.data[0].id, (resultUser) => {
                    this.setState({ user: resultUser.data.data[0], errorLogin: '' })
                    // IF IT'S ADMIN
                    if (this.state.user.id_role === this.state.roles.Admin) {
                        // this.setState({ pageToRender: 'career-day' })
                        this.getNotificationsByUserId(resultUser.data.data[0].id, 'career-day')
                    } else {
                        if (Object.entries(this.state.activeCareerDay).length !== 0) {
                            // IF IT'S STUDENT CHECK IF PROFILE IS COMPLETED
                            if (this.state.user.id_role === this.state.roles.Student) {
                                CareerDayData.getStudentByUserId(this.state.user.id, (resultStudent) => {
                                    if (resultStudent.data.data) {
                                        this.getNotificationsByUserId(resultUser.data.data[0].id, 'meetings')
                                    } else {
                                        this.setState({ pageToRender: 'complete-profile' })
                                    }
                                })
                            } else {
                                this.getNotificationsByUserId(resultUser.data.data[0].id, 'meetings')
                                // this.getNotificationsByUserId(resultUser.data.data[0].id)
                            }
                        } else {
                            this.setState({ errorLogin: 'Il n\'y a pas de journée carrière active, revenez plus tard' })
                        }
                    }
                })
            },
            // IF USER DOESN'T EXIST
            () => {
                this.setState({ errorLogin: 'Utilisateur non trouvé' })
            })
    }

    // CHECK SIGN UP INFORMATION
    handleSignUp (event) {
        event.preventDefault()
        let error = ''
        const lastName = event.target.elements.lastName.value
        if (lastName.length > 30) {
            error += '* Nom trop long '
        }
        const name = event.target.elements.name.value
        if (name.length > 30) {
            error += '* Prénom trop long '
        }
        const email = event.target.elements.email.value
        if (email.length > 100) {
            error += '* Email trop long '
        }
        const password = event.target.elements.password.value
        const passwordConfirmation = event.target.elements.passwordConfirmation.value
        if (password.length > 30) {
            error += '* Mot de passe trop long '
        }
        if (password !== passwordConfirmation) {
            error += '* Le mot de passe ne correspond pas à la confirmation '
        }
        // IF THERE ARE MISTAKES
        if (error !== '') {
            this.setState({ errorSignUp: error })
        } else {
            // IF EVERYTHING'S OK
            this.setState({ errorSignUp: '' })
            // add user to db
            const newStudentUser = {
                email: event.target.elements.email.value,
                password: event.target.elements.password.value,
                id_role: this.state.roles.Student,
                last_name: event.target.elements.lastName.value,
                name: event.target.elements.name.value
            }
            // ADD USER
            CareerDayData.addUser(newStudentUser,
                (userAdd) => {
                    console.log(userAdd)
                    // GET NEW USER ENTRY
                    CareerDayData.login({ email: newStudentUser.email, password: newStudentUser.password }, (logStudent) => {
                        console.log(logStudent)
                        this.setState({ user: logStudent.data.data[0], pageToRender: 'complete-profile' })
                    })
                },
                () => {
                    this.setState({ errorSignUp: ' * Cet email est déjà enregistré ' })
                }
            )
        }
    }

    handleResetSignUpError () {
        this.setState({ errorSignUp: '' })
    }

    displayConnectionContainer () {
        let container = ''
        if (this.state.pageToRender === 'connection') {
            container = <ConnectionContainer onLogin={this.handleLogin} errorLogin={this.state.errorLogin} onSignUp={this.handleSignUp} errorSignUp={this.state.errorSignUp} onResetSignUpError={this.handleResetSignUpError} />
        }
        return container
    }

    handleProfileSave () {
        this.setState({ pageToRender: 'profile' })
    }

    pageToRender () {
        let page = ''
        switch (this.state.pageToRender) {
        case 'career-day':
            page = <CareerDayContainer onCareerDayChange={this.handleSetCareerDay} />
            break
        case 'meetings':
            page = <MeetingsContainer user={this.state.user} roles={this.state.roles} onLogout={this.handleLogoutClick} />
            break
        case 'enterprises':
            page = <EnterprisesContainer roles={this.state.roles} user={this.state.user} />
            break
        case 'users':
            page = <UsersContainer roles={this.state.roles} userRole={this.state.user.id_role} loginUser={this.state.user} activeCareerDay={this.state.activeCareerDay} />
            break
        case 'profile':
            page = <UserDetailsContainer user={this.state.user} roles={this.state.roles} pageOrigin='menu' userRole={this.state.user.id_role} onLogout={this.handleLogoutClick} activeCareerDay={this.state.activeCareerDay} />
            break
        case 'complete-profile':
            page = <UserCreationContainer userRole={this.state.user.id_role} roles={this.state.roles} pageOrigin='sign-up' loginUser={this.state.user} onReturn={this.handleProfileSave} />
            break
        }
        return page
    }

    handleMenuClick (option) {
        return () => {
            this.getNotificationsByUserId(this.state.user.id, option)
            // this.setState({ pageToRender: option })
        }
    }

    handleLogoutClick () {
        this.setState({ pageToRender: 'connection', user: {} })
    }

    // UPDATE ACTIVE CAREER DAY AFTER CHANGEMENT IN DASHBOARD
    handleSetCareerDay (newActiveCareerDay) {
        this.setState({ activeCareerDay: newActiveCareerDay })
    }

    handleNotificationCLick (notification) {
        return () => {
            CareerDayData.updateNotification(notification, (result) => {
                console.log(result)
            })
        }
    }

    displayMainMenu () {
        const testNotification = {}
        testNotification.date = new Date('1995-12-17T03:24:00.000Z')
        testNotification.title = 'Nouveau Meeting'
        testNotification.is_read = true
        testNotification.id = 10
        testNotification.student_name = 'student'
        testNotification.employee_name = 'employee'
        testNotification.enterprise_name = 'enterprise'

        // const notifications = [testNotification, testNotification, testNotification]

        let menu = ''
        if (this.state.pageToRender !== 'connection' && this.state.pageToRender !== 'complete-profile') {
            menu = (
                <MainMenuComponent
                    roles={this.state.roles}
                    userRole={this.state.user.id_role}
                    onOptionClick={this.handleMenuClick}
                    onLogoutClick={this.handleLogoutClick}
                    notifications={this.state.notifications}
                    onNotificationCLick={this.handleNotificationCLick}
                    nbNewNotifications={this.state.nbNewNotifications}
                    showNewNotificationsComponent={this.state.nbNewNotifications}
                />
            )
        }
        return menu
    }

    displayBurguerMenu () {
        let menu = ''
        if (this.state.pageToRender !== 'connection' && this.state.pageToRender !== 'complete-profile') {
            menu = <div className='burguer-menu' />
        }

        return menu
    }

    render () {
        return (
            <div>
                {this.displayConnectionContainer()}
                <div className='app-container'>
                    {/* {this.displayBurguerMenu()} */}
                    {this.displayMainMenu()}
                    {this.pageToRender()}
                </div>
            </div>
        )
    }
}

export default MainContainer
