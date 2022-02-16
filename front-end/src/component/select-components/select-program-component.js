import React from 'react'
import Select from 'react-select'

function makeSelectOptions (programs) {
    const options = []
    programs.forEach(program => {
        const op = { value: program.id, label: program.program }
        options.push(op)
    })
    return options
}

const SelectProgramComponent = ({ programs, defaultProgram }) => (
    <div className='user-modify-form-input'>
        <label htmlFor='programs'>Formation suivi</label>
        <Select
            name='programs'
            className='user-modify-form-select'
            options={makeSelectOptions(programs)}
            defaultValue={Object.entries(defaultProgram).length === 0 ? makeSelectOptions(programs)[0] : { value: defaultProgram.id, label: defaultProgram.program }}
            isSearchable
            placeholder='Choisir un programme...'
        />
    </div>
)

export default SelectProgramComponent
