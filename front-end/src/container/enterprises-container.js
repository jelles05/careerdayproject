'use strict'

import React, { Component } from 'react'
import EnterpriseDetailsComponent from '../component/enterprise-details-component'
import EnterpriseListComponent from '../component/enterprise-list-component'
import EnterpriseDetailsModifyComponent from '../component/enterprise-details-modify-component'
import CareerDayData from '../service/career-day-data'
import SearchBarComponent from '../component/search-bar-component'
import EnterpriseAddComponent from '../component/enterprise-add-component'
import UserDetailsContainer from '../container/user-details-container'
import UserCreationContainer from './user-creation-container'

class EnterprisesContainer extends Component {
    constructor (props) {
        super(props)

        this.displayType = {
            list: 1,
            details: 2,
            modify: 3,
            add: 4,
            employee_detail: 5,
            searchResult: 6,
            addEmployee: 7
        }

        this.state = {
            title: '',
            enterprises: [],
            displayType: this.displayType.list,
            currentEnterprise: '',
            user: this.props.user,
            employees: [],
            employee: null,
            videoURL: '',
            currentCareerDay: {},
            searchEnterprises: []
        }

        this.handleDetailsClick = this.handleDetailsClick.bind(this)
        this.handleModifyFormClicked = this.handleModifyFormClicked.bind(this)
        this.handleSubmitModifyForm = this.handleSubmitModifyForm.bind(this)
        this.showAddButton = this.showAddButton.bind(this)
        this.handleAddButton = this.handleAddButton.bind(this)
        this.handleAddSubmit = this.handleAddSubmit.bind(this)
        this.handleReturnButton = this.handleReturnButton.bind(this)
        this.handleShowEmployeeDetails = this.handleShowEmployeeDetails.bind(this)
        this.handleChangeFile = this.handleChangeFile.bind(this)
        this.getSignedRequest = this.getSignedRequest.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
        this.handleChangeVideo = this.handleChangeVideo.bind(this)
        this.handleDeleteButton = this.handleDeleteButton.bind(this)
        this.handleSearchBarInput = this.handleSearchBarInput.bind(this)
        this.handleViewAllClick = this.handleViewAllClick.bind(this)
        this.handleReturnDetailsButton = this.handleReturnDetailsButton.bind(this)
        this.handleAddEmployeeButtonClick = this.handleAddEmployeeButtonClick.bind(this)
        this.handleCreateEmployeeReturn = this.handleCreateEmployeeReturn.bind(this)
    }

    handleDetailsClick (enterprise) {
        CareerDayData.getAllEmployeesByEnterpriseId(enterprise.id, (result) => {
            if (result.data.data) {
                this.setState({ employees: result.data.data })
            } else {
                this.setState({ employees: [] })
            }
        })
        this.showDetails(enterprise)
    }

    showAddButton () {
        let content = ''
        if (this.state.user.id_role === this.props.roles.Admin) {
            content = (
                <div>
                    <button className='s-button' data-toggle='modal' data-target='#exampleModalCenter' onClick={this.handleAddButton}>Ajouter Entreprise</button>

                </div>

            )
        }
        return content
    }

    handleAddButton () {
        this.setState({ displayType: this.displayType.add })
    }

    handleSubmitModifyForm (e) {
        e.preventDefault()
        const t = e.target.elements
        const enterprise = {
            id: t.enterpriseId.value,
            name: t.enterpriseName.value,
            description: t.enterpriseDescription.value,
            mission: t.enterpriseMission.value,
            employe_target: t.enterpriseTarget.value,
            video_url: this.state.currentEnterprise.video_url,
            room: t.enterpriseRoom.value,
            logo_url: this.state.currentEnterprise.logo_url
        }
        this.setState({ currentEnterprise: enterprise })
        CareerDayData.updateEnterprise(enterprise, (result) => {
            this.setState({ displayType: this.displayType.details })
        })
    }

    showDetails (enterprise) {
        this.setState({ displayType: this.displayType.details })
        this.setState({ currentEnterprise: enterprise })
    }

