package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.entities.UserAddDto;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateAddDto extends UserAddDto {

    @NotBlank(message = Msg.Annotation.REQUIRED)
    @Size(min = Utils.Const.MIN_FN, max = Utils.Const.MAX_FN, message = Msg.Annotation.SIZE)
    private String firstName;

    @NotBlank(message = Msg.Annotation.REQUIRED)
    @Size(min = Utils.Const.MIN_LN, max = Utils.Const.MAX_LN, message = Msg.Annotation.SIZE)
    private String lastName;

    @NotBlank(message = Msg.Annotation.REQUIRED)
    @Pattern(regexp = Utils.Const.NAT_ID_REGEXP, message = Msg.Annotation.PATTERN + " (It must consist of 11 digits)")
    private String nationalityId;

    @NotNull(message = Msg.Annotation.REQUIRED)
    @Min(value = Utils.Const.MIN_YEAR, message = Msg.Annotation.MIN)
    @Max(value = Utils.Const.THIS_YEAR, message = Msg.Annotation.MAX)
    private Short birthYear;

}
