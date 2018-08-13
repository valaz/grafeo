package ru.valaz.progressio.service;

import com.google.gson.*;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.valaz.progressio.model.Indicator;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class FileService {

    private static final DateTimeFormatter ISO_LOCAL_DATE = DateTimeFormatter.ISO_LOCAL_DATE;

    private static final Logger LOGGER = LoggerFactory.getLogger(FileService.class);

    private Gson gson = new GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation()
            .setPrettyPrinting()
            .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
            .create();

    public InputStream getIndicatorJson(Indicator indicator) {
        String jsonIndicator = gson.toJson(indicator);
        return IOUtils.toInputStream(jsonIndicator);
    }

    public Optional<Indicator> storeFile(MultipartFile mfile) {
        try {
            String result = IOUtils.toString(mfile.getInputStream());
            return Optional.of(gson.fromJson(result, Indicator.class));
        } catch (IOException e) {
            LOGGER.error("Error during file storing", e);
        }

        return Optional.empty();
    }

    class LocalDateAdapter implements JsonSerializer<LocalDate>, JsonDeserializer<LocalDate> {

        public JsonElement serialize(LocalDate date, Type typeOfSrc, JsonSerializationContext context) {
            return new JsonPrimitive(date.format(ISO_LOCAL_DATE));
        }

        @Override
        public LocalDate deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) {
            String stringData = jsonElement.getAsString();
            return LocalDate.parse(stringData, ISO_LOCAL_DATE);
        }
    }
}
