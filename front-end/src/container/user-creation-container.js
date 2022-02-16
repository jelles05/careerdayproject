'use strict'

import React, { Component } from 'react'
import CareerDayData from 'service/career-day-data'
import SelectRoleComponent from '../component/select-components/select-role-component'
import SelectEnterpriseComponent from '../component/select-components/select-enterprise-component'
import SelectProgramComponent from '../component/select-components/select-program-component'
import SelectSkillsComponent from '../component/select-components/select-skills-component'
import SelectLanguagesComponent from '../component/select-components/select-languages-component'
import SelectProvinceComponent from '../component/select-components/select-province-component'
import SelectWorkComponent from '../component/select-components/select-work-component'

class UserCreationContainer extends Component {
    constructor (props) {
        super(props)

        this.state = {
            pageOrigin: '',
            userRole: 0,
            loginUser: {},
            roles: {},
            title: '',
            enterprises: [],
            skills: [],
            languages: [],
            programs: [],
            provinces: [],
            selectedRole: {},
            selectedEnterprise: {},
            selectedSkills: [],
            selectedLanguages: [],
            errorInfoAccount: '',
            errorInfoProfile: '',
            currentEnterprise: {}
        }

        this.handleEnterpriseSelectChange = this.handleEnterpriseSelectChange.bind(this)
        this.handleRoleSelectChange = this.handleRoleSelectChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleSkillsSelectChange = this.handleSkillsSelectChange.bind(this)
        this.handleLanguagesSelectChange = this.handleLanguagesSelectChange.bind(this)
    }

