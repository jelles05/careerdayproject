'use strict'

import React, { Component } from 'react'
import LoginComponent from 'component/connection-components/login-component'
import SignUpComponent from 'component/connection-components/signup-component'

class ConnectionContainer extends Component {
    constructor (props) {
        super(props)

        this.state = {
            pageToRender: 'login'
        }

        this.changePage = this.changePage.bind(this)
    }

    changePage (page) {
        return () => {
            if (page === 'login') {
                this.setState({ pageToRender: 'login' })
            } else if (page === 'sign-up') {
                this.setState({ pageToRender: 'sign-up' })
                this.props.onResetSignUpError()
            }
        }
    }

    pageToRender () {
        let page
        switch (this.state.pageToRender) {
        case 'login':
            page = <LoginComponent onLogin={this.props.onLogin} errorLogin={this.props.errorLogin} handleSignUpClick={this.changePage} />
            break
        case 'sign-up':
            page = <SignUpComponent handleLoginClick={this.changePage} onSignUp={this.props.onSignUp} errorSignUp={this.props.errorSignUp} />
            break
        }
        return page
    }

    render () {
        return (
            <div>
                <div className='header-login'>
                    <img className='logo' src='https://isi-mtl.com/wp-content/uploads/2021/04/isi-logo-300x100-1.png' alt='logo ISI' />
                </div>
                <div>
                    {this.pageToRender()}
                </div>
            </div>
        )
    }
}

export default ConnectionContainer
