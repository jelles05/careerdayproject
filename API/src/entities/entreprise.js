class Entreprise {
    constructor (name, description, mission, employeeTarget, room) {
        this.name = name
        this.description = description
        this.mission = mission
        this.employee_target = employeeTarget
        this.room = room
    }

    getId () {
        return this.id
    }

    getName () {
        return this.name
    }

    getDescription () {
        return this.description
    }

    getMission () {
        return this.mission
    }

    getEmployeeTarget () {
        return this.employeeTarget
    }

    getRoom () {
        return this.room
    }

    setName (name) {
        this.name = name
    }

    setDescription (description) {
        this.description = description
    }

    setMission (mission) {
        this.mission = mission
    }

    setEmployeeTarget (employeeTarget) {
        this.employee_target = employeeTarget
    }
}
