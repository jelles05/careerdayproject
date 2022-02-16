import React from 'react'

function showRoomInput (user, roles, enterprise) {
    let input = (
        <div className='enterprise-details-form-input'>
            <label htmlFor='enterpriseRoom'>No. de salle</label>
            <input type='number' name='enterpriseRoom' defaultValue={enterprise.room} id='enterpriseRoom' placeholder='Salle' />
        </div>
    )
    if (user.id_role === roles.Employer) {
        input = (<input type='hidden' name='enterpriseRoom' defaultValue={enterprise.room} id='enterpriseRoom' />)
    }

    return input
}

const EnterpriseDetailsModifyComponent = ({ enterprise, onSubmit, user, roles, onFileChange }) => (
    <div>
        <h1 className='list-title'>Modifier Entreprise</h1>
        <div className='enterprise-details-form'>
            <form method='POST' onSubmit={onSubmit}>
                <div className='enterprise-details-form-input-container'>
                    <input type='hidden' name='enterpriseId' value={enterprise.id} />
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='enterpriseName'>Nom entreprise</label>
                        <input type='text' name='enterpriseName' defaultValue={enterprise.name} id='enterpriseName' required placeholder='Nom' />
                    </div>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='enterpriseDescription'>Description</label>
                        <input type='text' name='enterpriseDescription' defaultValue={enterprise.description} id='enterpriseDescription' placeholder='Description' />
                    </div>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='enterpriseMission'>Notre Mission</label>
                        <input type='text' name='enterpriseMission' defaultValue={enterprise.mission} id='enterpriseMission' placeholder='Notre Mission' />
                    </div>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='enterpriseTarget'>Qui cherchons-nous?</label>
                        <input type='text' name='enterpriseTarget' defaultValue={enterprise.employe_target} id='enterpriseTarget' placeholder='Qui cherchons-nous?' />
                    </div>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='file-input'>Présentation vidéo</label>
                        <div className='text-center'>
                            <label className='enterprise-header'>
                                <i className='fas fa-upload' />
                                <input type='file' id='file-input' name='file-input' onChange={onFileChange} hidden />
                            </label>
                        </div>
                    </div>
                    {showRoomInput(user, roles, enterprise)}
                </div>
                <input className='s-button' type='submit' value='Modifier' />
                <button className='s-button'>Annuler</button>

            </form>
        </div>
    </div>
)

export default EnterpriseDetailsModifyComponent
