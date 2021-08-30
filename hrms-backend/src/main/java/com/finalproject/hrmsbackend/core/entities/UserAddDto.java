package com.finalproject.hrmsbackend.core.entities;

import com.finalproject.hrmsbackend.core.utilities.Msg;
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

    @NotBlank(message = Msg.Annotation.REQUIRED)
    @Pattern(regexp = Utils.Const.EMAIL_REGEXP, message = Msg.Annotation.PATTERN)
    private String email;

    @NotBlank(message = Msg.Annotation.REQUIRED)
    @Size(min = Utils.Const.MIN_PW, max = Utils.Const.MAX_PW, message = Msg.Annotation.SIZE)
    private String password;

}
