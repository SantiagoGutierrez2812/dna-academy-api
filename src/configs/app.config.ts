

class AppConfig {

    public readonly ALLOWED_ORIGINS: string[];
    public readonly PORT: string;
    public readonly NODE_ENV: string;
    public readonly SALT_ROUNDS_PASSWORD: number;
    public readonly LOGIN_LOCKOUT_MINUTES: number;
    public readonly OTP_EXPIRATION_MINUTES: number;
    public readonly AUTH_MAX_ATTEMPTS: number;
    public readonly JWT_ACCESS_SECRET: string;
    public readonly JWT_ACCESS_EXP_MINUTES: number;
    public readonly JWT_REFRESH_SECRET: string;
    public readonly JWT_REFRESH_EXP_DAYS: number;

    constructor() {
        this.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
            "http://localhost:5173",
            "https://dna-academy-client.vercel.app"
        ];
        this.PORT = process.env.PORT || '3000';
        this.NODE_ENV = process.env.NODE_ENV || 'development';
        this.SALT_ROUNDS_PASSWORD = parseInt(process.env.SALT_ROUNDS_PASSWORD || '10');
        this.LOGIN_LOCKOUT_MINUTES = parseInt(process.env.LOGIN_LOCKOUT_MINUTES || '15');
        this.OTP_EXPIRATION_MINUTES = parseInt(process.env.OTP_EXPIRATION_MINUTES || '15');
        this.AUTH_MAX_ATTEMPTS = parseInt(process.env.AUTH_MAX_ATTEMPTS || '5');
        this.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
        this.JWT_ACCESS_EXP_MINUTES = parseInt(process.env.JWT_ACCESS_EXP_MINUTES || '15');
        this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh:secret';
        this.JWT_REFRESH_EXP_DAYS = parseInt(process.env.JWT_REFRESH_EXP_DAYS || '7');
    }
}

export default new AppConfig();