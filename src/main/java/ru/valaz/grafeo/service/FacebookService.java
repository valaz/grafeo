package ru.valaz.grafeo.service;

import okhttp3.Request;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.text.MessageFormat;

@Service
public class FacebookService extends AbstractService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FacebookService.class);

    private static final String APP_TOKEN_LINK_TEMPLATE = "https://graph.facebook.com/oauth/access_token?client_id={0}&client_secret={1}&grant_type=client_credentials";
    private static final String USER_TOKEN_LINK_TEMPLATE = "https://graph.facebook.com/debug_token?input_token={0}&access_token={1}";
    private static final String ACCESS_TOKEN = "access_token";
    private static final String DATA = "data";
    private static final String IS_VALID = "is_valid";
    private static final String APP_ID = "app_id";
    private static final String USER_ID = "user_id";

    @Value("${fb.app.id}")
    private String appId;

    @Value("${fb.app.secret}")
    private String secret;

    private String accessToken;


    public boolean isValidUserToken(String userToken, String userId) {
        try {
            String appToken = getAccessToken();
            String link = MessageFormat.format(USER_TOKEN_LINK_TEMPLATE, userToken, appToken);
            Request tokenRequest = new Request.Builder()
                    .url(link)
                    .build();
            JSONObject tokenResponse = sendRequest(tokenRequest);
            boolean responseIsValid = tokenResponse.getJSONObject(DATA).getBoolean(IS_VALID);
            if (!responseIsValid) {
                LOGGER.info("Incorrect token for {}", userId);
                return false;
            }
            String responseAppId = tokenResponse.getJSONObject(DATA).getString(APP_ID);
            String responseUserId = tokenResponse.getJSONObject(DATA).getString(USER_ID);
            if (this.appId.equals(responseAppId) && userId.equals(responseUserId)) {
                LOGGER.info("Correct token for {}", userId);
                return true;
            }
        } catch (RuntimeException e) {
            LOGGER.error("Error during Facebook token check", e);
        }

        LOGGER.info("Incorrect token for {}", userId);
        return false;
    }

    private String getAccessToken() {
        if (StringUtils.isBlank(this.accessToken)) {
            String appLink = MessageFormat.format(APP_TOKEN_LINK_TEMPLATE, appId, secret);

            Request appRequest = new Request.Builder()
                    .url(appLink)
                    .build();
            JSONObject appResponse = sendRequest(appRequest);
            if (appResponse.has(ACCESS_TOKEN)) {
                this.accessToken = appResponse.getString(ACCESS_TOKEN);
            }
        }
        return this.accessToken;
    }

    @PostConstruct
    private void after() {
        getAccessToken();
    }
}
