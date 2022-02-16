import React from 'react'
import TimeSlotsComponent from './time-slots-component'

const EmployeeDetailsComponent = ({ activeCareerDay, employee, enterprise, userTimeSlots, timeSlotisModifiable, onTimeSlotModifyClick, onTimeSlotClick, userMeetings, onModifyButtonClick, onDeleteButtonClick }) => (
    <div>
        <div className='text-center'>
            <img className='details-company-logo' src={!enterprise.logo_url || enterprise.logo_url === '' || enterprise.logo_url === null || enterprise.logo_url === 'null' ? 'images/enterprise-logo.png' : 'https://projetfinalheroku.s3.us-east-2.amazonaws.com/' + enterprise.logo_url} alt='entreprise logo' />
        </div>
        <div className='user-details'>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Nom</div>
                <div className='user-details-r-item'>{employee.last_name}</div>
            </div>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Prénom</div>
                <div className='user-details-r-item'>{employee.name}</div>
            </div>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Courriel</div>
                <div className='user-details-r-item'>{employee.email}</div>
            </div>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Mot de passe</div>
                <div className='user-details-r-item'>********</div>
            </div>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Entreprise</div>
                <div className='user-details-r-item'>{!enterprise.name || enterprise.name === null || enterprise.name === '' || enterprise.name === 'null' ? 'N/A' : enterprise.name}</div>
            </div>
            <TimeSlotsComponent
                className='user-details-r-schedule'
                activeCareerDay={activeCareerDay}
                userTimeSlots={userTimeSlots}
                userMeetings={userMeetings}
                isModifiable={timeSlotisModifiable}
                onTimeSlotModifyClick={onTimeSlotModifyClick}
                onTimeSlotClick={onTimeSlotClick}
            />
        </div>
        <div className='modify-button'>
            <button className='s-modify-button' onClick={onModifyButtonClick}>
                Modifier le profil
            </button>
        </div>
        <div className='modify-button'>
            <button className='s-modify-button' onClick={onDeleteButtonClick}>
                Supprimer le compte
            </button>
        </div>
    </div>
)

export default EmployeeDetailsComponent
