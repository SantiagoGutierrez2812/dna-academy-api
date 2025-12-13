

class AppConfig {

    public readonly PORT: string;
    public readonly NODE_ENV: string;

    constructor() {
        this.PORT = process.env.PORT || '3000';
        this.NODE_ENV = process.env.NODE_ENV || 'development';
    }
}

export default new AppConfig();