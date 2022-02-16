import React from 'react'
import JobDetailsComponent from './job-details-component'

function jobListItem (criteria, onDetailsClick, programs, jobDetailsDisplay, jobDetailsProvince, jobDetailsSkills, jobDetailsLanguages, jobDetailsIdCriteria, onCreateMeetingClick, onDeleteJobClick) {
    let programName = ''
    programs.forEach((p) => {
        if (p.id === criteria.id_program) {
            programName = p.program
        }
    })
    return (
        <div key={criteria.id_criteria}>
            <div className='list-item d-flex justify-content-around'>
                <div className='list-item-name'>
                    {'Titre: ' + criteria.title}
                </div>
                <div>
                    <a href='#' onClick={onDetailsClick(criteria)}>
                        <i className='fas fa-info-circle details-icon' />
                    </a>
                </div>
            </div>
            <JobDetailsComponent
                display={jobDetailsDisplay}
                jobCriteria={criteria}
                jobProgram={programName}
                jobProvince={jobDetailsProvince}
                jobSkills={jobDetailsSkills}
                jobLanguages={jobDetailsLanguages}
                jobIdCriteria={jobDetailsIdCriteria}
                onCreateMeetingClick={onCreateMeetingClick}
                onDeleteJobClick={onDeleteJobClick}
            />
        </div>
    )
}

function checkIfCriteriaListEmpty (criteria, onDetailsClick, programs, jobDetailsDisplay, jobDetailsProvince, jobDetailsSkills, jobDetailsLanguages, jobDetailsIdCriteria, onCreateMeetingClick, onDeleteJobClick) {
    let list
    if (criteria.length === 0) {
        list = <div className='text-center'>Il n'y a pas de postes enregistrés</div>
    } else {
        list = criteria.map((c) => jobListItem(c, onDetailsClick, programs, jobDetailsDisplay, jobDetailsProvince, jobDetailsSkills, jobDetailsLanguages, jobDetailsIdCriteria, onCreateMeetingClick, onDeleteJobClick))
    }
    return list
}

const JobListComponent = ({ enterpriseCriteria, programs, jobDetailsDisplay, onDetailsClick, jobDetailsProvince, jobDetailsSkills, jobDetailsLanguages, jobDetailsIdCriteria, onCreateMeetingClick, onDeleteJobClick }) => (
    <div>
        {checkIfCriteriaListEmpty(enterpriseCriteria, onDetailsClick, programs, jobDetailsDisplay, jobDetailsProvince, jobDetailsSkills, jobDetailsLanguages, jobDetailsIdCriteria, onCreateMeetingClick, onDeleteJobClick)}
    </div>
)

export default JobListComponent
