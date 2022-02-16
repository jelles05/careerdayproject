import React from 'react'

const SearchBarComponent = ({ onSearchBarInput, onViewAllClick }) => (
    <form className='search-bar-form'>
        <div>
            <input onChange={onSearchBarInput} type='search' id='search' name='search' placeholder='Rechercher...' required />
            <div onClick={onViewAllClick}>Voir tous</div>
        </div>
    </form>
)

export default SearchBarComponent
