import React from 'react'

const JobDetailsComponent = ({ display, jobCriteria, jobProgram, jobProvince, jobSkills, jobLanguages, jobIdCriteria, onCreateMeetingClick, onDeleteJobClick }) => (
    <div style={{ display: (jobIdCriteria === jobCriteria.id_criteria ? display : 'none') }}>
        <div className='job-details-container-desc'>
            <p>Date de début: {jobCriteria.work_start_date?.split('T')[0]}</p>
            <p>Description: {jobCriteria.description}</p>
        </div>
        <div className='job-details-container'>
            <div>
                <p>Formation:</p>
                <div>
                    {jobProgram}
                </div>
            </div>
            <div>
                <p>Compétences:</p>
                <div>
                    {jobSkills.map(skill => skill.skill_name + ' ')}
                </div>
            </div>
            <div>
                <p>Langages:</p>
                <div>
                    {jobLanguages.map(lang => lang.language_name + ' ')}
                </div>
            </div>
            <div>
                <p>Province:</p>
                <div>
                    {jobProvince.name}
                </div>
            </div>
            <div>
                <p>Télétravail:</p>
                <div>
                    {jobCriteria.work_from_home ? 'oui' : 'non'}
                </div>
            </div>
            <div>
                <button className='s-job-modify-button' onClick={onCreateMeetingClick(jobCriteria, jobSkills, jobLanguages)}>
                    Créer meeting
                </button>
                <button className='s-job-modify-button' onClick={onDeleteJobClick(jobCriteria)}>
                    Supprimer poste
                </button>
            </div>
        </div>
    </div>
)

export default JobDetailsComponent
