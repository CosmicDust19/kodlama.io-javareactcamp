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

CREATE TABLE public.skills
(
    id   smallint               NOT NULL,
    name character varying(100) NOT NULL,
    CONSTRAINT pk_skills PRIMARY KEY (id),
    CONSTRAINT uk_skills_name UNIQUE (name)
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
    CONSTRAINT fk_system_employees_user_id_users_id FOREIGN KEY (user_id)
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
    CONSTRAINT fk_candidates_user_id_users_id FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
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

CREATE TABLE public.candidates_skills
(
    id           integer  NOT NULL,
    candidate_id integer  NOT NULL,
    skill_id     smallint NOT NULL,
    CONSTRAINT pk_candidates_skills PRIMARY KEY (id),
    CONSTRAINT uk_candidates_skills_candidate_skill UNIQUE (candidate_id, skill_id),
    CONSTRAINT fk_candidates_skills_candidates_id FOREIGN KEY (candidate_id)
        REFERENCES public.candidates (user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_skills_id FOREIGN KEY (skill_id)
        REFERENCES public.skills (id)
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
    title            char varying(50)               NOT NULL,
    candidate_id     integer                        NOT NULL,
    cover_letter     char varying(200),
    created_at       timestamp(0) without time zone NOT NULL DEFAULT current_timestamp,
    last_modified_at timestamp(0) without time zone,
    CONSTRAINT pk_candidates_cvs PRIMARY KEY (id),
    CONSTRAINT uk_candidates_cvs_title UNIQUE (title),
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

CREATE TABLE public.candidates_cvs_skills
(
    cv_id              integer NOT NULL,
    candidate_skill_id integer NOT NULL,
    CONSTRAINT pk_candidates_cvs_skills PRIMARY KEY (cv_id, candidate_skill_id),
    CONSTRAINT fk_candidates_cvs_skills_cv_id FOREIGN KEY (cv_id)
        REFERENCES public.candidates_cvs (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_cvs_skills_candidates_sk_id FOREIGN KEY (candidate_skill_id)
        REFERENCES public.candidates_skills (id)
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
    min_salary                   integer,
    max_salary                   integer,
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

INSERT INTO languages
VALUES (1, 'Arabic'),
       (2, 'Azerbaijani'),
       (3, 'Bengali'),
       (4, 'Chinese'),
       (5, 'Czech'),
       (6, 'Dutch'),
       (7, 'English'),
       (8, 'Filipino'),
       (9, 'French'),
       (10, 'German'),
       (11, 'Greek'),
       (12, 'Hindi'),
       (13, 'Hungarian'),
       (14, 'Indonesian'),
       (15, 'Italian'),
       (16, 'Japanese'),
       (17, 'Kazakh'),
       (18, 'Korean'),
       (19, 'Polish'),
       (20, 'Portuguese'),
       (21, 'Romanian'),
       (22, 'Russian'),
       (23, 'Spanish'),
       (24, 'Swedish'),
       (25, 'Turkish'),
       (26, 'Ukrainian'),
       (27, 'Urdu'),
       (28, 'Uzbek'),
       (29, 'Vietnamese');

INSERT INTO skills
VALUES (1, 'Office suites'),
       (2, 'Python'),
       (3, 'Django '),
       (4, 'Kotlin'),
       (5, 'Java'),
       (6, 'React'),
       (7, 'JavaScript'),
       (8, 'TypeScript'),
       (9, 'Go'),
       (10, 'Swift'),
       (11, 'C#'),
       (12, 'Angular'),
       (13, 'SQL'),
       (14, 'HTML'),
       (15, 'CSS'),
       (16, 'R'),
       (17, 'Ruby'),
       (18, 'Vue');

INSERT INTO positions
VALUES (1, 'Web Developer'),
       (2, 'Network Engineer'),
       (3, 'Software Engineer'),
       (4, 'Sharepoint Developer'),
       (5, 'Front End Developer'),
       (6, 'Java Developer'),
       (7, 'Salesforce Developer'),
       (8, 'IOS Developer'),
       (9, 'SQL Developer'),
       (10, 'Android Developer'),
       (11, '.NET Developer'),
       (12, 'Game Developer'),
       (13, 'Machine Learning Engineer'),
       (14, 'Embedded Software Engineer'),
       (15, 'Programmer Analyst'),
       (16, 'Application Security Engineer'),
       (17, 'AWS Solutions Architect'),
       (18, 'CNC Programmer'),
       (19, 'Mulesoft Developer'),
       (20, 'Data Engineer'),
       (21, 'QA Engineer'),
       (23, 'Python Developer'),
       (24, 'JavaScript Developer');

INSERT INTO cities
VALUES (1, 'Adana'),
       (2, 'Adıyaman'),
       (3, 'Afyon'),
       (4, 'Ağrı'),
       (5, 'Amasya'),
       (6, 'Ankara'),
       (7, 'Antalya'),
       (8, 'Artvin'),
       (9, 'Aydın'),
       (10, 'Balıkesir'),
       (11, 'Bilecik'),
       (12, 'Bingöl'),
       (13, 'Bitlis'),
       (14, 'Bolu'),
       (15, 'Burdur'),
       (16, 'Bursa'),
       (17, 'Çanakkale'),
       (18, 'Çankırı'),
       (19, 'Çorum'),
       (20, 'Denizli'),
       (21, 'Diyarbakır'),
       (22, 'Edirne'),
       (23, 'Elazığ'),
       (24, 'Erzincan'),
       (25, 'Erzurum'),
       (26, 'Eskişehir'),
       (27, 'Gaziantep'),
       (28, 'Giresun'),
       (29, 'Gümüşhane'),
       (30, 'Hakkari'),
       (31, 'Hatay'),
       (32, 'Isparta'),
       (33, 'Mersin'),
       (34, 'İstanbul'),
       (35, 'İzmir'),
       (36, 'Kars'),
       (37, 'Kastamonu'),
       (38, 'Kayseri'),
       (39, 'Kırklareli'),
       (40, 'Kırşehir'),
       (41, 'Kocaeli'),
       (42, 'Konya'),
       (43, 'Kütahya'),
       (44, 'Malatya'),
       (45, 'Manisa'),
       (46, 'Kahramanmaraş'),
       (47, 'Mardin'),
       (48, 'Muğla'),
       (49, 'Muş'),
       (50, 'Nevşehir'),
       (51, 'Niğde'),
       (52, 'Ordu'),
       (53, 'Rize'),
       (54, 'Sakarya'),
       (55, 'Samsun'),
       (56, 'Siirt'),
       (57, 'Sinop'),
       (58, 'Sivas'),
       (59, 'Tekirdağ'),
       (60, 'Tokat'),
       (61, 'Trabzon'),
       (62, 'Tunceli'),
       (63, 'Şanlıurfa'),
       (64, 'Uşak'),
       (65, 'Van'),
       (66, 'Yozgat'),
       (67, 'Zonguldak'),
       (68, 'Aksaray'),
       (69, 'Bayburt'),
       (70, 'Karaman'),
       (71, 'Kırıkkale'),
       (72, 'Batman'),
       (73, 'Şırnak'),
       (74, 'Bartın'),
       (75, 'Ardahan'),
       (76, 'Iğdır'),
       (77, 'Yalova'),
       (78, 'Karabük'),
       (79, 'Kilis'),
       (80, 'Osmaniye'),
       (81, 'Düzce');