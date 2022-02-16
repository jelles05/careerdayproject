import React from 'react'

// const allTimeSlots = ['9h', '9h20', '9h40', '10h', '10h20', '10h40', '11h', '11h20', '11h40', '12h', '12h20', '12h40', '13h', '13h20', '13h40', '14h', '14h20', '14h40', '15h', '15h20', '15h40', '16h', '16h20', '16h40', '17h']

function createAllTimeSlots (meetingDuration, startCareerDay, finishCareerDay) {
    const timeSlots = []
    let hour = startCareerDay
    let minutes = 0
    while (hour < finishCareerDay) {
        timeSlots.push(hour + 'h' + (minutes !== 0 ? minutes : ''))
        let newHour = false
        minutes += meetingDuration
        if (minutes === 60) {
            minutes = 0
            newHour = true
        }
        if (minutes > 60) {
            newHour = true
            minutes -= 60
        }
        if (newHour) {
            hour++
        }
        newHour = false
    }
    return timeSlots
}

function displayTimeSlots (timeSlot, index, userTimeSlots, userMeetings, isModifiable, onTimeSlotClick) {
    let timeClass = 'time-slot-box-free'
    // CHECK IF THE TIME SLOT IS MARKED AS UNAVAILABLE
    if (!(userTimeSlots === null) || userTimeSlots.length !== 0) {
        userTimeSlots.forEach(t => {
            if (timeSlot === t.time_slot) {
                timeClass = 'time-slot-box-busy'
            }
        })
    }
    // CHECK IF THERE'S A MEETING AT THE TIME SLOT
    if (!(userMeetings === null) || userMeetings.length !== 0) {
        userMeetings.forEach(m => {
            if (timeSlot === m.date_time) {
                timeClass = 'time-slot-box-meeting'
            }
        })
    }
    // ALLOW POINTER EVENTS IF THERE'S NO MEETING AT THIS TIME SLOT
    let modifiable = ''
    if (isModifiable && timeClass !== 'time-slot-box-meeting') {
        modifiable = 'modifiable-time-slot'
    }
    return <div onClick={onTimeSlotClick(timeSlot)} className={'time-slot-box ' + timeClass + ' ' + modifiable} key={index}>{timeSlot}</div>
}

function displayModifyTimeSlotButton (onTimeSlotModifyClick, isModifiable, className) {
    let btn = (
        <button onClick={onTimeSlotModifyClick} className={className === 'student-details-r-schedule' ? 'modify-time-slot-btn' : 'modify-time-slot-btn-white'}>
            {isModifiable ? 'Enregistrer' : 'Modifier'}
        </button>
    )
    if (onTimeSlotModifyClick === null) {
        btn = ''
    }
    return btn
}

const TimeSlotsComponent = ({ className, activeCareerDay, userTimeSlots, userMeetings, isModifiable, onTimeSlotModifyClick, onTimeSlotClick }) => (
    <div className={className}>
        <p>
            Plage horaire
            {displayModifyTimeSlotButton(onTimeSlotModifyClick, isModifiable, className)}
        </p>
        {isModifiable ? <p><span className='span-meetings'>Meetings (Non modifiable)</span> - <span className='span-busy'>Indisponible</span> - <span className='span-free'>Disponible</span></p> : ''}
        <div>
            {createAllTimeSlots(activeCareerDay.meeting_duration, activeCareerDay.time_start, activeCareerDay.time_end).map((timeSlot, index) => displayTimeSlots(timeSlot, index, userTimeSlots, userMeetings, isModifiable, onTimeSlotClick))}
        </div>
    </div>
)

export default TimeSlotsComponent
