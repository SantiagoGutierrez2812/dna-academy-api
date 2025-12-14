

export interface PreLoginDto {
    email: string,
    password: string
}

export interface LoginSuccessfulDto {
    email: string,
    otp: string
}