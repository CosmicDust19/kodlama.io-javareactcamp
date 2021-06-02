-- WARNING!!! : SCHEMA WILL BE RESET.
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE public.positions
(
    id    smallint               NOT NULL,
    title character varying(100) NOT NULL,
    CONSTRAINT pk_positions PRIMARY KEY (id),
    CONSTRAINT uk_positions_title UNIQUE (title)
);

CREATE TABLE public.cities
(
    id   smallint              NOT NULL,
    name character varying(50) NOT NULL,
    CONSTRAINT pk_cities PRIMARY KEY (id),
    CONSTRAINT uk_cities_name UNIQUE (name)
);

CREATE TABLE public.languages
(
    id   smallint              NOT NULL,
    name character varying(50) NOT NULL,
    CONSTRAINT pk_languages PRIMARY KEY (id),
    CONSTRAINT uk_languages_name UNIQUE (name)
);

CREATE TABLE public.software_knowledge
(
    id   smallint               NOT NULL,
    name character varying(100) NOT NULL,
    CONSTRAINT pk_software_knowledge PRIMARY KEY (id),
    CONSTRAINT uk_software_knowledge_name UNIQUE (name)
);

CREATE TABLE public.schools
(
    id   integer                NOT NULL,
    name character varying(100) NOT NULL,
    CONSTRAINT pk_schools PRIMARY KEY (id),
    CONSTRAINT uk_schools_name UNIQUE (name)
);

CREATE TABLE public.departments
(
    id   smallint               NOT NULL,
    name character varying(100) NOT NULL,
    CONSTRAINT pk_departments PRIMARY KEY (id),
    CONSTRAINT uk_departments_name UNIQUE (name)
);

