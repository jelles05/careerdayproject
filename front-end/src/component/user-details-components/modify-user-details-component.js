import React from 'react'
import SelectProgramComponent from '../select-components/select-program-component'
import SelectSkillsComponent from '../select-components/select-skills-component'
import SelectLanguagesComponent from '../select-components/select-languages-component'
import SelectProvinceComponent from '../select-components/select-province-component'
import SelectWorkComponent from '../select-components/select-work-component'

function displayPasswordField (user, studentUser, roles) {
    let pw = ''
    if (user.id_role === roles.Student) {
        pw = <input type='password' id='password' name='password' maxLength='30' required defaultValue={studentUser.password} />
    } else {
        pw = <input type='password' id='password' name='password' maxLength='30' required defaultValue={user.password} />
    }
    return pw
}

function displayStudentFields (onFileChange, errorModify, user, studentUser, studentCriteria, program, programs, skills, allSkills, onSkillsSelectChange, languages, allLanguages, onLanguagesSelectChange, province, AllProvinces, roles) {
    let studentFields = ''
    if (studentUser.id_role === roles.Student) {
        studentFields = (
            <div>
                <legend className='text-center title-details'>Informations sur le profil</legend>
                {displayError(errorModify)}
                <div className='user-modify-form-input-container'>
                    <SelectProgramComponent programs={programs} defaultProgram={program} />
                    <SelectSkillsComponent skills={allSkills} defaultSkills={skills} onSkillsSelectChange={onSkillsSelectChange} />
                    <SelectLanguagesComponent languages={allLanguages} defaultLanguages={languages} onLanguagesSelectChange={onLanguagesSelectChange} />
                    <SelectProvinceComponent provinces={AllProvinces} defaultProvince={province} />
                    <SelectWorkComponent defaultChoice={studentCriteria.work_from_home} />
                    <div className='user-modify-form-input'>
                        <label htmlFor='workStartDate'>Date de fin des études</label>
                        <input type='date' id='workStartDate' name='workStartDate' required defaultValue={studentCriteria.work_start_date?.split('T')[0]} />
                    </div>
                    <div className='user-modify-form-input'>
                        <label htmlFor='bio'>Biographie</label>
                        <textarea className='user-modify-bio' id='bio' name='bio' defaultValue={user.biography} required />
                    </div>
                    <div className='user-modify-form-input'>
                        <label htmlFor='file-input'>Lien pour CV en ligne / Profil LinkedIn</label>
                        <div className='text-center'>
                            <label className='enterprise-header'>
                                <i className='fas fa-upload' />
                                <input type='file' id='file-input' name='file-input' onChange={onFileChange} hidden />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return studentFields
}

function displayError (error) {
    let alert = ''
    if (error !== '') {
        alert = <div className='alert alert-danger'> {error} </div>
    }
    return alert
}

const ModifyUserDetailsComponent = ({ onFileChange, errorModify, user, studentUser, studentCriteria, program, programs, skills, allSkills, onSkillsSelectChange, languages, allLanguages, onLanguagesSelectChange, province, allProvinces, roles, onSubmit, onCancelClick }) => (
    <div className='user-modify-form'>
        <form onSubmit={onSubmit}>
            <legend className='text-center title-details'>Informations sur le compte</legend>
            <div className='user-modify-form-input-container'>
                <div className='user-modify-form-input'>
                    <label htmlFor='lastName'>Nom</label>
                    <input type='text' id='lastName' name='lastName' maxLength='30' required defaultValue={user.last_name} />
                </div>
                <div className='user-modify-form-input'>
                    <label htmlFor='name'>Prénom</label>
                    <input type='text' id='name' name='name' maxLength='30' required defaultValue={user.name} />
                </div>
                <div className='user-modify-form-input'>
                    <label htmlFor='email'>Courriel</label>
                    <input type='email' id='email' name='email' maxLength='100' required defaultValue={user.email} />
                </div>
                <div className='user-modify-form-input'>
                    <label htmlFor='password'>Mot de passe</label>
                    {displayPasswordField(user, studentUser, roles)}
                </div>
            </div>
            {displayStudentFields(onFileChange, errorModify, user, studentUser, studentCriteria, program, programs, skills, allSkills, onSkillsSelectChange, languages, allLanguages, onLanguagesSelectChange, province, allProvinces, roles)}
            <div className='modify-button'>
                <input className='s-modify-button' type='submit' value='Sauvegarder' />
            </div>
        </form>
        <div className='cancel-button'>
            <button className='s-modify-button' onClick={onCancelClick}>
                Annuler
            </button>
        </div>
    </div>
)

export default ModifyUserDetailsComponent
