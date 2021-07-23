package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobAdvertisementAddDto {

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private Integer employerId;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private Short positionId;

    @NotBlank(message = MSGs.ForAnnotation.EMPTY)
    private String jobDescription;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    private Short cityId;

    @Positive(message = MSGs.ForAnnotation.NOT_POSITIVE)
    private Double minSalary;

    @Positive(message = MSGs.ForAnnotation.NOT_POSITIVE)
    private Double maxSalary;

    @NotNull(message = MSGs.ForAnnotation.REQUIRED)
    @Positive(message = MSGs.ForAnnotation.NOT_POSITIVE)
    private Short openPositions;

    @Future(message = MSGs.ForAnnotation.PAST_OR_PRESENT)
    private LocalDate deadline;

    @NotBlank(message = MSGs.ForAnnotation.EMPTY)
    @Size(max = Utils.Const.MAX_JOB_ADV_WORK_MODEL)
    private String workModel;

    @NotBlank(message = MSGs.ForAnnotation.EMPTY)
    @Size(max = Utils.Const.MAX_JOB_ADV_WORK_TIME)
    private String workTime;

}