CREATE TABLE public.users
(
    id                integer                        NOT NULL,
    email             character varying(100)         NOT NULL,
    password          character varying(100)         NOT NULL,
    is_email_verified boolean                        NOT NULL DEFAULT FALSE,
    created_at        timestamp(0) without time zone NOT NULL DEFAULT current_timestamp,
    last_modified_at  timestamp(0) without time zone,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE public.system_employees
(
    user_id    integer               NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name  character varying(50) NOT NULL,
    CONSTRAINT pk_system_employees PRIMARY KEY (user_id),
    CONSTRAINT fk_system_employees_id_users_id FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
);

CREATE TABLE public.candidates
(
    user_id               integer               NOT NULL,
    first_name            character varying(50) NOT NULL,
    last_name             character varying(50) NOT NULL,
    nationality_id        character varying(11) NOT NULL,
    birth_year            smallint              NOT NULL,
    github_account_link   char varying(100),
    linkedin_account_link char varying(100),
    CONSTRAINT pk_candidates PRIMARY KEY (user_id),
    CONSTRAINT uk_candidates_nationality_id UNIQUE (nationality_id),
    CONSTRAINT fk_candidates_candidate_id_users_id FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
);

CREATE TABLE public.candidates_schools
(
    id                integer  NOT NULL,
    candidate_id      integer  NOT NULL,
    school_id         integer  NOT NULL,
    department_id     smallint NOT NULL,
    school_start_year smallint NOT NULL,
    graduation_year   smallint,
    CONSTRAINT pk_candidates_schools PRIMARY KEY (id),
    CONSTRAINT uk_candidates_schools_candidate_school_department UNIQUE (candidate_id, school_id, department_id),
    CONSTRAINT fk_candidates_schools_school_id FOREIGN KEY (school_id)
        REFERENCES public.schools (id),
    CONSTRAINT fk_candidates_schools_department_id FOREIGN KEY (department_id)
        REFERENCES public.departments (id)
);

CREATE TABLE public.candidates_languages
(
    id             integer         NOT NULL,
    candidate_id   integer         NOT NULL,
    language_id    smallint        NOT NULL,
    language_level char varying(2) NOT NULL,
    CONSTRAINT pk_candidates_languages PRIMARY KEY (id),
    CONSTRAINT uk_candidates_languages_candidate_language UNIQUE (candidate_id, language_id),
    CONSTRAINT fk_candidates_languages_candidate_id FOREIGN KEY (candidate_id)
        REFERENCES public.candidates (user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_languages_language_id FOREIGN KEY (language_id)
        REFERENCES public.languages (id)
);

CREATE TABLE public.candidates_software_knowledge
(
    id                    integer  NOT NULL,
    candidates_id         integer  NOT NULL,
    software_knowledge_id smallint NOT NULL,
    CONSTRAINT pk_candidates_software_knowledge PRIMARY KEY (id),
    CONSTRAINT uk_candidates_software_knowledge_candidates_sk UNIQUE (candidates_id, software_knowledge_id),
    CONSTRAINT fk_candidates_software_knowledge_candidates_id FOREIGN KEY (candidates_id)
        REFERENCES public.candidates (user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_sk_sk_id FOREIGN KEY (software_knowledge_id)
        REFERENCES public.software_knowledge (id)
);

CREATE TABLE public.candidates_job_experiences
(
    id           integer                NOT NULL,
    candidate_id integer                NOT NULL,
    workplace    character varying(100) NOT NULL,
    position_id  smallint               NOT NULL,
    start_year   smallint               NOT NULL,
    quit_year    smallint,
    CONSTRAINT pk_candidates_job_experiences PRIMARY KEY (id),
    CONSTRAINT uk_candidates_job_experiences_candidate_workplace_position UNIQUE (candidate_id, workplace, position_id),
    CONSTRAINT fk_candidates_job_experiences_candidate_id FOREIGN KEY (candidate_id)
        REFERENCES public.candidates (user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_job_experiences_position_id FOREIGN KEY (position_id)
        REFERENCES public.positions (id)
);

CREATE TABLE public.candidates_images
(
    id           integer NOT NULL,
    candidate_id integer NOT NULL,
    image_url    character varying(100),
    CONSTRAINT pk_images PRIMARY KEY (id),
    CONSTRAINT fk_images_candidate_id FOREIGN KEY (candidate_id)
        REFERENCES public.candidates (user_id)
        ON DELETE CASCADE
);

CREATE TABLE public.candidates_cvs
(
    id               integer                        NOT NULL,
    candidate_id     integer                        NOT NULL,
    cover_letter     char varying(200)              NOT NULL,
    created_at       timestamp(0) without time zone NOT NULL DEFAULT current_timestamp,
    last_modified_at timestamp(0) without time zone,
    CONSTRAINT pk_candidates_cvs PRIMARY KEY (id),
    CONSTRAINT fk_candidates_cvs_candidate_id FOREIGN KEY (candidate_id)
        REFERENCES public.candidates (user_id)
        ON DELETE CASCADE
);

CREATE TABLE public.candidates_cvs_schools
(
    cv_id               integer NOT NULL,
    candidate_school_id integer NOT NULL,
    CONSTRAINT pk_candidates_cvs_schools PRIMARY KEY (cv_id, candidate_school_id),
    CONSTRAINT fk_candidates_cvs_schools_cv_id FOREIGN KEY (cv_id)
        REFERENCES public.candidates_cvs (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_cvs_schools_candidate_school_id FOREIGN KEY (candidate_school_id)
        REFERENCES public.candidates_schools (id)
);

CREATE TABLE public.candidates_cvs_languages
(
    cv_id                 integer NOT NULL,
    candidate_language_id integer NOT NULL,
    CONSTRAINT pk_candidates_cvs_languages PRIMARY KEY (cv_id, candidate_language_id),
    CONSTRAINT fk_candidates_cvs_languages_cv_id FOREIGN KEY (cv_id)
        REFERENCES public.candidates_cvs (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_cvs_languages_candidate_language_id FOREIGN KEY (candidate_language_id)
        REFERENCES public.candidates_languages (id)
);

CREATE TABLE public.candidates_cvs_job_experiences
(
    cv_id                integer NOT NULL,
    candidate_job_exp_id integer NOT NULL,
    CONSTRAINT pk_candidates_cvs_job_experiences PRIMARY KEY (cv_id, candidate_job_exp_id),
    CONSTRAINT fk_candidates_cvs_job_experiences_cv_id FOREIGN KEY (cv_id)
        REFERENCES public.candidates_cvs (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_cvs_job_experiences_candidate_job_exp_id FOREIGN KEY (candidate_job_exp_id)
        REFERENCES public.candidates_job_experiences (id)
);

CREATE TABLE public.candidates_cvs_software_knowledge
(
    cv_id            integer NOT NULL,
    candidates_sk_id integer NOT NULL,
    CONSTRAINT pk_candidates_cvs_software_knowledge PRIMARY KEY (cv_id, candidates_sk_id),
    CONSTRAINT fk_candidates_cvs_software_knowledge_cv_id FOREIGN KEY (cv_id)
        REFERENCES public.candidates_cvs (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_cvs_software_knowledge_candidates_sk_id FOREIGN KEY (candidates_sk_id)
        REFERENCES public.candidates_software_knowledge (id)
);

CREATE TABLE public.employers
(
    user_id            integer                NOT NULL,
    company_name       character varying(100) NOT NULL,
    website            character varying(200) NOT NULL,
    phone_number       character varying(22)  NOT NULL,
    is_system_verified boolean                NOT NULL DEFAULT FALSE,
    CONSTRAINT pk_employers PRIMARY KEY (user_id),
    CONSTRAINT uk_employers_company_name UNIQUE (company_name),
    CONSTRAINT uk_employers_website UNIQUE (website),
    CONSTRAINT fk_employers_employer_id_users_id FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
);

CREATE TABLE public.job_advertisements
(
    id                           integer                        NOT NULL,
    employer_id                  integer                        NOT NULL,
    position_id                  smallint                       NOT NULL,
    job_description              text                           NOT NULL,
    city_id                      smallint                       NOT NULL,
    min_salary                   integer                        NOT NULL,
    max_salary                   integer                        NOT NULL,
    number_of_people_to_be_hired smallint                       NOT NULL,
    application_deadline         date,
    is_active                    boolean                        NOT NULL DEFAULT TRUE,
    created_at                   timestamp(0) without time zone NOT NULL DEFAULT current_timestamp,
    last_modified_at             timestamp(0) without time zone,
    CONSTRAINT pk_job_advertisements PRIMARY KEY (id),
    CONSTRAINT uk_job_advertisements_emp_pos_desc_city UNIQUE (employer_id, position_id, job_description, city_id),
    CONSTRAINT fk_job_advertisements_employer_id FOREIGN KEY (employer_id)
        REFERENCES public.employers (user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_job_advertisements_city_id FOREIGN KEY (city_id)
        REFERENCES public.cities (id),
    CONSTRAINT fk_job_advertisements_position_id FOREIGN KEY (position_id)
        REFERENCES public.positions (id)
);

INSERT INTO positions
VALUES (1, N'Web Developer'),
       (2, N'Network Engineer'),
       (3, N'Software Engineer'),
       (5, N'Front End Developer'),
       (6, N'Java Developer'),
       (7, N'Salesforce Developer'),
       (8, N'IOS Developer'),
       (9, N'SQL Developer'),
       (10, N'Android Developer'),
       (11, N'.NET Developer'),
       (12, N'Game Developer'),
       (13, N'Machine Learning Engineer'),
       (14, N'Embedded Software Engineer'),
       (15, N'Programmer Analyst'),
       (16, N'Application Security Engineer'),
       (17, N'AWS Solutions Architect'),
       (18, N'CNC Programmer'),
       (19, N'Mulesoft Developer'),
       (20, N'Data Engineer'),
       (21, N'QA Engineer'),
       (23, N'Python Developer'),
       (24, N'JavaScript Developer'),
       (25, N'Sharepoint Developer');

INSERT INTO cities
VALUES (1, N'Adana'),
       (2, N'Adıyaman'),
       (3, N'Afyon'),
       (4, N'Ağrı'),
       (5, N'Amasya'),
       (6, N'Ankara'),
       (7, N'Antalya'),
       (8, N'Artvin'),
       (9, N'Aydın'),
       (10, N'Balıkesir'),
       (11, N'Bilecik'),
       (12, N'Bingöl'),
       (13, N'Bitlis'),
       (14, N'Bolu'),
       (15, N'Burdur'),
       (16, N'Bursa'),
       (17, N'Çanakkale'),
       (18, N'Çankırı'),
       (19, N'Çorum'),
       (20, N'Denizli'),
       (21, N'Diyarbakır'),
       (22, N'Edirne'),
       (23, N'Elazığ'),
       (24, N'Erzincan'),
       (25, N'Erzurum'),
       (26, N'Eskişehir'),
       (27, N'Gaziantep'),
       (28, N'Giresun'),
       (29, N'Gümüşhane'),
       (30, N'Hakkari'),
       (31, N'Hatay'),
       (32, N'Isparta'),
       (33, N'Mersin'),
       (34, N'İstanbul'),
       (35, N'İzmir'),
       (36, N'Kars'),
       (37, N'Kastamonu'),
       (38, N'Kayseri'),
       (39, N'Kırklareli'),
       (40, N'Kırşehir'),
       (41, N'Kocaeli'),
       (42, N'Konya'),
       (43, N'Kütahya'),
       (44, N'Malatya'),
       (45, N'Manisa'),
       (46, N'Kahramanmaraş'),
       (47, N'Mardin'),
       (48, N'Muğla'),
       (49, N'Muş'),
       (50, N'Nevşehir'),
       (51, N'Niğde'),
       (52, N'Ordu'),
       (53, N'Rize'),
       (54, N'Sakarya'),
       (55, N'Samsun'),
       (56, N'Siirt'),
       (57, N'Sinop'),
       (58, N'Sivas'),
       (59, N'Tekirdağ'),
       (60, N'Tokat'),
       (61, N'Trabzon'),
       (62, N'Tunceli'),
       (63, N'Şanlıurfa'),
       (64, N'Uşak'),
       (65, N'Van'),
       (66, N'Yozgat'),
       (67, N'Zonguldak'),
       (68, N'Aksaray'),
       (69, N'Bayburt'),
       (70, N'Karaman'),
       (71, N'Kırıkkale'),
       (72, N'Batman'),
       (73, N'Şırnak'),
       (74, N'Bartın'),
       (75, N'Ardahan'),
       (76, N'Iğdır'),
       (77, N'Yalova'),
       (78, N'Karabük'),
       (79, N'Kilis'),
       (80, N'Osmaniye'),
       (81, N'Düzce');