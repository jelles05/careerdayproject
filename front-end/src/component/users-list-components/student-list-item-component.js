import React from 'react'

function displayProfileImage (imageName) {
    let image
    if (imageName === null || imageName === '' || imageName === 'null') {
        image = <img className='view-logo' src='images/user.png' alt='image profil etudiant' />
    } else {
        image = <img className='view-logo' src={'https://projetfinalheroku.s3.us-east-2.amazonaws.com/' + imageName} alt='image profil etudiant' />
    }
    return image
}

function showDetailsButton (student, onDetailsClick, showDetailsBtn) {
    let details = ''
    if (showDetailsBtn) {
        details = (
            <div>
                <a href='#' onClick={onDetailsClick(student)}>
                    <i className='fas fa-info-circle details-icon' />
                </a>
            </div>
        )
    }
    return details
}

const StudentListItemComponent = ({ student, key, onDetailsClick, showDetailsBtn }) => (
    <div className='list-item d-flex justify-content-around' key={key}>
        <div>
            {displayProfileImage(student.profile_image_url)}
        </div>
        <div className='list-item-name'>
            {student.name + ' ' + student.last_name}
        </div>
        {showDetailsButton(student, onDetailsClick, showDetailsBtn)}
    </div>
)

export default StudentListItemComponent
