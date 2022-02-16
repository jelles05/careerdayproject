import React from 'react'
import Select from 'react-select'

function makeSelectOptions (roles) {
    const options = []
    for (const [key, value] of Object.entries(roles)) {
        if (value !== 1) {
            const op = { value: value, label: key }
            options.push(op)
        }
    }
    return options
}

const SelectRoleComponent = ({ roles, onRoleSelectChange }) => (
    <div className='user-modify-form-input'>
        <label htmlFor='roles'>Rôle</label>
        <Select
            name='roles'
            className='user-modify-form-select'
            options={makeSelectOptions(roles)}
            isSearchable
            onChange={onRoleSelectChange}
            placeholder='Choisir un rôle...'
        />
    </div>
)

export default SelectRoleComponent
