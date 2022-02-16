import React from 'react'
// import CareerDayData from '../service/career-day-data'

function formatDate (date) {
    // const d = new Date(date)
    // const day = d.toLocaleDateString('fr-CA')
    const newDate = date?.split('T')[0]
    console.log(newDate)
    return newDate
}

const CareerDayModifyComponent = ({ onSubmit, careerDay, onHandleReturnButton }) => (
    <div className='main-container'>
        {/* {formatDate(careerDay.date)} */}
        <h1 className='list-title'>Modification Journée Carrière</h1>
        <div className='enterprise-details-form'>

            <form onSubmit={onSubmit}>
                <div className='enterprise-details-form-input-container'>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='title'>Title</label>
                        <input type='text' name='title' defaultValue={careerDay.title} placeholder='Title...' id='title' />
                    </div>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='date'>Date</label>
                        <input type='date' name='date' defaultValue={formatDate(careerDay.date)} id='date' />
                    </div>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='time_start'>Heure de Debut</label>
                        <input type='number' name='time_start' defaultValue={careerDay.time_start} id='time_start' min='0' max='23' />
                    </div>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='time_end'>Heure Fin</label>
                        <input type='number' name='time_end' defaultValue={careerDay.time_end} id='time_end' min='1' max='24' />
                    </div>
                    <div className='enterprise-details-form-input'>
                        <label htmlFor='meeting_duration'>Durée Meeting</label>
                        <input type='number' name='meeting_duration' defaultValue={careerDay.meeting_duration} id='meeting_duration' min='1' max='60' />
                    </div>
                </div>

                <input className='s-button' type='submit' value='Modifier' />
                <button className='s-button' onClick={onHandleReturnButton}>Annuler</button>

            </form>
        </div>
    </div>
)

export default CareerDayModifyComponent
