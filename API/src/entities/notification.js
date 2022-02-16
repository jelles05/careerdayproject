class Notification {
    constructor (contentNotification, idUser, isRead, date) {
        this.content_notification = contentNotification
        this.id_user = idUser
        this.is_read = isRead
        this.date = date
    }

    getId () {
        return this.id
    }

    getContentNotification () {
        return this.content_notification
    }

    getIdUser () {
        return this.id_user
    }

    getIsRead () {
        return this.is_read
    }

    getDate () {
        return this.date
    }

    setContentNotification (contentNotification) {
        this.content_notification = contentNotification
    }

    setIsRead (isRead) {
        this.is_read = isRead
    }

    setDate (date) {
        this.date = date
    }
}
