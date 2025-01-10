
export class User {
    constructor(email, firstName, lastName, phoneNumber, licenseNumber, licensePhoto, isUserValid) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.licenseNumber = licenseNumber;
        this.licensePhoto = licensePhoto;
        this.isUserValid = isUserValid;
    }
    validateUser() {
        this.isUserValid = true;
    }
}