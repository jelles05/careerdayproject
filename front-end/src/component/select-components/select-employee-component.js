import React from 'react'
import Select from 'react-select'

function makeSelectOptions (employees, roles) {
    const options = []
    if (typeof employees === 'undefined') {
        alert('Cette entreprise n\'a pas d\'employés enregistrés')
    } else {
        employees.forEach(employee => {
            if (employee.id_role !== roles.Employer) {
                const op = { value: employee.id, label: employee.name + ' ' + employee.last_name }
                options.push(op)
            }
        })
    }
    return options
}

function displayOkButton (onOkClick) {
    let button
    if (onOkClick === null) {
        button = ''
    } else {
        button = (
            <button className='s-modify-button choose-employee-btn' onClick={onOkClick}>
                Ok
            </button>
        )
    }
    return button
}

const SelectEmployeeComponent = ({ employees, roles, onEmployeeSelectChange, defaultEmployeeId, defaultEmployeeName, onOkClick }) => (
    <div className='user-modify-form-input'>
        <label htmlFor='employees'>Sélectionner un employé pour le meeting:</label>
        <Select
            name='employees'
            className='user-modify-form-select'
            options={makeSelectOptions(employees, roles)}
            isSearchable
            onChange={onEmployeeSelectChange}
            placeholder='Choisir un employé'
            defaultValue={typeof defaultEmployeeName === 'undefined' ? 'Choisir un employé' : { value: defaultEmployeeId, label: defaultEmployeeName }}
        />
        {displayOkButton(onOkClick)}
    </div>
)

export default SelectEmployeeComponent
