package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.entities.UserAddDto;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SystemEmployeesAddDto extends UserAddDto {

    @NotBlank(message = MSGs.ForAnnotation.EMPTY)
    @Size(min = Utils.Const.MIN_FN, max = Utils.Const.MAX_FN)
    private String firstName;

    @NotBlank(message = MSGs.ForAnnotation.EMPTY)
    @Size(min = Utils.Const.MIN_LN, max = Utils.Const.MAX_LN)
    private String lastName;

}
