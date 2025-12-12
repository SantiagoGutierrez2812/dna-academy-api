

class AppConfig {

    public readonly PORT: string;

    constructor() {
        this.PORT = process.env.PORT || '3000';
    }
}

export default new AppConfig();