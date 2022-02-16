import React from 'react'
import NewNotificationComponent from './notification-components/new-notification-component'
import NotificationItemComponent from './notification-item-component'

function displayEnterprisesOption (roles, userRole, onOptionClick) {
    let enterprises = ''
    if (userRole === roles.Admin || userRole === roles.Student) {
        enterprises = (
            <div className='menu-option' onClick={onOptionClick('enterprises')}>
                <i className='fas fa-building' />
                <p>Entreprises</p>
            </div>
        )
    } else {
        enterprises = (
            <div className='menu-option' onClick={onOptionClick('enterprises')}>
                <i className='fas fa-building' />
                <p>Mon entreprise</p>
            </div>
        )
    }
    return enterprises
}

function displayUsersOption (roles, userRole, onOptionClick) {
    let users = ''
    if (userRole === roles.Admin) {
        users = (
            <div className='menu-option' onClick={onOptionClick('users')}>
                <i className='fas fa-users' />
                <p>Utilisateurs</p>
            </div>
        )
    } else if (userRole === roles.Employee || userRole === roles.Employer) {
        users = (
            <div className='menu-option' onClick={onOptionClick('users')}>
                <i className='fas fa-users' />
                <p>Étudiants</p>
            </div>
        )
    }
    return users
}

function displayCareerDayOption (roles, userRole, onOptionClick) {
    let careerDay = ''
    if (userRole === roles.Admin) {
        careerDay = (
            <div className='menu-option' onClick={onOptionClick('career-day')}>
                <i className='fas fa-calendar-check' />
                <p>Journée carrière</p>
            </div>
        )
    }
    return careerDay
}

function displayNotification (notifications, handleNotificationCLick) {
    const list = notifications.map((notification) => {
        notification.date = new Date(notification.date)
        return (
            <NotificationItemComponent notification={notification} key={notification.id} onClick={handleNotificationCLick} />
        )
    }
    )
    return list
}

const MainMenuComponent = ({ roles, userRole, onOptionClick, onLogoutClick, notifications, onNotificationCLick, nbNewNotifications, showNewNotificationsComponent }) => (
    <nav>
        <div>
            <div className='logo-isi'>
                <img src='images/isi_logo.png' alt='messages' />
            </div>
            <div className='menu-options'>
                <div className='menu-option'>
                    <div className='wrap-collabsible'>
                        <NewNotificationComponent nbNotifications={nbNewNotifications} displayComponent={showNewNotificationsComponent} />
                        <i className='far fa-bell' />
                        <input id='collapsible' className='toggle' type='checkbox' />
                        <label htmlFor='collapsible' className='lbl-toggle'>Notifications</label>
                        <div className='collapsible-content'>
                            <div className='content-inner'>
                                {displayNotification(notifications, onNotificationCLick)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='menu-option' onClick={onOptionClick('profile')}>
                    <i className='fas fa-address-card' />
                    <p>Mon profil</p>
                </div>
                {displayCareerDayOption(roles, userRole, onOptionClick)}
                <div className='menu-option' onClick={onOptionClick('meetings')}>
                    <i className='fas fa-id-card-alt' />
                    <p>Meetings</p>
                </div>
                {displayEnterprisesOption(roles, userRole, onOptionClick)}
                {displayUsersOption(roles, userRole, onOptionClick)}
                <div className='menu-option' onClick={onLogoutClick}>
                    <i className='fas fa-sign-out-alt' />
                    <p>Logout</p>
                </div>
            </div>
        </div>
    </nav>
)

export default MainMenuComponent
