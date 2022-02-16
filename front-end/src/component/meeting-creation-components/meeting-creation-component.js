import React from 'react'
import SelectFreeTimeSlotComponent from '../select-components/select-free-time-slot-component'
import SelectMeetingTypeComponent from '../select-components/select-meeting-type-component'
import SelectEnterpriseComponent from '../select-components/select-enterprise-component'
import SelectStudentComponent from '../select-components/select-student-component'
import SelectEmployeeComponent from '../select-components/select-employee-component'
import AvailableTimeSlots from '../../service/AvailableTimeSlots'

function checkFormToDisplay (typeForm, currentCareerDay, studentTimeSlots, employeeTimeSlots, onTimeSlotSelectChange, meetingTypes, onMeetingTypeSelectChange, onMatchMeetingSubmit, allEnterprises, onEnterpriseSelectChange, activeStudents, onActiveStudentSelectChange, enterpriseEmployees, roles, onEmployeeSelectChange, errorForm, checkIfCareerDayHasStudents, checkIfCareerDayHasEnterprises) {
    let display = ''
    const availableTimeSlots = new AvailableTimeSlots()
    if (typeForm === 'match') {
        let alert = ''
        if (errorForm !== '') {
            alert = <div className='alert alert-danger'> {errorForm} </div>
        }
        display = (
            <div style={{ display: 'none' }}>
                <div className='user-modify-form meeting-form'>
                    <form onSubmit={onMatchMeetingSubmit()}>
                        {alert}
                        <SelectFreeTimeSlotComponent
                            timeSlots={availableTimeSlots.getAvailableTimeSlots(currentCareerDay, studentTimeSlots, employeeTimeSlots)}
                            onTimeSlotSelectChange={onTimeSlotSelectChange}
                        />
                        <div className='user-modify-form-input'>
                            <label htmlFor='virtualMeetingUrl'>Lien vers la réunion virtuelle (le cas échéant):</label>
                            <input type='url' id='virtualMeetingUrl' name='virtualMeetingUrl' placeholder='Lien pour un appel vidéo' />
                        </div>
                        <SelectMeetingTypeComponent
                            meetingTypes={meetingTypes}
                            onMeetingTypeSelectChange={onMeetingTypeSelectChange}
                        />
                        <div className='modify-button'>
                            <input className='s-modify-button' type='submit' value='Créer meeting' />
                        </div>
                    </form>
                </div>
            </div>
        )
    } else if (typeForm === 'admin') {
        let alert = ''
        if (errorForm !== '') {
            alert = <div className='alert alert-danger'> {errorForm} </div>
        }
        if (!checkIfCareerDayHasStudents(activeStudents)) {
            // console.log(activeStudents)
            display = (
                <div className='alert-meeting-container'>
                    <div className='alert alert-danger'> Il n'y a pas d'etudiant inscrit dans la journee carriere </div>
                </div>
            )
        } else if (!checkIfCareerDayHasEnterprises(allEnterprises)) {
            display = (
                <div className='alert-meeting-container'>
                    <div className='alert alert-danger'> Il n'y a pas d'entreprise inscrite dans la journee carriere </div>
                </div>
            )
        } else {
            display = (
                <div className='user-modify-form'>
                    <form onSubmit={onMatchMeetingSubmit()}>
                        {alert}
                        <div className='user-modify-form-input-container'>
                            <SelectStudentComponent
                                students={activeStudents}
                                onStudentSelectChange={onActiveStudentSelectChange}
                            />
                            <SelectEnterpriseComponent
                                enterprises={allEnterprises}
                                onEnterpriseSelectChange={onEnterpriseSelectChange}
                            />
                            <SelectEmployeeComponent
                                employees={enterpriseEmployees}
                                roles={roles}
                                onEmployeeSelectChange={onEmployeeSelectChange}
                                onOkClick={null}
                            />
                            <SelectFreeTimeSlotComponent
                                timeSlots={availableTimeSlots.getAvailableTimeSlots(currentCareerDay, studentTimeSlots, employeeTimeSlots)}
                                onTimeSlotSelectChange={onTimeSlotSelectChange}
                            />
                            <div className='user-modify-form-input'>
                                <label htmlFor='virtualMeetingUrl'>Lien vers la réunion virtuelle (le cas échéant):</label>
                                <input type='url' id='virtualMeetingUrl' name='virtualMeetingUrl' placeholder='Lien pour un appel vidéo' />
                            </div>
                            <SelectMeetingTypeComponent
                                meetingTypes={meetingTypes}
                                onMeetingTypeSelectChange={onMeetingTypeSelectChange}
                            />
                        </div>
                        <div className='modify-button'>
                            <input className='s-modify-button' type='submit' value='Créer meeting' />
                        </div>
                    </form>
                </div>
            )
        }
    }
    return display
}

const MeetingCreationComponent = ({ typeForm, currentCareerDay, studentTimeSlots, employeeTimeSlots, onTimeSlotSelectChange, meetingTypes, onMeetingTypeSelectChange, onMatchMeetingSubmit, allEnterprises, onEnterpriseSelectChange, activeStudents, onActiveStudentSelectChange, enterpriseEmployees, roles, onEmployeeSelectChange, errorForm, checkIfCareerDayHasStudents, checkIfCareerDayHasEnterprises }) => (
    checkFormToDisplay(typeForm, currentCareerDay, studentTimeSlots, employeeTimeSlots, onTimeSlotSelectChange, meetingTypes, onMeetingTypeSelectChange, onMatchMeetingSubmit, allEnterprises, onEnterpriseSelectChange, activeStudents, onActiveStudentSelectChange, enterpriseEmployees, roles, onEmployeeSelectChange, errorForm, checkIfCareerDayHasStudents, checkIfCareerDayHasEnterprises)
)

export default MeetingCreationComponent
