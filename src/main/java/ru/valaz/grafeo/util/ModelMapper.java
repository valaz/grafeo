package ru.valaz.grafeo.util;

import ru.valaz.grafeo.model.Indicator;
import ru.valaz.grafeo.model.User;
import ru.valaz.grafeo.payload.IndicatorResponse;
import ru.valaz.grafeo.payload.RecordResponse;
import ru.valaz.grafeo.payload.UserSummary;

import java.util.List;
import java.util.stream.Collectors;

public class ModelMapper {

    private ModelMapper() {
    }

    public static IndicatorResponse mapIndicatorToIndicatorResponse(Indicator indicator, User creator) {
        IndicatorResponse indicatorResponse = new IndicatorResponse();
        indicatorResponse.setId(indicator.getId());
        indicatorResponse.setName(indicator.getName());
        indicatorResponse.setUnit(indicator.getUnit());
        indicatorResponse.setCreationDateTime(indicator.getCreatedAt());

        List<RecordResponse> recordResponses = indicator.getRecords().stream().map(record -> {
            RecordResponse recordResponse = new RecordResponse();
            recordResponse.setId(record.getId());
            recordResponse.setValue(record.getValue());
            recordResponse.setDate(record.getDate());
            return recordResponse;
        }).sorted().collect(Collectors.toList());

        indicatorResponse.setRecords(recordResponses);

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getEmail(), creator.getName(), creator.getIsDemo());
        indicatorResponse.setCreatedBy(creatorSummary);

        return indicatorResponse;
    }

}
