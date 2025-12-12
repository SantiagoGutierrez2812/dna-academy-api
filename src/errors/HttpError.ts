
/**
 * Clase de error personalizada para manejar errores HTTP
 * Extiende de Error y agrega la propiedad status para el código de estado
 */
class HttpError extends Error {

    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export default HttpError;