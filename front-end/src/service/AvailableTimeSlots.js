'use strict'

export default class AvailableTimeSlots {
    createAllTimeSlots (meetingDuration, startCareerDay, finishCareerDay) {
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

    getAvailableTimeSlots (currentCareerDay, studentTimeSlots, employeeTimeSlots) {
        const allTimeSlots = this.createAllTimeSlots(currentCareerDay.meeting_duration, currentCareerDay.time_start, currentCareerDay.time_end)
        const timeSlotIndexToRemove = []
        // GET INDEX OF UNAVAILABLE TIME SLOTS
        allTimeSlots.forEach((ts, index) => {
            if (studentTimeSlots.length !== 0) {
                studentTimeSlots.forEach(tsStudent => {
                    if (tsStudent.time_slot === ts) {
                        if (timeSlotIndexToRemove.indexOf(index) === -1) {
                            timeSlotIndexToRemove.push(index)
                        }
                    }
                })
            }
            if (employeeTimeSlots.length !== 0) {
                employeeTimeSlots.forEach(tsEmployee => {
                    if (tsEmployee.time_slot === ts) {
                        if (timeSlotIndexToRemove.indexOf(index) === -1) {
                            timeSlotIndexToRemove.push(index)
                        }
                    }
                })
            }
        })
        // REMOVE UNAVAILABLE TIME SLOTS FROM LIST
        while (timeSlotIndexToRemove.length) {
            allTimeSlots.splice(timeSlotIndexToRemove.pop(), 1)
        }
        return allTimeSlots
    }
}
