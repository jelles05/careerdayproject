import React from 'react'

function showDetailsButton (showImage, enterprise, onHandleDetailsClick) {
    let content = ''
    if (showImage) {
        content = (
            <div>
                <a href='#' onClick={() => { onHandleDetailsClick(enterprise) }}>
                    {/* <img className='view-logo' src='images/lens_icon.png' alt='voir details enterprise' /> */}
                    <i className='fas fa-info-circle details-icon' />
                </a>
            </div>
        )
    }

    return content
}

const EnterpriseListItemComponent = ({ enterprise, onHandleDetailsClick, showImage }) => (
    <div className='list-item d-flex justify-content-around' key={enterprise.id}>
        <div>
            <img className='view-logo' src={'https://projetfinalheroku.s3.us-east-2.amazonaws.com/' + enterprise.logo_url} alt='image logo entreprise' />
        </div>
        <div className='list-item-name'>
            {enterprise.name}
        </div>
        {showDetailsButton(showImage, enterprise, onHandleDetailsClick)}
    </div>
)

export default EnterpriseListItemComponent
