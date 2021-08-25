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

    @NotBlank(message = Msg.ForAnnotation.EMPTY)
    @Size(min = Utils.Const.MIN_FN, max = Utils.Const.MAX_FN)
    private String firstName;

    @NotBlank(message = Msg.ForAnnotation.EMPTY)
    @Size(min = Utils.Const.MIN_LN, max = Utils.Const.MAX_LN)
    private String lastName;

    @NotBlank(message = Msg.ForAnnotation.EMPTY)
    @Pattern(regexp = Utils.Const.NAT_ID_REGEXP, message = Msg.ForAnnotation.INVALID_NAT_ID)
    private String nationalityId;

    @NotNull(message = Msg.ForAnnotation.REQUIRED)
    @Min(value = Utils.Const.MIN_YEAR)
    @Max(value = Utils.Const.THIS_YEAR)
    private Short birthYear;

}
