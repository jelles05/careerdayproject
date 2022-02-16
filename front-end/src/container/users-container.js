'use strict'

import React, { Component } from 'react'
import CareerDayData from 'service/career-day-data'
import StudentListComponent from 'component/users-list-components/student-list-component'
import UsersListComponent from 'component/users-list-components/users-list-component'
import SearchBarComponent from 'component/search-bar-component'
import UserDetailsContainer from 'container/user-details-container'
import UserCreationContainer from 'container/user-creation-container'

class UsersContainer extends Component {
    constructor (props) {
        super(props)

        this.state = {
            students: [],
            employers: [],
            employees: [],
            searchStudents: [],
            searchUsers: [],
            user: {},
            title: '',
            pageToDisplay: 'list',
            listToDisplay: 'students'
        }

        this.handleSearchBarInput = this.handleSearchBarInput.bind(this)
        this.handleViewAllClick = this.handleViewAllClick.bind(this)
        this.handleSelectListButtonClick = this.handleSelectListButtonClick.bind(this)
        this.handleUserDetailsClick = this.handleUserDetailsClick.bind(this)
        this.handleReturnBtnClick = this.handleReturnBtnClick.bind(this)
        this.handleAddUserClick = this.handleAddUserClick.bind(this)
    }

    componentDidMount () {
        // SET PAGE TITLE
        if (this.props.userRole === this.props.roles.Admin) {
            this.setState({ title: 'Liste Utilisateurs' })
        } else {
            this.setState({ title: 'Liste Étudiants' })
        }
        // GET EMPLOYERS LIST
        CareerDayData.getUsersByRole(this.props.roles.Employer, (res) => {
            this.setState({ employers: res.data.data })
            // GET EMPLOYEES LIST
            CareerDayData.getUsersByRole(this.props.roles.Employee, (r) => {
                this.setState({ employees: r.data.data })
                if (this.props.userRole === this.props.roles.Admin) {
                    // GET ALL STUDENTS LIST
                    CareerDayData.getAllStudents((result) => {
                        this.setState({ students: result.data.data })
                    })
                } else {
                    // GET ACTIVE STUDENTS LIST
                    CareerDayData.getStudentsByCareerDayId(this.props.activeCareerDay, (resultStudents) => {
                        if (resultStudents.data.data) {
                            this.setState({ students: resultStudents.data.data })
                        } else {
                            this.setState({ students: [] })
                        }
                    })
                }
            })
        })
    }

    // CHECK IF USER'S FULLNAME INCLUDES THE SEARCH INPUT
    // Returns bool
    filterUserFullName (user, input) {
        const fullName = user.name + ' ' + user.last_name
        return fullName.toLowerCase().includes(input.toLowerCase())
    }

    // CHECK WHICH USER'S NAME MATCHES THE SEARCH AND SAVE IT ON THE STATE
    handleSearchBarInput (userRole) {
        return (event) => {
            const studentsMatch = this.state.students.filter(student => this.filterUserFullName(student, event.target.value))
            let list = []
            if (userRole === 'admin') {
                const employersMatch = this.state.employers.filter(employer => this.filterUserFullName(employer, event.target.value))
                list = list.concat(employersMatch)
                const employeesMatch = this.state.employees.filter(employee => this.filterUserFullName(employee, event.target.value))
                list = list.concat(employeesMatch)
            }
            this.setState({ searchStudents: studentsMatch, searchUsers: list, listToDisplay: 'search' })
        }
    }

    // DISPLAY ALL THE USERS
    handleViewAllClick (userRole) {
        return () => {
            if (userRole === 'admin') {
                this.setState({ listToDisplay: 'all' })
            } else {
                this.setState({ listToDisplay: 'students' })
            }
        }
    }

    // SAVE ON THE STATE THE USER LIST TO BE DISPLAYED
    handleSelectListButtonClick (list) {
        return () => {
            this.setState({ listToDisplay: list })
        }
    }

    // TO SEE AN USER'S DETAILS
    handleUserDetailsClick (user) {
        return () => {
            this.setState({ pageToDisplay: 'details', user: user })
        }
    }

