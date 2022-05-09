package top.valiev.grafeo.service;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public abstract class AbstractService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AbstractService.class);

    private OkHttpClient okHttpClient = new OkHttpClient();

    protected JSONObject sendRequest(Request request) {
        String jsonData = "";
        try {
            LOGGER.info("Sending request: {}", request);
            Response response = okHttpClient.newCall(request).execute();
            LOGGER.info("Received response: {}", response);
            if (response.body() != null) {
                jsonData = response.body().string();
                LOGGER.info("response body: {}", jsonData);
            }
        } catch (RuntimeException | IOException e) {
            LOGGER.error("Error during request", e);
        }

        return new JSONObject(jsonData);
    }
}
