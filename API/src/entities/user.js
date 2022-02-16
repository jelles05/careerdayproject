class User {
    constructor (email, password, idRole, lastName, name) {
        this.email = email
        this.password = password
        this.id_role = idRole
        this.last_name = lastName
        this.name = name
    }

    getId () {
        return this.id
    }

    getEmail () {
        return this.email
    }

    getPassword () {
        return this.password
    }

    getIdRole () {
        return this.idRole
    }

    getLastName () {
        return this.lastName
    }

    getName () {
        return this.name
    }

    setEmail (email) {
        this.email = email
    }

    setPassword (password) {
        this.password = password
    }

    setLastName (lastName) {
        this.last_name = lastName
    }

    setName (name) {
        this.name = name
    }
}
