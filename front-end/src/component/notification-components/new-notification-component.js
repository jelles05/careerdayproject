import React from 'react'

function showAlert (nbNotifications, displayComponent) {
    let alert = ''
    if (displayComponent) {
        alert = (
            <div className={'new-notification-alert ' + (nbNotifications > 19 ? 'new-notification-alert-medium' : 'new-notification-alert-small')}>
                {nbNotifications}
            </div>
        )
    }
    return alert
}

const NewNotificationComponent = ({ nbNotifications, displayComponent }) => (
    showAlert(nbNotifications, displayComponent)
)

export default NewNotificationComponent
