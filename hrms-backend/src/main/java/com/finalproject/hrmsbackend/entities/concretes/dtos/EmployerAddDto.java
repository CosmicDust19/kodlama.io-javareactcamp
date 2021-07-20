package com.finalproject.hrmsbackend.entities.concretes.dtos;

import com.finalproject.hrmsbackend.core.entities.UserAddDto;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployerAddDto extends UserAddDto {

    @NotBlank(message = MSGs.ForAnnotation.EMPTY)
    @Size(max = Utils.Const.MAX_COMPANY_NAME)
    private String companyName;

    @NotBlank(message = MSGs.ForAnnotation.EMPTY)
    @Pattern(regexp = Utils.Const.WEBSITE_REGEXP, message = MSGs.ForAnnotation.INVALID_FORMAT)
    private String website;
    // domain extensions: https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains

    @NotBlank(message = MSGs.ForAnnotation.EMPTY)
    @Pattern(regexp = Utils.Const.PHONE_NUM_REGEXP, message = MSGs.ForAnnotation.INVALID_FORMAT)
    private String phoneNumber;

}
