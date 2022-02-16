import React from 'react'

function usersListItem (user, onDetailsClick) {
    return (
        <div className='list-item d-flex justify-content-around' key={user.id}>
            <div className='list-item-name'>
                {user.name + ' ' + user.last_name}
            </div>
            <div>
                <a href='#' onClick={onDetailsClick(user)}>
                    <i className='fas fa-info-circle details-icon' />
                </a>
            </div>
        </div>
    )
}

function checkIfUsersListEmpty (users, onDetailsClick) {
    let list
    if (users.length === 0) {
        list = <div className='text-center'>Il n'y a pas d'utilisateurs disponibles</div>
    } else {
        list = users.map((user) => usersListItem(user, onDetailsClick))
    }
    return list
}

const UsersListComponent = ({ users, onDetailsClick }) => (
    <div>
        {checkIfUsersListEmpty(users, onDetailsClick)}
    </div>
)

export default UsersListComponent
