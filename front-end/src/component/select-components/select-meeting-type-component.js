import React from 'react'
import Select from 'react-select'

function makeSelectOptions (meetingTypes) {
    const options = []
    for (const [key, value] of Object.entries(meetingTypes)) {
        const op = { value: value, label: key }
        options.push(op)
    }
    return options
}

const SelectMeetingTypeComponent = ({ meetingTypes, onMeetingTypeSelectChange, defaultMeetingTypeId, defaultMeetingType }) => (
    <div className='user-modify-form-input'>
        <label htmlFor='meetingTypes'>Type de meeting</label>
        <Select
            name='meetingTypes'
            className='user-modify-form-select'
            options={makeSelectOptions(meetingTypes)}
            isSearchable
            onChange={onMeetingTypeSelectChange}
            placeholder='Choisir un type de meeting...'
            defaultValue={typeof defaultMeetingType === 'undefined' ? 'Choisir un type de meeting...' : { value: defaultMeetingTypeId, label: defaultMeetingType }}
        />
    </div>
)

export default SelectMeetingTypeComponent
