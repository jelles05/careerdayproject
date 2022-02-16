import React from 'react'

function setMeetingName (user, roles, meeting) {
    let name = ''
    switch (user.id_role) {
    case roles.Admin:
        name = `${meeting.enterprise_name} x ${meeting.student_name}`
        break
    case roles.Student:
        name = `${meeting.enterprise_name}`
        break
    case roles.Employer:
        name = `${meeting.employee_name} x ${meeting.student_name}`
        break
    case roles.Employee:
        name = `${meeting.student_name}`
        break
    }

    return name
}

function showDetails (showingDetails, currentDetails, meetingId) {
    let className = ''
    if (currentDetails === null) {
        className = 'meetings-details-hide'
    } else {
        if (currentDetails === meetingId && showingDetails) {
            className = 'meetings-details-show'
        } else {
            className = 'meetings-details-hide'
        }
    }

    return className
}

function showMeetingType (meetingTypes, type) {
    let meetType = ''
    for (const [key, value] of Object.entries(meetingTypes)) {
        if (value === type) {
            meetType = key
        }
    }
    return meetType
}

// verifier si le bouton sera affiche
function showCancelButton (user, roles, meeting, onCancelMeetingClick, isMeetingCareerDayOver) {
    // verifier si la journee carriere est deja passe

    // verifier la role d'utilisateur courant pour trier l'affichage du bouton
    function renderButton () {
        let button
        // console.log('Meeting details: ', meeting)

        switch (user.id_role) {
        case roles.Student:
            button = ''
            break
        case roles.Employee:
        case roles.Employer:
            button = isMeetingCareerDayOver(meeting)
                ? ''
                : <button className='s-button cancel-btn' onClick={onCancelMeetingClick(meeting)}>Annuler</button>

            break
        default:
            button = (
                <button className='s-button cancel-btn' onClick={onCancelMeetingClick(meeting)}>Annuler</button>
            )
            break
        }
        return button
    }
    const cancelButton = renderButton()
    return cancelButton
}

function showModifyButton (user, roles, meeting, onModifyMeetingButtonClick, isMeetingCareerDayOver) {
    let modifyButton = ''
    switch (user.id_role) {
    case roles.Admin:
        modifyButton = <button className='s-button' onClick={onModifyMeetingButtonClick(meeting)}>Modifier</button>
        break
    case roles.Employee:
    case roles.Employer:
        modifyButton = isMeetingCareerDayOver(meeting)
            ? ''
            : <button className='s-button' onClick={onModifyMeetingButtonClick(meeting)}>Modifier</button>
        break
    }
    return modifyButton
}

const MeetingsListItemComponent = ({ meeting, user, roles, showingDetails, onHandleDetailsClick, currentDetails, onCancelMeetingClick, meetingTypes, isMeetingCareerDayOver, onModifyMeetingButtonClick }) => (
    <div className='meeting-list-item'>
        <div className='list-item d-flex justify-content-around' key={meeting.id}>
            <div>
                <img className='view-logo' src={'https://projetfinalheroku.s3.us-east-2.amazonaws.com/' + meeting.logo_url} alt='image logo entreprise' />
            </div>
            <div className='list-item-name'>
                {setMeetingName(user, roles, meeting)}
            </div>
            <div className='list-item-name'>
                {meeting.date_time}
            </div>
            <div className='list-item-name'>
                <i className='fas fa-info-circle details-icon' onClick={() => onHandleDetailsClick(meeting.id)} />
            </div>
        </div>
        <div className={`meeting-list-item-details ${showDetails(showingDetails, currentDetails, meeting.id)}`}>
            <div>
                <p><span>Room:</span> {meeting.room}</p>
                <p><span>Type:</span> {showMeetingType(meetingTypes, meeting.id_meeting_type)}</p>
            </div>
            <div>
                <p><span>Entreprise:</span> {meeting.enterprise_name}</p>
                <p><span>Entrevue avec:</span> {meeting.employee_name}</p>
            </div>
            <div>
                <p><span>Étudiant:</span> {meeting.student_name}</p>
                <p><span>Program:</span> {meeting.program}</p>
            </div>
            <div id='s-buttons'>
                <a href={meeting.virtual_meeting_url} className='s-button' id='s-button-link'>Meet</a>
                {showModifyButton(user, roles, meeting, onModifyMeetingButtonClick, isMeetingCareerDayOver)}
                {showCancelButton(user, roles, meeting, onCancelMeetingClick, isMeetingCareerDayOver)}
            </div>
        </div>
    </div>
)

export default MeetingsListItemComponent