    componentDidMount () {
        this.setState({ userRole: this.props.userRole, loginUser: this.props.loginUser, roles: this.props.roles, pageOrigin: this.props.pageOrigin })
        // SET TITLE
        if (this.props.userRole === this.props.roles.Admin) {
            this.setState({ title: 'Ajouter Un Utilisateur' })
        } else if (this.props.userRole === this.props.roles.Employer) {
            this.setState({ title: 'Ajouter Un Employé' })
        } else if (this.props.userRole === this.props.roles.Student) {
            this.setState({ title: 'Complétez Votre Profil' })
        }
        // GET ALL ENTERPRISES
        CareerDayData.getAllEnterprises((resultEnterprises) => {
            this.setState({ enterprises: resultEnterprises.data.data })
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
                            // IF LOGIN USER IS EMPLOYER GET ENTERPRISE
                            if (this.props.userRole === this.props.roles.Employer) {
                                CareerDayData.getEmployeeById(this.props.loginUser.id, (resultEmployee) => {
                                    CareerDayData.getEnterpriseById(resultEmployee.data.data[0].id_enterprise, (resultEnterprise) => {
                                        this.setState({ currentEnterprise: resultEnterprise.data.data[0] })
                                    })
                                })
                            }
                        })
                    })
                })
            })
        })
    }

    handleEnterpriseSelectChange = (enterprise) => {
        this.setState({ selectedEnterprise: enterprise })
    }

    displayEnterpriseFormField () {
        let field = ''
        if (this.state.pageOrigin === 'users' && (this.state.selectedRole.value === 3 || this.state.selectedRole.value === 4)) {
            field = <SelectEnterpriseComponent enterprises={this.state.enterprises} onEnterpriseSelectChange={this.handleEnterpriseSelectChange} />
        }
        return field
    }

    handleRoleSelectChange = (role) => {
        this.setState({ selectedRole: role })
    }

    displayPersonalInfoFields () {
        let fields = ''
        let selectRole = ''
        if (this.props.userRole === this.props.roles.Admin) {
            selectRole = <SelectRoleComponent roles={this.state.roles} onRoleSelectChange={this.handleRoleSelectChange} />
        }
        if (this.state.pageOrigin !== 'sign-up') {
            fields = (
                <div>
                    <legend className='text-center title-details'>Informations sur le compte</legend>
                    {this.displayError(this.state.errorInfoAccount)}
                    <div className='user-modify-form-input-container'>
                        {selectRole}
                        <div className='user-modify-form-input'>
                            <label htmlFor='lastName'>Nom</label>
                            <input type='text' id='lastName' name='lastName' maxLength='30' required />
                        </div>
                        <div className='user-modify-form-input'>
                            <label htmlFor='name'>Prénom</label>
                            <input type='text' id='name' name='name' maxLength='30' required />
                        </div>
                        <div className='user-modify-form-input'>
                            <label htmlFor='email'>Courriel</label>
                            <input type='email' id='email' name='email' maxLength='100' required />
                        </div>
                        <div className='user-modify-form-input'>
                            <label htmlFor='password'>Mot de passe</label>
                            <input type='password' id='password' name='password' maxLength='30' required />
                        </div>
                        {this.displayEnterpriseFormField()}
                    </div>
                </div>
            )
        }
        return fields
    }

    handleSkillsSelectChange = (skills) => {
        this.setState({ selectedSkills: skills })
    }

    handleLanguagesSelectChange = (languages) => {
        this.setState({ selectedLanguages: languages })
    }

    displayStudentInfoFields () {
        let fields = ''
        if (this.state.pageOrigin === 'sign-up' || this.state.selectedRole.value === this.state.roles.Student) {
            fields = (
                <div>
                    <legend className='text-center title-details'>Informations sur le profil</legend>
                    {this.displayError(this.state.errorInfoProfile)}
                    <div className='user-modify-form-input-container'>
                        <SelectProgramComponent programs={this.state.programs} defaultProgram={{}} />
                        <SelectSkillsComponent skills={this.state.skills} defaultSkills={[]} onSkillsSelectChange={this.handleSkillsSelectChange} />
                        <SelectLanguagesComponent languages={this.state.languages} defaultLanguages={[]} onLanguagesSelectChange={this.handleLanguagesSelectChange} />
                        <SelectProvinceComponent provinces={this.state.provinces} defaultProvince={{}} />
                        <SelectWorkComponent defaultChoice />
                        <div className='user-modify-form-input'>
                            <label htmlFor='workStartDate'>Date de fin des études</label>
                            <input type='date' id='workStartDate' name='workStartDate' required />
                        </div>
                        <div className='user-modify-form-input'>
                            <label htmlFor='bio'>Biographie</label>
                            <textarea className='user-modify-bio' id='bio' name='bio' required placeholder='Écrivez votre biographie ici' />
                        </div>
                    </div>
                </div>
            )
        }
        return fields
    }

    displayError (error) {
        let alert = ''
        if (error !== '') {
            alert = <div className='alert alert-danger'> {error} </div>
        }
        return alert
    }

    createEmployeeOrEmployer (role, email, password, lastName, name, idEnterprise) {
        const newEmployeeUser = {
            email: email,
            password: password,
            id_role: role,
            last_name: lastName,
            name: name
        }
        // ADD USER
        CareerDayData.addUser(newEmployeeUser,
            (userAdd) => {
                console.log(userAdd)
                // GET USER ID
                CareerDayData.login({ email: email, password: password }, (logUser) => {
                    console.log(logUser)
                    // ADD EMPLOYEE
                    CareerDayData.addEmployee({ id_user: logUser.data.data[0].id, id_enterprise: idEnterprise }, (employeeAdd) => {
                        console.log(employeeAdd)
                        this.props.onReturn()
                    })
                })
            },
            () => {
                this.setState({ errorInfoAccount: ' * Cet email est déjà enregistré ' })
            }
        )
    }

    createStudent (name, lastName, email, password, idProgram, idProvince, workFromHome, workStartDate, bio) {
        const newStudentUser = {
            email: email,
            password: password,
            id_role: this.state.roles.Student,
            last_name: lastName,
            name: name
        }
        const newStudentCriteria = {
            id_program: parseInt(idProgram),
            id_province: parseInt(idProvince),
            work_from_home: (workFromHome === '1'),
            work_start_date: workStartDate
        }
        const newStudentData = {
            id_user: 0,
            id_criteria: 0,
            biography: bio,
            profile_image_url: null
        }
        const createStudentInfo = (userId) => {
            // ADD STUDENT CRITERIA
            CareerDayData.addCriteria(newStudentCriteria, (addCrit) => {
                console.log(addCrit)
                newStudentData.id_user = userId
                newStudentData.id_criteria = addCrit.data.data
                // ADD STUDENT DATA
                CareerDayData.addStudent(newStudentData, (addStudent) => {
                    console.log(addStudent)
                    // ADD STUDENT LANGUAGES
                    const languagesIds = []
                    this.state.selectedLanguages.forEach(lang => {
                        languagesIds.push(lang.value)
                    })
                    CareerDayData.addUserLanguages(addCrit.data.data, languagesIds, (...addLang) => {
                        console.log(addLang)
                        // ADD STUDENT SKILLS
                        const skillsIds = []
                        this.state.selectedSkills.forEach(skill => {
                            skillsIds.push(skill.value)
                        })
                        CareerDayData.addUserSkills(addCrit.data.data, skillsIds, (...addSkills) => {
                            console.log(addSkills)
                            this.props.onReturn()
                        })
                    })
                })
            })
        }
        if (this.state.pageOrigin === 'sign-up') {
            // GET USER FROM STATE
            createStudentInfo(this.state.loginUser.id)
        } else {
            // ADD USER
            CareerDayData.addUser(newStudentUser,
                (userAdd) => {
                    console.log(userAdd)
                    // GET USER ID
                    CareerDayData.login({ email: email, password: password }, (logUser) => {
                        console.log(logUser)
                        createStudentInfo(logUser.data.data[0].id)
                    })
                },
                () => {
                    this.setState({ errorInfoAccount: ' * Cet email est déjà enregistré ' })
                }
            )
        }
    }

    handleFormSubmit (event) {
        event.preventDefault()
        const formFields = event.target.elements
        let errorInfoAccount = ''
        let errorInfoProfile = ''
        if (this.state.userRole === this.state.roles.Admin && Object.entries(this.state.selectedRole).length === 0) {
            errorInfoAccount += '* Veuillez sélectionner un rôle '
        }
        if (this.state.userRole === this.state.roles.Admin && this.state.selectedRole.value !== this.state.roles.Student && Object.entries(this.state.selectedEnterprise).length === 0) {
            errorInfoAccount += '* Veuillez choisir une entreprise '
        }
        if ((this.state.pageOrigin === 'sign-up' || this.state.selectedRole.value === this.state.roles.Student) && this.state.selectedSkills.length === 0) {
            errorInfoProfile = '* Veuillez choisir au moins une compétence '
        }
        if ((this.state.pageOrigin === 'sign-up' || this.state.selectedRole.value === this.state.roles.Student) && this.state.selectedLanguages.length === 0) {
            errorInfoProfile = '* Veuillez choisir au moins un langage '
        }
        // CHECK IF THERE ARE ERRORS
        if (errorInfoAccount !== '' || errorInfoProfile !== '') {
            // SET ERROR MESSAGES
            this.setState({ errorInfoAccount: errorInfoAccount, errorInfoProfile: errorInfoProfile })
        } else {
            this.setState({ errorInfoAccount: '', errorInfoProfile: '' })
            // ADD USER TO DB
            if (this.state.userRole === this.state.roles.Employer) {
                // IF THE CURRENT USER IS AN EMPLOYER
                // CREATE EMPLOYEE
                this.createEmployeeOrEmployer(this.state.roles.Employee, formFields.email.value, formFields.password.value, formFields.lastName.value, formFields.name.value, this.state.currentEnterprise.id)
            } else if (this.state.userRole === this.state.roles.Admin) {
                // IF THE CURRENT USER IS THE ADMIN
                if (this.state.selectedRole.value === this.state.roles.Employee || this.state.selectedRole.value === this.state.roles.Employer) {
                    // CREATE EMPLOYEE OR EMPLOYER
                    this.createEmployeeOrEmployer(this.state.selectedRole.value, formFields.email.value, formFields.password.value, formFields.lastName.value, formFields.name.value, parseInt(formFields.enterprises.value))
                } else {
                    // CREATE A STUDENT
                    this.createStudent(formFields.name.value, formFields.lastName.value, formFields.email.value, formFields.password.value, formFields.programs.value, formFields.provinces.value, formFields.workFromHome.value, formFields.workStartDate.value, formFields.bio.value)
                }
            } else {
                // IF THE CURRENT USER IS A STUDENT CREATING THEIR ACCOUNT
                this.createStudent('none', 'none', 'none', 'none', formFields.programs.value, formFields.provinces.value, formFields.workFromHome.value, formFields.workStartDate.value, formFields.bio.value)
            }
        }
    }

    displayCancelButton () {
        let cancel = ''
        if (this.state.pageOrigin !== 'sign-up') {
            cancel = (
                <div className='cancel-button'>
                    <button className='s-modify-button' onClick={this.props.onReturn}>
                        Annuler
                    </button>
                </div>
            )
        }
        return cancel
    }

    render () {
        return (
            <div className='main-container'>
                <h1 className='list-title'>{this.state.title}</h1>
                {this.state.pageOrigin === 'sign-up' ? '' : <button className='return-btn' onClick={this.props.onReturn}>Retour</button>}
                <div className='user-modify-form'>
                    <form onSubmit={this.handleFormSubmit}>
                        {this.displayPersonalInfoFields()}
                        {this.displayStudentInfoFields()}
                        <div className='modify-button'>
                            <input className='s-modify-button' type='submit' value='Enregistrer' />
                        </div>
                    </form>
                    {this.displayCancelButton()}
                </div>
            </div>
        )
    }
}

export default UserCreationContainer
