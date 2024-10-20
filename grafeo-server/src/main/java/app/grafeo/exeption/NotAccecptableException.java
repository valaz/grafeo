package app.grafeo.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
public class NotAccecptableException extends RuntimeException {

    public NotAccecptableException(String message) {
        super(message);
    }

    public NotAccecptableException(String message, Throwable cause) {
        super(message, cause);
    }
}
