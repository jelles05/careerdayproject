import React from 'react'

function displayError (error) {
    let alert = ''
    if (error !== '') {
        alert = <div className='alert alert-danger'> {error} </div>
    }
    return alert
}

const LoginComponent = ({ onLogin, errorLogin, handleSignUpClick }) => (
    <form className='form-container' onSubmit={onLogin}>
        <legend>LOG IN</legend>
        {displayError(errorLogin)}
        <div>
            <div>
                <input type='email' placeholder='Email' id='email' name='email' required />
            </div>
            <div>
                <input type='password' placeholder='Mot de passe' id='password' name='password' required />
            </div>
            <div>
                <input type='submit' value='LOG IN' />
            </div>
            <div>
                <button onClick={handleSignUpClick('sign-up')}>SIGN UP</button>
            </div>
        </div>
    </form>
)

export default LoginComponent
