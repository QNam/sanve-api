class UserDTO {
    constructor(user) {
        this.full_name = user.full_name;
        this.email = user.email;
        this.phone = user.phone;
        this.type = user.type;
        this.status = user.status;
        this.permission = user.permission;
        this.refresh_token = user.refresh_token;
    }
}

module.exports = UserDTO;