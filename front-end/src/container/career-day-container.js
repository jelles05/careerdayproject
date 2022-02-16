'use strict'

import React, { Component } from 'react'
import CareerDayAddComponent from '../component/career-day-add-component'
import CareerDayDashboardComponent from '../component/career-day-dashboard-component'
import EnterpriseListComponent from '../component/enterprise-list-component'
import CareerDayModifyComponent from '../component/career-day-modify-component'
import CareerDayData from '../service/career-day-data'
import StudentListComponent from '../component/users-list-components/student-list-component'

class CareerDayContainer extends Component {
    constructor (props) {
        super(props)

        this.state = {
            currentCareerDay: null,
            careerDayList: null,
            enterprises: null,
            is_add_page: false,
            is_modify_page: false,
            students: null

        }

        this.handleOnSelectChange = this.handleOnSelectChange.bind(this)
        this.handleActiveButtonClicked = this.handleActiveButtonClicked.bind(this)
        this.handleEnterprisesAttendanceList = this.handleEnterprisesAttendanceList.bind(this)
        this.handleAddButtonClicked = this.handleAddButtonClicked.bind(this)
        this.handleSubmitAddForm = this.handleSubmitAddForm.bind(this)
        this.handleParamsButtonClicked = this.handleParamsButtonClicked.bind(this)
        this.handleSubmitModifyForm = this.handleSubmitModifyForm.bind(this)
        this.handleUserListClicked = this.handleUserListClicked.bind(this)
        this.handleReturnButtonList = this.handleReturnButtonList.bind(this)
        this.handleReturnButtonModifications = this.handleReturnButtonModifications.bind(this)
    }

    componentDidMount () {
        CareerDayData.getAllCareerDay(
            (result) => this.setState({ careerDayList: result.data.data })
        )
    }

    handleOnSelectChange (e) {
        console.log(e.value)
        CareerDayData.getCareerDayById(e.value, (result) => {
            console.log(result.data.data[0])
            this.setState({ currentCareerDay: result.data.data[0] })
        })
    }

    handleParamsButtonClicked () {
        this.setState({ is_modify_page: true })
    }

    checkIfOtherCareerDayActive () {
        let isActive = false
        const careerDayList = this.state.careerDayList
        if (this.state.currentCareerDay.is_active === false) {
            const nouvelleList = careerDayList.filter((careerDay) => careerDay.is_active)
            console.log('Nouvelle List:', nouvelleList)
            if (nouvelleList.length !== 0) {
                isActive = true
            }
        }

        return isActive
    }

    handleActiveButtonClicked (e) {
        // Update careerDay is_active

        if (!this.checkIfOtherCareerDayActive()) {
            this.setState({
                currentCareerDay: {
                    id: this.state.currentCareerDay.id,
                    title: this.state.currentCareerDay.title,
                    date: this.state.currentCareerDay.date,
                    is_active: !(this.state.currentCareerDay.is_active),
                    time_start: this.state.currentCareerDay.time_start,
                    time_end: this.state.currentCareerDay.time_end,
                    meeting_duration: this.state.currentCareerDay.meeting_duration
                }
            })

            const date = new Date(this.state.currentCareerDay.date)

            const newCareerDay = {
                id: this.state.currentCareerDay.id,
                title: this.state.currentCareerDay.title,
                is_active: !this.state.currentCareerDay.is_active,
                day: date.getDate() + 1,
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                time_start: this.state.currentCareerDay.time_start,
                time_end: this.state.currentCareerDay.time_end,
                meeting_duration: this.state.currentCareerDay.meeting_duration
            }

            CareerDayData.updateCareerDay(newCareerDay, (result) => {
                console.log(result)
                CareerDayData.getAllCareerDay(
                    (r) => {
                        this.setState({ careerDayList: r.data.data })
                        this.props.onCareerDayChange(this.state.currentCareerDay)
                    }
                )
            })
        } else {
            alert('Il y a une autre journee carriere active pas possible de realiser l\'operation')
        }
    }

    handleEnterprisesAttendanceList (careerDay) {
        CareerDayData.getEnterprisesByCareerDayId(careerDay, (result) => {
            if (result.data.data) {
                this.setState({ enterprises: result.data.data })
            } else {
                this.setState({ enterprises: [] })
            }
        })
    }

    handleAddButtonClicked () {
        this.setState({ is_add_page: true })
    }

