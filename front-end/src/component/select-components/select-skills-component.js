import React from 'react'
import Select from 'react-select'

function makeSelectOptions (skills) {
    const options = []
    skills.forEach(skill => {
        const op = { value: skill.id, label: skill.skill_name }
        options.push(op)
    })
    return options
}

function makeSelectDefaultOptions (skills) {
    const options = []
    skills.forEach(skill => {
        const op = { value: skill.id_skill, label: skill.skill_name }
        options.push(op)
    })
    return options
}

const SelectSkillsComponent = ({ skills, defaultSkills, onSkillsSelectChange }) => (
    <div className='user-modify-form-input'>
        <label htmlFor='skills'>Compétences</label>
        <Select
            name='skills'
            className='user-modify-form-select'
            isMulti
            closeMenuOnSelect={false}
            options={makeSelectOptions(skills)}
            defaultValue={makeSelectDefaultOptions(defaultSkills)}
            onChange={onSkillsSelectChange}
            placeholder='Choisir les compétences...'
            isSearchable
        />
    </div>
)

export default SelectSkillsComponent
