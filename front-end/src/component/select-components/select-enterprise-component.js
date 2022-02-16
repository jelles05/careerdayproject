import React from 'react'
import Select from 'react-select'

function makeSelectOptions (enterprises) {
    const options = []
    enterprises.forEach(enterprise => {
        const op = { value: enterprise.id, label: enterprise.name }
        options.push(op)
    })
    return options
}

const SelectEnterpriseComponent = ({ enterprises, onEnterpriseSelectChange }) => (
    <div className='user-modify-form-input'>
        <label htmlFor='enterprises'>Entreprise</label>
        <Select
            name='enterprises'
            className='user-modify-form-select'
            options={makeSelectOptions(enterprises)}
            isSearchable
            onChange={onEnterpriseSelectChange}
            placeholder='Choisir une entreprise'
        />
    </div>
)

export default SelectEnterpriseComponent