    // RETURN TO AND RECHARGE USERS' LISTS
    handleReturnBtnClick () {
        // GET EMPLOYERS LIST
        CareerDayData.getUsersByRole(this.props.roles.Employer, (res) => {
            this.setState({ employers: res.data.data })
            // GET EMPLOYEES LIST
            CareerDayData.getUsersByRole(this.props.roles.Employee, (r) => {
                this.setState({ employees: r.data.data, pageToDisplay: 'list' })
                if (this.props.userRole === this.props.roles.Admin) {
                    // GET ALL STUDENTS LIST
                    CareerDayData.getAllStudents((result) => {
                        this.setState({ students: result.data.data })
                    })
                } else {
                    // GET ACTIVE STUDENTS LIST
                    CareerDayData.getStudentsByCareerDayId(this.props.activeCareerDay, (resultStudents) => {
                        if (resultStudents.data.data) {
                            this.setState({ students: resultStudents.data.data })
                        } else {
                            this.setState({ students: [] })
                        }
                    })
                }
            })
        })
    }

    // GO TO ADD USER FORM
    handleAddUserClick () {
        this.setState({ pageToDisplay: 'add' })
    }

    // CHECK THE USER LIST(S) TO DISPLAY
    checkListToDisplay () {
        let list = ''
        switch (this.state.listToDisplay) {
        case 'students':
            list = <StudentListComponent students={this.state.students} onDetailsClick={this.handleUserDetailsClick} showDetailsBtn />
            break
        case 'employers':
            list = <UsersListComponent users={this.state.employers} onDetailsClick={this.handleUserDetailsClick} />
            break
        case 'employees':
            list = <UsersListComponent users={this.state.employees} onDetailsClick={this.handleUserDetailsClick} />
            break
        case 'all':
            list = (
                <div>
                    {this.state.students.length !== 0 ? <StudentListComponent students={this.state.students} onDetailsClick={this.handleUserDetailsClick} showDetailsBtn /> : ''}
                    {this.state.employers.length !== 0 ? <UsersListComponent users={this.state.employers} onDetailsClick={this.handleUserDetailsClick} /> : ''}
                    {this.state.employees.length !== 0 ? <UsersListComponent users={this.state.employees} onDetailsClick={this.handleUserDetailsClick} /> : ''}
                </div>
            )
            break
        case 'search':
            list = (
                <div>
                    {this.state.searchStudents.length !== 0 ? <StudentListComponent students={this.state.searchStudents} onDetailsClick={this.handleUserDetailsClick} showDetailsBtn /> : ''}
                    {this.props.userRole === this.props.roles.Admin && this.state.searchUsers.length !== 0 ? <UsersListComponent users={this.state.searchUsers} onDetailsClick={this.handleUserDetailsClick} /> : ''}
                </div>
            )
            break
        }
        return list
    }

    // DISPLAY USERS LIST OR USER DETAILS
    checkPageToDisplay () {
        let display
        const list = this.checkListToDisplay()
        switch (this.state.pageToDisplay) {
        case 'list':
            if (this.props.userRole === this.props.roles.Admin) {
                // IF IT'S ADMIN, DISPLAY ALL LISTS
                display = (
                    <div>
                        <h1 className='list-title'>{this.state.title}</h1>
                        <div>
                            <div className='admin-user-bar'>
                                <SearchBarComponent onSearchBarInput={this.handleSearchBarInput('admin')} onViewAllClick={this.handleViewAllClick('admin')} />
                                <div>
                                    <button onClick={this.handleAddUserClick} className='s-add-user-button'>Ajouter un utilisateur</button>
                                </div>
                            </div>
                            <div className='admin-users-btns d-flex justify-content-center'>
                                <button onClick={this.handleSelectListButtonClick('students')}>Étudiants</button>
                                <button onClick={this.handleSelectListButtonClick('employers')}>Employeurs</button>
                                <button onClick={this.handleSelectListButtonClick('employees')}>Employés</button>
                            </div>
                            {list}
                        </div>
                    </div>
                )
            } else {
                // IF IT'S NOT ADMIN, DISPLAY STUDENT LIST ONLY
                display = (
                    <div>
                        <h1 className='list-title'>{this.state.title}</h1>
                        <div>
                            <SearchBarComponent onSearchBarInput={this.handleSearchBarInput('other')} onViewAllClick={this.handleViewAllClick('other')} />
                        </div>
                        {list}
                    </div>
                )
            }
            break
        case 'details':
            display = <UserDetailsContainer user={this.state.user} roles={this.props.roles} pageOrigin='users' userRole={this.props.userRole} onReturnBtnClick={this.handleReturnBtnClick} activeCareerDay={this.props.activeCareerDay} />
            break
        case 'add':
            display = <UserCreationContainer userRole={this.props.userRole} roles={this.props.roles} pageOrigin='users' onReturn={this.handleReturnBtnClick} loginUser={this.props.loginUser} />
            break
        }
        return display
    }

    render () {
        return (
            <div className='main-container'>
                {this.checkPageToDisplay()}
            </div>
        )
    }
}

export default UsersContainer
