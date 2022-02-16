import React from 'react'
import MeetingsListItemComponent from './meetings-list-item-component'

function checkIfListIsEmpty (meetings, user, roles, showingDetails, onHandleDetailsClick, currentDetails, onCancelMeetingClick, meetingTypes, isMeetingCareerDayOver, onModifyMeetingButtonClick) {
    let list
    if (meetings === null || meetings === undefined || meetings.length === 0) {
        list = <div className='text-center'>Il n'y aucun meeting disponible.</div>
    } else {
        list = meetings.map((meeting) => <MeetingsListItemComponent meeting={meeting} key={meeting.id} user={user} roles={roles} showingDetails={showingDetails} onHandleDetailsClick={onHandleDetailsClick} currentDetails={currentDetails} onCancelMeetingClick={onCancelMeetingClick} meetingTypes={meetingTypes} isMeetingCareerDayOver={isMeetingCareerDayOver} onModifyMeetingButtonClick={onModifyMeetingButtonClick} />)
    }
    return list
}

const MeetingsListComponent = ({ meetings, user, roles, showingDetails, onHandleDetailsClick, currentDetails, onCancelMeetingClick, meetingTypes, isMeetingCareerDayOver, onModifyMeetingButtonClick }) => (
    <div>
        {checkIfListIsEmpty(meetings, user, roles, showingDetails, onHandleDetailsClick, currentDetails, onCancelMeetingClick, meetingTypes, isMeetingCareerDayOver, onModifyMeetingButtonClick)}
    </div>
)

export default MeetingsListComponent
