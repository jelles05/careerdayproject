import React from 'react'
import SelectFreeTimeSlotComponent from '../select-components/select-free-time-slot-component'
import SelectMeetingTypeComponent from '../select-components/select-meeting-type-component'
import SelectEmployeeComponent from '../select-components/select-employee-component'
import AvailableTimeSlots from '../../service/AvailableTimeSlots'

function displaySelectFreeTimeSlots (currentCareerDay, studentTimeSlots, employeeTimeSlots, onTimeSlotSelectChange, selectedMeetingTimeSlot) {
    const availableTimeSlots = new AvailableTimeSlots()
    const select = (
        <SelectFreeTimeSlotComponent
            timeSlots={availableTimeSlots.getAvailableTimeSlots(currentCareerDay, studentTimeSlots, employeeTimeSlots)}
            onTimeSlotSelectChange={onTimeSlotSelectChange}
            defaultTimeSlot={selectedMeetingTimeSlot}
        />
    )
    return select
}

function showEmployeeSelect (user, roles, enterpriseEmployees, onEmployeeSelectChange, meeting, employeeFullName) {
    let select = ''
    if (user.id_role !== roles.Employee) {
        select = (
            <SelectEmployeeComponent
                employees={enterpriseEmployees}
                roles={roles}
                onEmployeeSelectChange={onEmployeeSelectChange}
                defaultEmployeeId={meeting.id_employee}
                defaultEmployeeName={employeeFullName}
                onOkClick={null}
            />
        )
    }
    return select
}

const ModifyMeetingComponent = ({
    user,
    roles,
    meeting,
    employeeFullName,
    enterpriseEmployees,
    onEmployeeSelectChange,
    meetingTypes,
    onMeetingTypeSelectChange,
    currentCareerDay,
    studentTimeSlots,
    employeeTimeSlots,
    onTimeSlotSelectChange,
    onModifyMeetingSubmit
}) => (
    <div className='user-modify-form'>
        <form onSubmit={onModifyMeetingSubmit(meeting)}>
            <div className='user-modify-form-input-container'>
                {showEmployeeSelect(user, roles, enterpriseEmployees, onEmployeeSelectChange, meeting, employeeFullName)}
                {displaySelectFreeTimeSlots(currentCareerDay, studentTimeSlots, employeeTimeSlots, onTimeSlotSelectChange, meeting.date_time)}
                <div className='user-modify-form-input'>
                    <label htmlFor='virtualMeetingUrl'>Lien vers la réunion virtuelle (le cas échéant):</label>
                    <input type='url' id='virtualMeetingUrl' name='virtualMeetingUrl' placeholder='Lien pour un appel vidéo' defaultValue={meeting.virtual_meeting_url === null || meeting.virtual_meeting_url === 'null' ? '' : meeting.virtual_meeting_url} />
                </div>
                <SelectMeetingTypeComponent
                    meetingTypes={meetingTypes}
                    onMeetingTypeSelectChange={onMeetingTypeSelectChange}
                    defaultMeetingTypeId={meeting.id_meeting_type}
                    defaultMeetingType={parseInt(meeting.id_meeting_type) === 2 ? 'presentiel' : 'virtuel'}
                />
            </div>
            <div className='modify-button'>
                <input className='s-modify-button' type='submit' value='Modifier meeting' />
            </div>
        </form>
    </div>
)

export default ModifyMeetingComponent
