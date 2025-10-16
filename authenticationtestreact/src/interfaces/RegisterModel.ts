export default interface RegisterModel {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    roles?: string[];
}


