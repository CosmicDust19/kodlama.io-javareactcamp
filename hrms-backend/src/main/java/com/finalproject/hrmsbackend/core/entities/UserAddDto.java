package com.finalproject.hrmsbackend.core.entities;

import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAddDto {

    @NotBlank(message = MSGs.ForAnnotation.EMPTY)
    @Pattern(regexp = Utils.Const.EMAIL_REGEXP, message = MSGs.ForAnnotation.INVALID_FORMAT)
    private String email;

    @NotBlank(message = MSGs.ForAnnotation.EMPTY)
    @Size(min = Utils.Const.MIN_PW, max = Utils.Const.MAX_PW)
    private String password;

}
