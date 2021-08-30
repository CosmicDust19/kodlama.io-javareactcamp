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

    @NotNull(message = Msg.Annotation.REQUIRED)
    private Short positionId;

    @NotBlank(message = Msg.Annotation.REQUIRED)
    private String jobDescription;

    @NotNull(message = Msg.Annotation.REQUIRED)
    private Short cityId;

    @Positive(message = Msg.Annotation.POSITIVE)
    private Double minSalary;

    @Positive(message = Msg.Annotation.POSITIVE)
    private Double maxSalary;

    @NotNull(message = Msg.Annotation.REQUIRED)
    @Positive(message = Msg.Annotation.POSITIVE)
    private Short openPositions;

    @NotNull(message = Msg.Annotation.REQUIRED)
    @Future(message = Msg.Annotation.FUTURE)
    private LocalDate deadline;

    @NotBlank(message = Msg.Annotation.REQUIRED)
    @Size(max = Utils.Const.MAX_JOB_ADV_WORK_MODEL, message = Msg.Annotation.SIZE)
    private String workModel;

    @NotBlank(message = Msg.Annotation.REQUIRED)
    @Size(max = Utils.Const.MAX_JOB_ADV_WORK_TIME, message = Msg.Annotation.SIZE)
    private String workTime;

}
