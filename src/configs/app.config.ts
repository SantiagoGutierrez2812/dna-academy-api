

class AppConfig {

    public readonly PORT: string;
    public readonly NODE_ENV: string;
    public readonly SALT_ROUNDS_PASSWORD: number;

    constructor() {
        this.PORT = process.env.PORT || '3000';
        this.NODE_ENV = process.env.NODE_ENV || 'development';
        this.SALT_ROUNDS_PASSWORD = parseInt(process.env.SALT_ROUNDS_PASSWORD || '10');
    }
}

export default new AppConfig();