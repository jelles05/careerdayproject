import React from 'react'

function displayError (error) {
    let alert = ''
    if (error !== '') {
        alert = <div className='alert alert-danger'> {error} </div>
    }
    return alert
}

const SignUpComponent = ({ handleLoginClick, onSignUp, errorSignUp }) => (
    <form className='form-container' onSubmit={onSignUp}>
        <legend>SIGN UP</legend>
        {displayError(errorSignUp)}
        <div>
            <div>
                <input type='text' placeholder='Nom' id='lastName' name='lastName' maxLength='30' required />
            </div>
            <div>
                <input type='text' placeholder='Prénom' id='name' name='name' maxLength='30' required />
            </div>
            <div>
                <input type='email' placeholder='Email' id='email' name='email' maxLength='100' required />
            </div>
            <div>
                <input type='password' placeholder='Mot de passe' id='password' name='password' maxLength='30' required />
            </div>
            <div>
                <input type='password' placeholder='Confirmez votre mot de passe' id='passwordConfirmation' name='passwordConfirmation' maxLength='30' required />
            </div>
            <div>
                <input type='submit' value='CRÉER UN COMPTE' />
            </div>
            <div>
                <button onClick={handleLoginClick('login')}>J'AI DÉJÀ UN COMPTE</button>
            </div>
        </div>
    </form>
)

export default SignUpComponent
