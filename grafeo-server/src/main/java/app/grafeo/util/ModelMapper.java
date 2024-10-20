package app.grafeo.util;

import app.grafeo.model.Indicator;
import app.grafeo.model.User;
import app.grafeo.payload.IndicatorResponse;
import app.grafeo.payload.RecordResponse;
import app.grafeo.payload.UserSummary;
import org.apache.commons.lang3.StringUtils;

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

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getEmail(), creator.getName(), creator.getIsDemo(), StringUtils.isNotBlank(creator.getFacebookUserId()), null);
        indicatorResponse.setCreatedBy(creatorSummary);

        return indicatorResponse;
    }

}