    componentDidMount () {
        // SET TITLE
        this.setState({ title: 'Liste Entreprises' })
        // SET MENU AND DISPLAY

        // GET ALL ENTERPRISES
        CareerDayData.getActiveCareerDay((resultCareerDay) => {
            if (resultCareerDay.data.data) {
                this.setState({ currentCareerDay: resultCareerDay.data.data[0] })
            } else {
                this.setState({ currentCareerDay: {} })
            }
            if (this.props.user.id_role === this.props.roles.Employee || this.props.user.id_role === this.props.roles.Employer) {
            // GET L'ID DE L'EMPLOYEE ET L'ID DE L'ENTREPRISE
            // AVEC L'ID DE L'ENTREPRISE GET L'ENTREPRISE
                CareerDayData.getEmployeeById(this.props.user.id, (result) => {
                    CareerDayData.getEnterpriseById(result.data.data[0].id_enterprise, (r) => {
                        this.setState({ currentEnterprise: r.data.data[0] })
                        CareerDayData.getAllEmployeesByEnterpriseId(this.state.currentEnterprise.id, (resultEmployees) => {
                            if (resultEmployees.data.data) {
                                this.setState({ employees: resultEmployees.data.data })
                            } else {
                                this.setState({ employees: [] })
                            }
                        })
                    })
                }
                )
                // SET L'AFFICHAGE POUR JUSTE VOIR LES DETAILS ET PAS LA LISTE
                this.setState({ displayType: this.displayType.details })
            } else {
                if (this.props.user.id_role === this.props.roles.Student) {
                // IF USER IS STUDENT GET ONLY ACTIVE ENTERPRISES

                    CareerDayData.getEnterprisesByCareerDayId({ id: resultCareerDay.data.data[0].id }, (resultEnterprises) => {
                        if (resultEnterprises.data.data) {
                            this.setState({ enterprises: resultEnterprises.data.data })
                        } else {
                            this.setState({ enterprises: [] })
                        }
                    })
                } else {
                // IF USER IS ADMIN GET ALL ENTERPRISES
                    CareerDayData.getAllEnterprises((result) => this.setState({ enterprises: result.data.data }))
                }
            }
        })
    }

    handleModifyFormClicked () {
        this.setState({ displayType: this.displayType.modify })
    }

    handleAddSubmit (e) {
        e.preventDefault()
        const t = e.target.elements
        const enterprise = {
            name: t.enterpriseName.value,
            description: t.enterpriseDescription.value,
            mission: null,
            employe_target: null,
            video_url: null,
            room: 0,
            logo_url: 'defaultEnterprise.png'
        }
        CareerDayData.addEnterprise(enterprise, (result) => {
            CareerDayData.getAllEnterprises((r) => {
                this.setState({
                    displayType: this.displayType.list,
                    enterprises: r.data.data
                })
            })
        })
    }

    updateEnterprisesList () {
        if (this.props.user.id_role === this.props.roles.Student) {
            // IF USER IS STUDENT GET ONLY ACTIVE ENTERPRISES
            CareerDayData.getEnterprisesByCareerDayId({ id: this.state.currentCareerDay.id }, (resultEnterprises) => {
                this.setState({ enterprises: resultEnterprises.data.data })
            })
        } else {
            // IF USER IS ADMIN GET ALL ENTERPRISES
            CareerDayData.getAllEnterprises((result) => this.setState({ enterprises: result.data.data }))
        }
    }

    handleReturnButton () {
        if (this.state.user.id_role === this.props.roles.Admin || this.state.user.id_role === this.props.roles.Student) {
            this.updateEnterprisesList()
            this.setState({ displayType: this.displayType.list })
        } else {
            this.setState({ displayType: this.displayType.details })
        }
    }

    handleReturnDetailsButton () {
        this.setState({ displayType: this.displayType.details })
    }

    handleDeleteButton () {
        CareerDayData.deleteEnterpriseById(this.state.currentEnterprise.id, (result) => {
            this.updateEnterprisesList()
            this.setState({ displayType: this.displayType.list })
        })
    }

