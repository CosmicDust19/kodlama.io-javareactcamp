### This package is not used in this project, i write them because they may be needed later.

### If we activate these classes, we can write a container(List, Map etc.) as a @RequestBody

######
    //To activate, add this in Application.java class
    @Bean
    public FilterRegistrationBean httpServletRequestReplacedRegistration() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new HttpServletRequestReplacedFilter());
        registration.addUrlPatterns("/*");
        registration.addInitParameter("paramName", "paramValue");
        registration.setName("httpServletRequestReplacedFilter");
        registration.setOrder(1);
        return registration;
    }
######

#### source: https://www.programmersought.com/article/61991062703/