

export interface PreLoginDto {
    email: string,
    password: string
}

export interface LoginSuccessfulDto {
    email: string,
    otp: string
}

export interface RegisterDto {
    name: string,
    email: string,
    phoneNumber: string,
    documentNumber: string,
    password: string
}