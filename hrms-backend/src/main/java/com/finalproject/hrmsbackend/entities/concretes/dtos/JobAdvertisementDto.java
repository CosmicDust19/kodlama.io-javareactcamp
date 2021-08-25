package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobAdvertisementDto {

    private Integer id;

    private Integer employerId;

    @NotNull(message = Msg.ForAnnotation.REQUIRED)
    private Short positionId;

    @NotBlank(message = Msg.ForAnnotation.EMPTY)
    private String jobDescription;

    @NotNull(message = Msg.ForAnnotation.REQUIRED)
    private Short cityId;

    @Positive(message = Msg.ForAnnotation.NOT_POSITIVE)
    private Double minSalary;

    @Positive(message = Msg.ForAnnotation.NOT_POSITIVE)
    private Double maxSalary;

    @NotNull(message = Msg.ForAnnotation.REQUIRED)
    @Positive(message = Msg.ForAnnotation.NOT_POSITIVE)
    private Short openPositions;

    @NotNull(message = Msg.ForAnnotation.REQUIRED)
    @Future(message = Msg.ForAnnotation.PAST_OR_PRESENT)
    private LocalDate deadline;

    @NotBlank(message = Msg.ForAnnotation.EMPTY)
    @Size(max = Utils.Const.MAX_JOB_ADV_WORK_MODEL)
    private String workModel;

    @NotBlank(message = Msg.ForAnnotation.EMPTY)
    @Size(max = Utils.Const.MAX_JOB_ADV_WORK_TIME)
    private String workTime;

}