    handleShowEmployeeDetails (employee) {
        return () => this.setState({ employee: employee, displayType: this.displayType.employee_detail })
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

    handleChangeVideo (e) {
        const files = e.target.files
        const file = files[0]
        if (file === null) {
            return alert('No file selected.')
        } else if (file.type !== 'video/mp4') {
            return alert('Wrong file type')
        }
        this.getSignedRequest(file)
    }

    getSignedRequest (file) {
        const xhr = new XMLHttpRequest()
        let name = ''
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
            name = 'ENT' + this.state.currentEnterprise.id + file.name
            const enterprise = this.state.currentEnterprise
            enterprise.logo_url = name
            this.setState({ currentEnterprise: enterprise })
        } else {
            name = 'VID' + this.state.currentEnterprise.id + file.name
            const enterprise = this.state.currentEnterprise
            enterprise.video_url = name
            this.setState({ currentEnterprise: enterprise })
        }
        encodeURIComponent(file.name)
        encodeURIComponent(file.type)
        xhr.open('GET', `https://aqueous-temple-81741.herokuapp.com/sign-s3?file-name=${name}&file-type=${file.type}&id=${this.state.currentEnterprise.id}`)
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
                if (xhr.status === 200) {
                    if (file.type === 'image/png' || file.type === 'image/jpeg') {
                        document.getElementById('preview').src = url
                    }
                    // else {
                    //    document.getElementById('previewVideo').src = url
                    // }

                    // document.getElementById('avatar-url').value = url
                } else {
                    alert('Could not upload file.')
                }
            }
        }
        xhr.send(file)
    }

    handleSearchBarInput (event) {
        const searchEnterprises = this.state.enterprises.filter(ent => ent.name.toLowerCase().includes(event.target.value.toLowerCase()))
        this.setState({ searchEnterprises: searchEnterprises, displayType: this.displayType.searchResult })
    }

    handleViewAllClick () {
        this.setState({ displayType: this.displayType.list })
    }

    handleAddEmployeeButtonClick () {
        this.setState({ displayType: this.displayType.addEmployee })
    }

    handleCreateEmployeeReturn () {
        this.handleDetailsClick(this.state.currentEnterprise)
    }

    display (displayType) {
        let display
        switch (displayType) {
        case this.displayType.list:
        case this.displayType.searchResult:
            display = (
                <div>
                    <h1 className='list-title'>{this.state.title}</h1>
                    <div>
                        <SearchBarComponent
                            onSearchBarInput={this.handleSearchBarInput}
                            onViewAllClick={this.handleViewAllClick}
                        />
                    </div>
                    {this.showAddButton()}
                    <EnterpriseListComponent
                        enterprises={displayType === this.displayType.list ? this.state.enterprises : this.state.searchEnterprises}
                        onHandleDetailsClick={this.handleDetailsClick}
                        showImage
                        showReturnButton={this.showReturnButton}
                    />
                </div>
            )
            break
        case this.displayType.details:
            display = (
                <div>
                    <EnterpriseDetailsComponent
                        onFileChange={this.handleChangeFile}
                        enterprise={this.state.currentEnterprise}
                        user={this.props.user} roles={this.props.roles}
                        onHandleModifyFormClicked={this.handleModifyFormClicked}
                        onHandleReturnButton={this.handleReturnButton}
                        employees={this.props.user.id_role === this.props.roles.Admin ? this.state.employees : this.state.employees.filter(e => e.id_role !== this.props.roles.Employer)}
                        onDetailsEmployeeClick={this.handleShowEmployeeDetails}
                        onHandleDeleteButton={this.handleDeleteButton}
                        onAddEmployeeButtonClick={this.handleAddEmployeeButtonClick}
                    />
                </div>
            )
            break
        case this.displayType.modify:
            display = (
                <div>
                    <EnterpriseDetailsModifyComponent
                        enterprise={this.state.currentEnterprise}
                        user={this.props.user}
                        roles={this.props.roles}
                        onSubmit={this.handleSubmitModifyForm}
                        onFileChange={this.handleChangeVideo}
                    />
                </div>
            )
            break
        case this.displayType.add:
            display = (
                <div>
                    <EnterpriseAddComponent
                        onSubmit={this.handleAddSubmit}
                        onHandleReturnButton={this.handleReturnButton}
                    />
                </div>
            )
            break

        case this.displayType.employee_detail:
            display = (
                <div>
                    <UserDetailsContainer
                        user={this.state.employee}
                        roles={this.props.roles}
                        pageOrigin='enterprise'
                        userRole={this.props.user.id_role}
                        onReturnBtnClick={this.handleReturnDetailsButton}
                        activeCareerDay={this.state.currentCareerDay}
                    />
                </div>
            )
            break
        case this.displayType.addEmployee:
            display = (
                <UserCreationContainer
                    userRole={this.props.user.id_role}
                    roles={this.props.roles}
                    pageOrigin='enterprise'
                    onReturn={this.handleCreateEmployeeReturn}
                    loginUser={this.props.user}
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

export default EnterprisesContainer
