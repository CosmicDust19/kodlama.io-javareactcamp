package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.entities.UserAddDto;
import com.finalproject.hrmsbackend.core.utilities.Msg;
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
public class SystemEmployeeAddDto extends UserAddDto {

    @NotBlank(message = Msg.Annotation.REQUIRED)
    @Size(min = Utils.Const.MIN_FN, max = Utils.Const.MAX_FN, message = Msg.Annotation.SIZE)
    private String firstName;

    @NotBlank(message = Msg.Annotation.REQUIRED)
    @Size(min = Utils.Const.MIN_LN, max = Utils.Const.MAX_LN, message = Msg.Annotation.SIZE)
    private String lastName;

}
