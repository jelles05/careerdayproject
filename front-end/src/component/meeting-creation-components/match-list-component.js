import React from 'react'
import SelectEmployeeComponent from '../select-components/select-employee-component'
import MeetingCreationComponent from './meeting-creation-component'

function displayProfileImage (imageName) {
    let image
    if (imageName === null || imageName === '' || imageName === 'null') {
        image = <img className='view-logo' src='images/user.png' alt='image profil etudiant' />
    } else {
        image = <img className='view-logo' src={'https://projetfinalheroku.s3.us-east-2.amazonaws.com/' + imageName} alt='image profil etudiant' />
    }
    return image
}
function displayMatchPercentage (user, roles, percentage) {
    let match = ''
    if (user.id_role === roles.Admin) {
        match = (
            <div>
                Match: {percentage + '%'}
            </div>
        )
    }
    return match
}

function listItem (user, student, onStudentClick, onStudentDetailsClick, onScheduleMeetingClick, employees, roles, onEmployeeSelectChange, currentCareerDay, studentTimeSlots, employeeTimeSlots, onOkSelectEmployeeClick, onTimeSlotSelectChange, meetingTypes, onMeetingTypeSelectChange, onMatchMeetingSubmit, errorForm) {
    return (
        <div key={student.student.id}>
            <div className='list-item d-flex justify-content-around match-item' onClick={onStudentClick(student.student)}>
                <div>
                    {displayProfileImage(student.student.profile_image_url)}
                </div>
                <div className='list-item-name'>
                    {student.student.name + ' ' + student.student.last_name}
                </div>
                {displayMatchPercentage(user, roles, student.points)}
                <div>
                    <a href='#' onClick={onStudentDetailsClick(student.student)}>
                        <i className='fas fa-info-circle details-icon' />
                    </a>
                </div>
            </div>
            <div className='match-details' style={{ display: 'none' }}>
                <div>
                    {student.student.skills.map(skill => skill.skill_name + ' ')}
                </div>
                <div>
                    <button className='s-job-modify-button' onClick={onScheduleMeetingClick}>
                        Programmer meeting
                    </button>
                </div>
            </div>
            <div className='match-schedule' style={{ display: 'none' }}>
                <SelectEmployeeComponent
                    employees={employees}
                    roles={roles}
                    onEmployeeSelectChange={onEmployeeSelectChange}
                    onOkClick={onOkSelectEmployeeClick}
                />
                <MeetingCreationComponent
                    typeForm='match'
                    currentCareerDay={currentCareerDay}
                    studentTimeSlots={studentTimeSlots}
                    employeeTimeSlots={employeeTimeSlots}
                    onTimeSlotSelectChange={onTimeSlotSelectChange}
                    meetingTypes={meetingTypes}
                    onMeetingTypeSelectChange={onMeetingTypeSelectChange}
                    onMatchMeetingSubmit={onMatchMeetingSubmit}
                    errorForm={errorForm}
                />
            </div>
        </div>
    )
}

function checkIfStudentListEmpty (user, matchStudents, onStudentClick, onStudentDetailsClick, onScheduleMeetingClick, employees, roles, onEmployeeSelectChange, currentCareerDay, studentTimeSlots, employeeTimeSlots, onOkSelectEmployeeClick, onTimeSlotSelectChange, meetingTypes, onMeetingTypeSelectChange, onMatchMeetingSubmit, errorForm) {
    let list
    if (matchStudents.length === 0) {
        list = <div className='text-center'>Il n'y a pas d'étudiants qui correspondent aux critères fournis</div>
    } else {
        list = matchStudents.map(student => listItem(user, student, onStudentClick, onStudentDetailsClick, onScheduleMeetingClick, employees, roles, onEmployeeSelectChange, currentCareerDay, studentTimeSlots, employeeTimeSlots, onOkSelectEmployeeClick, onTimeSlotSelectChange, meetingTypes, onMeetingTypeSelectChange, onMatchMeetingSubmit, errorForm))
    }
    return list
}

const MatchListComponent = ({ user, matchStudents, onStudentClick, onStudentDetailsClick, onScheduleMeetingClick, employees, roles, onEmployeeSelectChange, currentCareerDay, studentTimeSlots, employeeTimeSlots, onOkSelectEmployeeClick, onTimeSlotSelectChange, meetingTypes, onMeetingTypeSelectChange, onMatchMeetingSubmit, errorForm }) => (
    <div>
        {checkIfStudentListEmpty(user, matchStudents, onStudentClick, onStudentDetailsClick, onScheduleMeetingClick, employees, roles, onEmployeeSelectChange, currentCareerDay, studentTimeSlots, employeeTimeSlots, onOkSelectEmployeeClick, onTimeSlotSelectChange, meetingTypes, onMeetingTypeSelectChange, onMatchMeetingSubmit, errorForm)}
    </div>
)

export default MatchListComponent
