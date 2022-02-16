import React from 'react'

function isItemRead (notification, onClick) {
    let item
    if (notification.is_read === false) {
        item = (
            <div className='notif-item' onClick={onClick(notification)}>
                <div>{notification.title}</div>
                <div>{notification.student_name} X {notification.employee_name}</div>
                <div>{notification.enterprise_name}</div>
                <div>{notification.date.getFullYear()}-{notification.date.getMonth() + 1}-{notification.date.getDate()} : {notification.date.getHours()}h{notification.date.getMinutes()}</div>

            </div>
        )
    } else {
        item = (
            <div className='notif-item-read'>
                <div>{notification.title}</div>
                <div>{notification.student_name} X {notification.employee_name}</div>
                <div>{notification.enterprise_name}</div>
                <div>{notification.date.getFullYear()}-{notification.date.getMonth() + 1}-{notification.date.getDate()} : {notification.date.getHours()}h{notification.date.getMinutes()}</div>
            </div>
        )
    }
    return item
}

const NotificationItemComponent = ({ notification, onClick }) => (
    isItemRead(notification, onClick)
)

export default NotificationItemComponent
