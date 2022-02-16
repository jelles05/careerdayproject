import React from 'react'
import Select from 'react-select'

function renderActiveButton (isActive, onActiveButtonClicked) {
    let button = (
        <div className='career-day-dashboard-button inactive' onClick={onActiveButtonClicked}>
            <i className='fas fa-times-circle' />
            <p>Inactive</p>
        </div>
    )
    if (isActive) {
        button = (
            <div className='career-day-dashboard-button active' onClick={onActiveButtonClicked}>
                <i className='fas fa-check-circle' />
                <p>Active</p>
            </div>
        )
    }

    return button
}

function formatDate (date) {
    const newDate = date?.split('T')[0]
    return newDate
}

function renderOptionList (careerDayList, onSelectChange) {
    const options = []

    careerDayList.forEach(careerDay => {
        let showStatus = ` / ${formatDate(careerDay.date)}`
        if (careerDay.is_active) { showStatus += ' / (Active)' }

        const data = {
            value: careerDay.id,
            label: careerDay.title + showStatus
        }
        options.push(data)
    })

    return (<Select options={options} onChange={onSelectChange} placeholder='Journée carrière...' />)
}

function renderDashboard (selectedCareerDay, onActiveButtonClicked, onAttendanceListClicked, onHandleAddButtonClicked, onHandleParamsButtonClicked, onHandleUserListClicked) {
    let page = ''
    if (selectedCareerDay !== null) {
        page = (
            <div>
                <h1 className='list-title'>{`${selectedCareerDay.title} / ${formatDate(selectedCareerDay.date)}`}</h1>
                <div className='career-day-dashboard-buttons'>

                    <div
                        className='career-day-dashboard-button'
                        onClick={() => {
                            onAttendanceListClicked(selectedCareerDay)
                        }}
                    >
                        <i className='fas fa-building' />
                        <p>Entreprises</p>
                    </div>
                    <div
                        className='career-day-dashboard-button' onClick={() => {
                            onHandleUserListClicked(selectedCareerDay)
                        }}
                    >
                        <i className='fas fa-users' />
                        <p>Étudiants</p>
                    </div>
                    <div className='career-day-dashboard-button' onClick={onHandleParamsButtonClicked}>
                        <i className='fas fa-cogs' />
                        <p>Paramètres</p>
                    </div>

                    {renderActiveButton(selectedCareerDay.is_active, onActiveButtonClicked)}

                </div>
            </div>
        )
    } else {
        page = (

            <div className='s-button' id='new-career-day-btn' onClick={onHandleAddButtonClicked}>+ Nouvelle Journée Carrière</div>

        )
    }
    return page
}

const CareerDayDashboardComponent = ({
    careerDayList,
    currentCareerDay,
    onSelectChange,
    onActiveButtonClicked,
    onAttendanceListClicked,
    onHandleAddButtonClicked,
    onHandleParamsButtonClicked,
    onHandleUserListClicked
}) => (
    <div>
        <h1 className='list-title'>Journée Carrière</h1>
        <div className='career-day-dashboard-container'>
            <div className='career-day-dashboard-select'>
                {renderOptionList(careerDayList, onSelectChange)}
            </div>
            {renderDashboard(currentCareerDay, onActiveButtonClicked, onAttendanceListClicked, onHandleAddButtonClicked, onHandleParamsButtonClicked, onHandleUserListClicked)}

        </div>
    </div>
)

export default CareerDayDashboardComponent
