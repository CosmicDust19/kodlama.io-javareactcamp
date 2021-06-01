package com.hrms.hw.entities.concretes.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployerAddDto extends UserAddDto {

    @NotBlank(message = "This field can't be empty.")
    private String companyName;

    @NotBlank(message = "This field can't be empty.")
    @Pattern(regexp = "^[\\w\\d-_?%$+#!^><|`é]+(\\.[\\w\\d-_?%$+#!^><|`é]+)+$", message = "Please enter a website")
    private String website;

    @NotBlank(message = "This field can't be empty.")
    @Pattern(regexp = "^((\\+\\d{1,3})?0?[\\s-]?)?\\(?0?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}$", message = "Please enter a phone number")
    private String phoneNumber;
}
