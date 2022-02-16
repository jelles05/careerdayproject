import React from 'react'
import TimeSlotsComponent from './time-slots-component'

function displayProfileImage (imageName) {
    let image
    if (imageName === null || imageName === '' || imageName === 'null') {
        image = <img className='details-user-img' src='images/user.png' alt='image profil etudiant' id='preview' />
    } else {
        image = <img className='details-user-img' src={'https://projetfinalheroku.s3.us-east-2.amazonaws.com/' + imageName} alt='image profil etudiant' id='preview' />
    }
    return image
}

function displayStudentLastName (student, userRole, roles) {
    let lastName = (
        <div className='student-details-r'>
            <div className='student-details-r-item'>Nom</div>
            <div className='student-details-r-item'>{student.last_name}</div>
        </div>
    )
    if (userRole === roles.Student || userRole === roles.Admin) {
        lastName = ''
    }
    return lastName
}

function displayStudentFirstName (student, userRole, roles) {
    let lastName = (
        <div className='student-details-r'>
            <div className='student-details-r-item'>Prénom</div>
            <div className='student-details-r-item'>{student.name}</div>
        </div>
    )
    if (userRole === roles.Student || userRole === roles.Admin) {
        lastName = ''
    }
    return lastName
}

function displayAccountInformation (student, userRole, roles, userTimeSlots, userMeetings, timeSlotisModifiable, onTimeSlotModifyClick, onTimeSlotClick, activeCareerDay) {
    let info = ''
    if (userRole === roles.Student || userRole === roles.Admin) {
        info = (
            <div>
                <p className='text-center title-details'>Informations sur le compte</p>
                <div className='student-details'>
                    <div className='student-details-r'>
                        <div className='student-details-r-item'>Nom</div>
                        <div className='student-details-r-item'>{student.last_name}</div>
                    </div>
                    <div className='student-details-r'>
                        <div className='student-details-r-item'>Prénom</div>
                        <div className='student-details-r-item'>{student.name}</div>
                    </div>
                    <div className='student-details-r'>
                        <div className='student-details-r-item'>Courriel</div>
                        <div className='student-details-r-item'>{student.email}</div>
                    </div>
                    <div className='student-details-r'>
                        <div className='student-details-r-item'>Mot de passe</div>
                        <div className='student-details-r-item'>********</div>
                    </div>
                    <TimeSlotsComponent
                        className='student-details-r-schedule'
                        activeCareerDay={activeCareerDay}
                        userTimeSlots={userTimeSlots}
                        userMeetings={userMeetings}
                        isModifiable={false}
                        onTimeSlotModifyClick={null}
                        onTimeSlotClick={onTimeSlotClick}
                    />
                </div>
            </div>
        )
    }
    return info
}

function displayStudentSkills (studentSkills) {
    let skills = 'N/A'
    if (studentSkills.length !== 0) {
        skills = studentSkills.map((skill) => skill.skill_name + ' ')
    }
    return skills
}

function displayStudentLanguages (studentLanguages) {
    let languages = 'N/A'
    if (studentLanguages.length !== 0) {
        languages = studentLanguages.map((lang) => lang.language_name + ' ')
    }
    return languages
}

function displayButtons (userRole, roles, onModifyButtonClick, onDeleteButtonClick) {
    let button = ''
    if (userRole === roles.Student || userRole === roles.Admin) {
        button = (
            <div>
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
    }
    return button
}

function displayCvLink (cvUrl) {
    let cv = (
        <div className='student-details-r'>
            <div className='student-details-r-item'>CV</div>
            <div className='student-details-r-item'><a id='previewCV' href={'https://projetfinalheroku.s3.us-east-2.amazonaws.com/' + cvUrl} target='_blank' rel='noreferrer'>Accéder au CV</a></div>
        </div>
    )
    if (cvUrl === null || cvUrl === 'null' || cvUrl === '') {
        cv = ''
    }
    return cv
}

function displayChangeImageButton (userRole, roles, onFileChange) {
    let button = ''
    if (userRole === roles.Student || userRole === roles.Admin) {
        button = (
            <div className='text-center'>
                <label className='enterprise-header'>
                    <i className='fas fa-upload' />
                    <input type='file' id='file-input' onChange={onFileChange} hidden />
                </label>
            </div>
        )
    }
    return button
}

function displaySubscribeToCareerDayButton (userRole, roles, userPresent, onUserPresentClick) {
    let button = ''
    if (userRole === roles.Admin) {
        button = (
            <button className={userPresent ? 'subscribed-btn' : 'unsubscribed-btn'} onClick={onUserPresentClick(userPresent)}>
                {userPresent ? 'L\'utilisateur est inscrit à la journée carrière' : 'L\'utilisateur n\'est pas inscrit à la journée carrière'}
            </button>
        )
    }
    return button
}

const StudentDetailsComponent = ({ onFileChange, activeCareerDay, student, studentCriteria, studentProvince, userTimeSlots, timeSlotisModifiable, onTimeSlotModifyClick, onTimeSlotClick, userMeetings, userRole, roles, studentSkills, studentLanguages, studentProgram, onModifyButtonClick, onDeleteButtonClick, userPresent, onUserPresentClick }) => (
    <div>
        <div className='text-center'>
            {displayProfileImage(student.profile_image_url)}
        </div>
        {displayChangeImageButton(userRole, roles, onFileChange)}
        {displaySubscribeToCareerDayButton(userRole, roles, userPresent, onUserPresentClick)}
        {displayAccountInformation(student, userRole, roles, userTimeSlots, userMeetings, timeSlotisModifiable, onTimeSlotModifyClick, onTimeSlotClick, activeCareerDay)}
        <p className='text-center title-details'>Informations sur le profil</p>
        <div className='student-details'>
            {displayStudentLastName(student, userRole, roles)}
            {displayStudentFirstName(student, userRole, roles)}
            <div className='student-details-r'>
                <div className='student-details-r-item'>Formation suivi</div>
                <div className='student-details-r-item'>{studentProgram.program ? studentProgram.program : 'N/A'}</div>
            </div>
            <div className='student-details-r'>
                <div className='student-details-r-item'>Compétences</div>
                <div className='student-details-r-item'>{displayStudentSkills(studentSkills)}</div>
            </div>
            <div className='student-details-r'>
                <div className='student-details-r-item'>Langages</div>
                <div className='student-details-r-item'>{displayStudentLanguages(studentLanguages)}</div>
            </div>
            <div className='student-details-r'>
                <div className='student-details-r-item'>Province</div>
                <div className='student-details-r-item'>{studentProvince.name}</div>
            </div>
            <div className='student-details-r'>
                <div className='student-details-r-item'>Accepte le télétravail?</div>
                <div className='student-details-r-item'>{studentCriteria.work_from_home ? 'oui' : 'non'}</div>
            </div>
            <div className='student-details-r'>
                <div className='student-details-r-item'>Date de fin des études</div>
                <div className='student-details-r-item'>{studentCriteria.work_start_date?.split('T')[0]}</div>
            </div>
            <div className='student-details-r'>
                <div className='student-details-r-item'>Biographie</div>
                <div className='student-details-r-item'>{student.biography}</div>
            </div>
            {displayCvLink(student.cv_url)}
        </div>
        {displayButtons(userRole, roles, onModifyButtonClick, onDeleteButtonClick)}
    </div>
)

export default StudentDetailsComponent
