package ru.valaz.grafeo.service.json;

import com.google.gson.*;
import ru.valaz.grafeo.payload.IndicatorResponse;
import ru.valaz.grafeo.payload.RecordResponse;
import ru.valaz.grafeo.payload.UserSummary;

import java.lang.reflect.Type;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

public class IndicatorResponseDeserializer implements JsonDeserializer<IndicatorResponse> {


    @Override
    public IndicatorResponse deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) {
        JsonObject jObject = jsonElement.getAsJsonObject();

        IndicatorResponse indicatorResponse = new IndicatorResponse();
        Long id = jObject.get("id").getAsLong();
        String name = jObject.get("name").getAsString();
        String unit = jObject.get("unit").getAsString();
        String dateTime = jObject.get("creationDateTime").getAsString();
        Instant creationDateTime = LocalDateTime.parse(dateTime.substring(0, dateTime.length() - 5)).atZone(ZoneId.of("America/Toronto")).toInstant();

        Gson gson = new Gson();
        UserSummary createdBy = gson.fromJson(jObject.get("createdBy"), UserSummary.class);

        List<RecordResponse> records = new ArrayList<>();
        JsonArray jsonRecordsArray = jObject.get("records").getAsJsonArray();
        for (JsonElement jsonRecord : jsonRecordsArray) {
            RecordResponse recordResponse = new RecordResponse();
            recordResponse.setId(jsonRecord.getAsJsonObject().get("id").getAsLong());
            recordResponse.setValue(jsonRecord.getAsJsonObject().get("value").getAsDouble());
            recordResponse.setDate(LocalDate.parse(jsonRecord.getAsJsonObject().get("date").getAsString()));
            records.add(recordResponse);
        }

        indicatorResponse.setId(id);
        indicatorResponse.setName(name);
        indicatorResponse.setUnit(unit);
        indicatorResponse.setCreationDateTime(creationDateTime);
        indicatorResponse.setCreatedBy(createdBy);
        indicatorResponse.setRecords(records);

        return indicatorResponse;
    }
}
