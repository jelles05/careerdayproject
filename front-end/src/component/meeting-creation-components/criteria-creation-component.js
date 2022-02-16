import React from 'react'
import SelectProgramComponent from '../select-components/select-program-component'
import SelectSkillsComponent from '../select-components/select-skills-component'
import SelectLanguagesComponent from '../select-components/select-languages-component'
import SelectProvinceComponent from '../select-components/select-province-component'
import SelectWorkComponent from '../select-components/select-work-component'

function displayError (error) {
    let alert = ''
    if (error !== '') {
        alert = <div className='alert alert-danger'> {error} </div>
    }
    return alert
}

const CriteriaCreationComponent = ({ addJobError, programs, skills, languages, provinces, onSkillsSelectChange, onLanguagesSelectChange, onFormSubmit, onCancelClick }) => (
    <div className='user-modify-form'>
        <form onSubmit={onFormSubmit}>
            {displayError(addJobError)}
            <div className='user-modify-form-input-container'>
                <div className='user-modify-form-input'>
                    <label htmlFor='jobTitle'>Titre du poste</label>
                    <input type='text' id='jobTitle' name='jobTitle' required placeholder='Titre' />
                </div>
                <div className='user-modify-form-input'>
                    <label htmlFor='jobDescription'>Description du poste</label>
                    <input type='text' id='jobDescription' name='jobDescription' required placeholder='Description' />
                </div>
                <SelectProgramComponent programs={programs} defaultProgram={{}} />
                <SelectSkillsComponent skills={skills} defaultSkills={[]} onSkillsSelectChange={onSkillsSelectChange} />
                <SelectLanguagesComponent languages={languages} defaultLanguages={[]} onLanguagesSelectChange={onLanguagesSelectChange} />
                <SelectProvinceComponent provinces={provinces} defaultProvince={{}} />
                <SelectWorkComponent defaultChoice />
                <div className='user-modify-form-input'>
                    <label htmlFor='workStartDate'>Date de début de travail</label>
                    <input type='date' id='workStartDate' name='workStartDate' required />
                </div>
            </div>
            <div className='modify-button'>
                <input className='s-modify-button' type='submit' value='Enregistrer' />
            </div>
        </form>
        <div className='cancel-button'>
            <button className='s-modify-button' onClick={onCancelClick}>
                Annuler
            </button>
        </div>
    </div>
)

export default CriteriaCreationComponent
