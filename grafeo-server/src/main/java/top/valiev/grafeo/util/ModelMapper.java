package top.valiev.grafeo.util;

import org.apache.commons.lang3.StringUtils;
import top.valiev.grafeo.model.Indicator;
import top.valiev.grafeo.model.User;
import top.valiev.grafeo.payload.IndicatorResponse;
import top.valiev.grafeo.payload.RecordResponse;
import top.valiev.grafeo.payload.UserSummary;

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
