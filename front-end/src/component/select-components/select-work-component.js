import React from 'react'
import Select from 'react-select'

function makeDefaultChoice (defaultChoice) {
    const choice = {}
    if (defaultChoice === true) {
        choice.value = 1
        choice.label = 'oui'
    } else if (defaultChoice === false) {
        choice.value = 0
        choice.label = 'non'
    }
    return choice
}

const SelectWorkComponent = ({ defaultChoice }) => (
    <div className='user-modify-form-input'>
        <label htmlFor='work-from-home'>Accepte le télétravail?</label>
        <Select
            name='workFromHome'
            className='user-modify-form-select'
            options={[{ value: 1, label: 'oui' }, { value: 0, label: 'non' }]}
            defaultValue={makeDefaultChoice(defaultChoice)}
            isSearchable
            placeholder='Choisir une option'
        />
    </div>
)

export default SelectWorkComponent
