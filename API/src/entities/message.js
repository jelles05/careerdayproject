'use stict'
class Message {
    constructor (idReceiver, idSender, message, date, isRead) {
        this.id_receiver = idReceiver
        this.id_sender = idSender
        this.message = message
        this.date = date
        this.is_read = isRead
    }

    getId () {
        return this.id
    }

    getIdReceiver () {
        return this.idReceiver
    }

    getIdSender () {
        return this.idSender
    }

    getMessage () {
        return this.message
    }

    getDate () {
        return this.date
    }

    getIsRead () {
        return this.isRead
    }

    setMessage (message) {
        this.message = message
    }

    setIsRead (isRead) {
        this.is_read = isRead
    }
}
