import React from 'react'
import Select from 'react-select'

function makeSelectOptions (students) {
    const options = []
    students.forEach(student => {
        const op = { value: student.id, label: student.name + ' ' + student.last_name }
        options.push(op)
    })
    return options
}

const SelectStudentComponent = ({ students, onStudentSelectChange }) => (
    <div className='user-modify-form-input'>
        <label htmlFor='students'>Étudiants</label>
        <Select
            name='students'
            className='user-modify-form-select'
            options={makeSelectOptions(students)}
            isSearchable
            onChange={onStudentSelectChange}
            placeholder='Choisir un étudiant'
        />
    </div>
)

export default SelectStudentComponent
