import React from 'react'

const AdminDetailsComponent = ({ admin, onModifyButtonClick, onDeleteButtonClick }) => (
    <div>
        <div className='text-center'>
            <img className='details-company-logo' src='images/admin-logo.png' alt='admin logo' />
        </div>
        <div className='user-details'>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Nom</div>
                <div className='user-details-r-item'>{admin.last_name}</div>
            </div>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Prénom</div>
                <div className='user-details-r-item'>{admin.name}</div>
            </div>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Courriel</div>
                <div className='user-details-r-item'>{admin.email}</div>
            </div>
            <div className='user-details-r'>
                <div className='user-details-r-item'>Mot de passe</div>
                <div className='user-details-r-item'>********</div>
            </div>
        </div>
        <div className='modify-button'>
            <button className='s-modify-button' onClick={onModifyButtonClick}>
                Modifier le profil
            </button>
        </div>
        {/* <div className='modify-button'>
            <button className='s-modify-button' onClick={onDeleteButtonClick}>
                Supprimer le compte
            </button>
        </div> */}
    </div>
)

export default AdminDetailsComponent
