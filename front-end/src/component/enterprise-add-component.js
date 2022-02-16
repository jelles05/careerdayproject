import React from 'react'

const EnterpriseAddComponent = ({ onSubmit, onHandleReturnButton }) => (
    <div>
        <h1 className='list-title'>Ajouter Une Nouvelle Entreprise</h1>
        <button className='return-btn' onClick={onHandleReturnButton}>Retour</button>
        <div className='enterprise-details-form'>
            <form method='POST' onSubmit={onSubmit}>
                <div className='enterprise-details-form-input-container'>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='enterpriseName'>Nom entreprise</label>
                        <input type='text' name='enterpriseName' id='enterpriseName' required placeholder='Nom' />
                    </div>
                    <input type='hidden' value=' ' name='enterpriseDescription' />
                </div>
                <input className='s-button' type='submit' value='Créer' />

            </form>
        </div>
    </div>
)

export default EnterpriseAddComponent
