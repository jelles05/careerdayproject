import React from 'react'
import UsersListComponent from 'component/users-list-components/users-list-component'

function showModifyButton (user, roles, enterprise, onHandleModifyFormClicked, onHandleDeleteButton) {
    let modifyButton = ''
    if ((user.id_role === roles.Employer) || (user.id_role === roles.Admin)) {
        modifyButton = (
            <div>
                <button className='s-button' onClick={onHandleModifyFormClicked}>
                    Modifier
                </button>
            </div>
        )

        if (user.id_role === roles.Admin) {
            modifyButton = (
                <div>
                    <button className='s-button' onClick={onHandleModifyFormClicked}>
                        Modifier
                    </button>
                    <button className='s-button' onClick={() => { onHandleDeleteButton(enterprise.id) }}>
                        Supprimer
                    </button>
                </div>
            )
        }
    }

    return modifyButton
}

function showVideo (enterprise) {
    let video = ''
    if ((enterprise.video_url !== undefined && enterprise.video_url !== null) && enterprise.video_url !== '') {
        video = (
            <div className='enterprise-info enterprise-video'>
                <h3>
                    Présentation Video
                </h3>

                <iframe id='previewVideo' className='enterprise-video-frame' src={'https://projetfinalheroku.s3.us-east-2.amazonaws.com/' + enterprise.video_url} title='YouTube video player' frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
            </div>
        )
    }

    return video
}

function showReturnButton (user, roles, onHandleReturnButton) {
    let display = ''

    if ((user.id_role === roles.Admin) || (user.id_role === roles.Student)) {
        display = (
            <button className='return-btn' onClick={onHandleReturnButton}>Retour</button>
        )
    }

    return display
}

function showEmployees (user, roles, employees, onDetailsEmployeeClick, onAddEmployeeButtonClick) {
    let content = ''
    let addEmployeeButton = ''
    if (user.id_role === roles.Employer) {
        addEmployeeButton = (
            <div>
                <button className='s-button' onClick={onAddEmployeeButtonClick}>Ajouter employé</button>
            </div>
        )
    }
    if ((user.id_role === roles.Employer) || (user.id_role === roles.Admin)) {
        content = (
            <div className='enterprise-employees'>
                <h4>Employés Enregistrés</h4>
                {addEmployeeButton}
                <UsersListComponent users={employees} onDetailsClick={onDetailsEmployeeClick} />
            </div>
        )
    }

    return content
}

function showRoomNumber (enterprise, user, roles) {
    let room = ''

    if (user.id_role !== roles.Student) {
        room = (
            <div className='enterprise-mission enterprise-details-m'>
                <h4>No. de salle</h4>
                <p>{enterprise.room}</p>
            </div>
        )
    }

    return room
}

function showChangeEnterpriseImageButton (user, roles, onFileChange) {
    let button = ''
    if (user.id_role !== roles.Student && user.id_role !== roles.Employee) {
        button = (
            <div>
                <label className='enterprise-header'>
                    <i className='fas fa-upload' />
                    <input type='file' id='file-input' onChange={onFileChange} hidden />
                </label>
            </div>
        )
    }
    return button
}

const EnterpriseDetailsComponent = ({ onFileChange, enterprise, user, roles, onHandleModifyFormClicked, onHandleReturnButton, employees, onDetailsEmployeeClick, onHandleDeleteButton, onAddEmployeeButtonClick }) => (
    <div className='enterprise-details'>
        {showReturnButton(user, roles, onHandleReturnButton)}
        <div className='enterprise-header'>
            <img src={'https://projetfinalheroku.s3.us-east-2.amazonaws.com/' + enterprise.logo_url} alt='logo-enterprise' id='preview' />
            <h1 className='text-center'>{enterprise.name}</h1>
        </div>
        {showChangeEnterpriseImageButton(user, roles, onFileChange)}
        <div className='enterprise-video'>
            {showVideo(enterprise)}
        </div>
        <div className='enterprise-info'>
            <div className='enterprise-description enterprise-details-m'>
                <h4>Qui sommes nous?</h4>
                <p>{enterprise.description}</p>
            </div>
            <div className='enterprise-mission enterprise-details-m'>
                <h4>Notre Mission</h4>
                <p>{enterprise.mission}</p>
            </div>
            <div className='enterprise-target enterprise-details-m'>
                <h4>Qui cherchons-nous?</h4>
                <p>{enterprise.employe_target}</p>
            </div>
            {showRoomNumber(enterprise, user, roles)}
        </div>
        <div className='enterprise-modify-button'>
            {showModifyButton(user, roles, enterprise, onHandleModifyFormClicked, onHandleDeleteButton)}
        </div>
        {showEmployees(user, roles, employees, onDetailsEmployeeClick, onAddEmployeeButtonClick)}
    </div>
)

export default EnterpriseDetailsComponent
