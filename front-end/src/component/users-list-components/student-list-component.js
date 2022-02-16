import React from 'react'
import StudentListItemComponent from 'component/users-list-components/student-list-item-component'

function checkIfStudentListEmpty (students, onDetailsClick, showDetailsBtn) {
    let list
    if (students.length === 0) {
        list = <div className='text-center'>Il n'y a pas d'utilisateurs disponibles</div>
    } else {
        list = students.map((student) => <StudentListItemComponent student={student} key={student.id_user} onDetailsClick={onDetailsClick} showDetailsBtn={showDetailsBtn} />)
    }
    return list
}

const StudentListComponent = ({ students, onDetailsClick, showDetailsBtn }) => (
    <div>
        {checkIfStudentListEmpty(students, onDetailsClick, showDetailsBtn)}
    </div>
)

export default StudentListComponent
