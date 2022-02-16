import React from 'react'
import Select from 'react-select'

function makeSelectOptions (timeSlots) {
    const options = []
    timeSlots.forEach(ts => {
        const op = { value: ts, label: ts }
        options.push(op)
    })
    return options
}

const SelectFreeTimeSlotComponent = ({ timeSlots, onTimeSlotSelectChange, defaultTimeSlot }) => (
    <div className='user-modify-form-input'>
        <label htmlFor='timeSlots'>Heure du meeting, ce sont les heures disponibles:</label>
        <Select
            name='timeSlots'
            className='user-modify-form-select'
            options={makeSelectOptions(timeSlots)}
            isSearchable
            onChange={onTimeSlotSelectChange}
            placeholder='Choisir un heure'
            defaultValue={typeof defaultTimeSlot === 'undefined' ? '' : { value: defaultTimeSlot, label: defaultTimeSlot }}
        />
    </div>
)

export default SelectFreeTimeSlotComponent
