import React from 'react'
// import CareerDayData from '../service/career-day-data'

const CareerDayAddComponent = ({ onSubmit, onHandleReturnButton }) => (
    <div className='main-container'>
        <h1 className='list-title'>Nouvelle Journée Carrière</h1>
        <div className='enterprise-details-form'>

            <form onSubmit={onSubmit}>
                <div className='enterprise-details-form-input-container'>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='title'>Title</label>
                        <input type='text' name='title' defaultValue='' placeholder='Title...' id='title' />
                    </div>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='date'>Date</label>
                        <input type='date' name='date' defaultValue={Date.now()} id='date' />
                    </div>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='time_start'>Heure de Debut</label>
                        <input type='number' name='time_start' defaultValue='9' id='time_start' min='0' max='23' />
                    </div>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='time_end'>Heure Fin</label>
                        <input type='number' name='time_end' defaultValue='17' id='time_end' min='1' max='24' />
                    </div>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='meeting_duration'>Durée Meeting</label>
                        <input type='number' name='meeting_duration' defaultValue='1' id='meeting_duration' min='1' max='60' />
                    </div>
                </div>

                <input className='s-button' type='submit' value='Créer' />
                <button className='s-button' onClick={onHandleReturnButton}>Annuler</button>

            </form>
        </div>
    </div>
)

export default CareerDayAddComponent
