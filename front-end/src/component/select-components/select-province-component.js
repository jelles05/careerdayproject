import React from 'react'
import Select from 'react-select'

function makeSelectOptions (provinces) {
    const options = []
    provinces.forEach(province => {
        const op = { value: province.id, label: province.name }
        options.push(op)
    })
    return options
}

const SelectProvinceComponent = ({ provinces, defaultProvince }) => (
    <div className='user-modify-form-input'>
        <label htmlFor='provinces'>Province</label>
        <Select
            name='provinces'
            className='user-modify-form-select'
            options={makeSelectOptions(provinces)}
            defaultValue={Object.entries(defaultProvince).length === 0 ? makeSelectOptions(provinces)[0] : { value: defaultProvince.id, label: defaultProvince.name }}
            isSearchable
            placeholder='Choisir une province...'
        />
    </div>
)

export default SelectProvinceComponent