    handleSubmitModifyForm (e) {
        e.preventDefault()
        const t = e.target.elements

        const dateForm = new Date(t.date.value)

        const careerDay = {
            id: this.state.currentCareerDay.id,
            title: t.title.value,
            day: dateForm.getDate() + 1,
            month: dateForm.getMonth() + 1,
            year: dateForm.getFullYear(),
            is_active: this.state.currentCareerDay.is_active,
            time_start: t.time_start.value,
            time_end: t.time_end.value,
            meeting_duration: t.meeting_duration.value
        }

        const careerDayForm = {
            id: this.state.currentCareerDay.id,
            title: t.title.value,
            date: t.date.value,
            is_active: this.state.currentCareerDay.is_active,
            time_start: t.time_start.value,
            time_end: t.time_end.value,
            meeting_duration: t.meeting_duration.value
        }

        CareerDayData.updateCareerDay(careerDay, (result) => {
            console.log(result)
            this.setState({ is_modify_page: false, currentCareerDay: careerDayForm })
            CareerDayData.getAllCareerDay((r) => {
                this.setState({ careerDayList: r.data.data })
            })
        })
    }

    handleSubmitAddForm (e) {
        e.preventDefault()
        const t = e.target.elements

        const dateForm = new Date(t.date.value)

        const careerDay = {
            title: t.title.value,
            day: dateForm.getDate() + 1,
            month: dateForm.getMonth() + 1,
            year: dateForm.getFullYear(),
            is_active: false,
            time_start: t.time_start.value,
            time_end: t.time_end.value,
            meeting_duration: t.meeting_duration.value
        }

        CareerDayData.addCareerDay(careerDay, (result) => {
            console.log(result)
            this.setState({ is_add_page: false })
        })
        // console.log(careerDay)

        // CareerDayData.addCareerDay()
    }

    handleReturnButtonList () {
        this.setState({ students: null, enterprises: null })
    }

    handleReturnButtonModifications () {
        this.setState({ is_modify_page: false, is_add_page: false })
    }

    handleUserListClicked (careerDay) {
        // REMPLIR LE STATE AVEC LES ETUDIANTS DE LA JOURNEE CARRIERE COURANT
        CareerDayData.getStudentsByCareerDayId(careerDay, (result) => {
            if (result.data.data) {
                this.setState({ students: result.data.data })
            } else {
                this.setState({ students: [] })
            }
        })
    }

    render () {
        let content = ''
        if (this.state.careerDayList === null) {
            content = (
                <div className='main-container'>
                    <h1 className='list-title'>Loading...</h1>
                </div>
            )
        } else {
            if (this.state.enterprises === null && this.state.students === null) {
                content = (
                    <div className='main-container'>
                        <CareerDayDashboardComponent
                            careerDayList={this.state.careerDayList}
                            currentCareerDay={this.state.currentCareerDay}
                            onSelectChange={this.handleOnSelectChange}
                            onActiveButtonClicked={this.handleActiveButtonClicked}
                            onAttendanceListClicked={this.handleEnterprisesAttendanceList}
                            onHandleAddButtonClicked={this.handleAddButtonClicked}
                            onHandleParamsButtonClicked={this.handleParamsButtonClicked}
                            onHandleUserListClicked={this.handleUserListClicked}
                        />
                    </div>
                )
            } else if (this.state.enterprises !== null) {
                content = (
                    <div className='main-container'>

                        <h1 className='list-title'>Liste Entreprises</h1>
                        <button className='return-btn' onClick={this.handleReturnButtonList}>Retour</button>
                        <EnterpriseListComponent enterprises={this.state.enterprises} onHandleDetailsClick={null} showImage={false} />
                    </div>
                )
            } else if (this.state.students !== null) {
                content = (
                    <div className='main-container'>

                        <h1 className='list-title'>Liste Étudiants</h1>
                        <button className='return-btn' onClick={this.handleReturnButtonList}>Retour</button>
                        <StudentListComponent students={this.state.students} onDetailsClick={null} showDetailsBtn={false} />
                    </div>
                )
            }
        }

        // CHECK SI C'EST LE FORMULAIRE D'AJOUT D'UNE NOUVELLE JOURNEE CARRIERE
        if (this.state.is_add_page) {
            content = (
                <div className='main-container'>

                    <CareerDayAddComponent
                        onSubmit={this.handleSubmitAddForm}
                        onHandleReturnButton={this.handleReturnButtonModifications}
                    />

                </div>
            )
        }

        // CHECK SI C'EST LE FORMULAIRE DE MODIFICATION D'UNE JOURNEE CARRIERE
        if (this.state.is_modify_page) {
            content = (
                <div className='main-container'>
                    <CareerDayModifyComponent
                        careerDay={this.state.currentCareerDay}
                        onSubmit={this.handleSubmitModifyForm}
                        onHandleReturnButton={this.handleReturnButtonModifications}
                    />
                </div>
            )
        }
        return (
            content
        )
    }
}

export default CareerDayContainer
