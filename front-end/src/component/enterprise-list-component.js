import React from 'react'
import EnterpriseListItemComponent from './enterprise-list-item-component'

function checkIfListIsEmpty (enterprises, onHandleDetailsClick, showImage) {
    let list
    if (enterprises.length === 0) {
        list = <div className='text-center'>Il n'y aucune enterprise disponible</div>
    } else {
        list = enterprises.map((enterprise) => <EnterpriseListItemComponent enterprise={enterprise} key={enterprise.id} onHandleDetailsClick={onHandleDetailsClick} showImage={showImage} />)
    }
    return list
}

const EnterpriseListComponent = ({ enterprises, onHandleDetailsClick, showImage }) => (
    <div>
        {checkIfListIsEmpty(enterprises, onHandleDetailsClick, showImage)}
    </div>
)

export default EnterpriseListComponent
