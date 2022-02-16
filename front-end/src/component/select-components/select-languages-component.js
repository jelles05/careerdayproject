import React from 'react'
import Select from 'react-select'

function makeSelectOptions (languages) {
    const options = []
    languages.forEach(language => {
        const op = { value: language.id, label: language.language_name }
        options.push(op)
    })
    return options
}

function makeSelectDefaultOptions (languages) {
    const options = []
    languages.forEach(language => {
        const op = { value: language.id_language, label: language.language_name }
        options.push(op)
    })
    return options
}

const SelectLanguagesComponent = ({ languages, defaultLanguages, onLanguagesSelectChange }) => (
    <div className='user-modify-form-input'>
        <label htmlFor='languages'>Langages</label>
        <Select
            name='languages'
            className='user-modify-form-select'
            isMulti
            closeMenuOnSelect={false}
            options={makeSelectOptions(languages)}
            defaultValue={makeSelectDefaultOptions(defaultLanguages)}
            onChange={onLanguagesSelectChange}
            placeholder='Choisir des langages...'
            isSearchable
        />
    </div>
)

export default SelectLanguagesComponent
