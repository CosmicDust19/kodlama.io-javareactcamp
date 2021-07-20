package com.finalproject.hrmsbackend;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@EnableSwagger2
@EnableJpaAuditing
public class HrmsBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HrmsBackendApplication.class, args);

        new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "cloudinary73",
                "api_key", "679978937925928",
                "api_secret", "UqnesSlyURtTNFsomM0H_x4INNU",
                "secure", true));
    }

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.finalproject.hrmsbackend"))
                .build();
    }

}
