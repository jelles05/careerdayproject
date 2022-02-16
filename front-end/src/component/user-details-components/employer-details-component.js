import React from 'react'

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

const EmployerDetailsComponent = ({ employer, enterprise, onModifyButtonClick, onDeleteButtonClick, userRole, roles, userPresent, onUserPresentClick }) => (
    <div>
        <div className='text-center'>
            <img className='details-company-logo' src={!enterprise.logo_url || enterprise.logo_url === '' || enterprise.logo_url === null || enterprise.logo_url === 'null' ? 'images/enterprise-logo.png' : 'https://projetfinalheroku.s3.us-east-2.amazonaws.com/' + enterprise.logo_url} alt='entreprise logo' />
        </div>
        {displaySubscribeToCareerDayButton(userRole, roles, userPresent, onUserPresentClick)}
        <div className='user-details'>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Nom</div>
                <div className='user-details-r-item'>{employer.last_name}</div>
            </div>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Prénom</div>
                <div className='user-details-r-item'>{employer.name}</div>
            </div>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Courriel</div>
                <div className='user-details-r-item'>{employer.email}</div>
            </div>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Mot de passe</div>
                <div className='user-details-r-item'>********</div>
            </div>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Entreprise</div>
                <div className='user-details-r-item'>{!enterprise.name || enterprise.name === null || enterprise.name === '' || enterprise.name === 'null' ? 'N/A' : enterprise.name}</div>
            </div>
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

export default EmployerDetailsComponent
