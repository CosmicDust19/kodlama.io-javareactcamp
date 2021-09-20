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
    id               integer                        NOT NULL,
    email            character varying(100)         NOT NULL,
    password         character varying(100)         NOT NULL,
    email_verified   boolean                        NOT NULL DEFAULT FALSE,
    profile_img_id   int,
    created_at       timestamp(0) without time zone NOT NULL DEFAULT current_timestamp,
    last_modified_at timestamp(0) without time zone,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE public.images
(
    id        integer                NOT NULL,
    public_id character varying(30)  NOT NULL,
    name      character varying(100),
    user_id   integer                NOT NULL,
    image_url character varying(150) NOT NULL,
    width     smallint,
    height    smallint,
    CONSTRAINT pk_images PRIMARY KEY (id),
    CONSTRAINT fk_images_user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
);

ALTER TABLE users
    ADD CONSTRAINT fk_users_profile_img_id
        FOREIGN KEY (profile_img_id) REFERENCES public.images (id);

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

CREATE TABLE public.employers_updates
(
    employer_update_id integer NOT NULL,
    email              character varying(100),
    company_name       character varying(100),
    website            character varying(200),
    phone_number       character varying(22),
    CONSTRAINT pk_employers_updates PRIMARY KEY (employer_update_id)
);

CREATE TABLE public.employers
(
    user_id         integer                NOT NULL,
    company_name    character varying(100) NOT NULL,
    website         character varying(200) NOT NULL,
    phone_number    character varying(22)  NOT NULL,
    update_id       integer,
    verified        boolean                NOT NULL DEFAULT FALSE,
    rejected        boolean                         DEFAULT NULL,
    update_verified boolean                         DEFAULT NULL,
    CONSTRAINT pk_employers PRIMARY KEY (user_id),
    CONSTRAINT uk_employers_company_name UNIQUE (company_name),
    CONSTRAINT uk_employers_website UNIQUE (website),
    CONSTRAINT fk_employers_employer_id_users_id FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_employers_update_id_employers_update_id FOREIGN KEY (update_id)
        REFERENCES public.employers_updates (employer_update_id)
);

CREATE TABLE public.job_advertisements_update
(
    job_adv_update_id integer,
    employer_id       integer          NOT NULL,
    position_id       smallint         NOT NULL,
    job_description   text             NOT NULL,
    city_id           smallint         NOT NULL,
    min_salary        integer,
    max_salary        integer,
    open_positions    smallint         NOT NULL,
    work_model        char varying(20) NOT NULL,
    work_time         char varying(20) NOT NULL,
    deadline          date,
    CONSTRAINT pk_job_advertisements_update PRIMARY KEY (job_adv_update_id),
    CONSTRAINT uk_job_advertisement_updates_emp_pos_desc_city UNIQUE (employer_id, position_id, job_description, city_id),
    CONSTRAINT fk_job_advertisements_employer_id FOREIGN KEY (employer_id)
        REFERENCES public.employers (user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_job_advertisements_city_id FOREIGN KEY (city_id)
        REFERENCES public.cities (id),
    CONSTRAINT fk_job_advertisements_position_id FOREIGN KEY (position_id)
        REFERENCES public.positions (id)
);

CREATE TABLE public.job_advertisements
(
    id               integer                        NOT NULL,
    employer_id      integer                        NOT NULL,
    position_id      smallint                       NOT NULL,
    job_description  text                           NOT NULL,
    city_id          smallint                       NOT NULL,
    min_salary       integer,
    max_salary       integer,
    open_positions   smallint                       NOT NULL,
    work_model       char varying(20)               NOT NULL,
    work_time        char varying(20)               NOT NULL,
    deadline         date,
    update_id        integer,
    active           boolean                        NOT NULL DEFAULT TRUE,
    verified         boolean                        NOT NULL DEFAULT FALSE,
    rejected         boolean                                 DEFAULT NULL,
    update_verified  boolean                                 DEFAULT NULL,
    created_at       timestamp(0) without time zone NOT NULL DEFAULT current_timestamp,
    last_modified_at timestamp(0) without time zone,
    CONSTRAINT pk_job_advertisements PRIMARY KEY (id),
    CONSTRAINT uk_job_advertisements_emp_pos_desc_city UNIQUE (employer_id, position_id, job_description, city_id),
    CONSTRAINT fk_job_advertisements_employer_id FOREIGN KEY (employer_id)
        REFERENCES public.employers (user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_job_advertisements_city_id FOREIGN KEY (city_id)
        REFERENCES public.cities (id),
    CONSTRAINT fk_job_advertisements_position_id FOREIGN KEY (position_id)
        REFERENCES public.positions (id),
    CONSTRAINT fk_job_adv_update_id_job_adv_id FOREIGN KEY (update_id)
        REFERENCES public.job_advertisements_update (job_adv_update_id)
);

CREATE TABLE public.candidates
(
    user_id          integer               NOT NULL,
    first_name       character varying(50) NOT NULL,
    last_name        character varying(50) NOT NULL,
    nationality_id   character varying(11) NOT NULL,
    birth_year       smallint              NOT NULL,
    github_account   char varying(100),
    linkedin_account char varying(100),
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
    id              integer  NOT NULL,
    candidate_id    integer  NOT NULL,
    school_id       integer  NOT NULL,
    department_id   smallint NOT NULL,
    start_year      smallint NOT NULL,
    graduation_year smallint,
    CONSTRAINT pk_candidates_schools PRIMARY KEY (id),
    CONSTRAINT uk_candidates_schools_candidate_school_department UNIQUE (candidate_id, school_id, department_id),
    CONSTRAINT fk_candidates_schools_candidate_id FOREIGN KEY (candidate_id)
        REFERENCES public.candidates (user_id)
        ON DELETE CASCADE,
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

CREATE TABLE public.cvs
(
    id               integer                        NOT NULL,
    title            char varying(50)               NOT NULL,
    candidate_id     integer                        NOT NULL,
    cover_letter     char varying(1000),
    img_id           integer,
    created_at       timestamp(0) without time zone NOT NULL DEFAULT current_timestamp,
    last_modified_at timestamp(0) without time zone,
    CONSTRAINT pk_candidates_cvs PRIMARY KEY (id),
    CONSTRAINT fk_candidates_cvs_candidate_id FOREIGN KEY (candidate_id)
        REFERENCES public.candidates (user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_cvs_img_id
        FOREIGN KEY (img_id) REFERENCES public.images (id)
);

CREATE TABLE public.cvs_schools
(
    cv_id               integer NOT NULL,
    candidate_school_id integer NOT NULL,
    CONSTRAINT pk_candidates_cvs_schools PRIMARY KEY (cv_id, candidate_school_id),
    CONSTRAINT fk_candidates_cvs_schools_cv_id FOREIGN KEY (cv_id)
        REFERENCES public.cvs (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_cvs_schools_candidate_school_id FOREIGN KEY (candidate_school_id)
        REFERENCES public.candidates_schools (id)
        ON DELETE CASCADE
);

CREATE TABLE public.cvs_languages
(
    cv_id                 integer NOT NULL,
    candidate_language_id integer NOT NULL,
    CONSTRAINT pk_candidates_cvs_languages PRIMARY KEY (cv_id, candidate_language_id),
    CONSTRAINT fk_candidates_cvs_languages_cv_id FOREIGN KEY (cv_id)
        REFERENCES public.cvs (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_cvs_languages_candidate_language_id FOREIGN KEY (candidate_language_id)
        REFERENCES public.candidates_languages (id)
        ON DELETE CASCADE
);

CREATE TABLE public.cvs_job_experiences
(
    cv_id                integer NOT NULL,
    candidate_job_exp_id integer NOT NULL,
    CONSTRAINT pk_candidates_cvs_job_experiences PRIMARY KEY (cv_id, candidate_job_exp_id),
    CONSTRAINT fk_candidates_cvs_job_experiences_cv_id FOREIGN KEY (cv_id)
        REFERENCES public.cvs (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_cvs_job_experiences_candidate_job_exp_id FOREIGN KEY (candidate_job_exp_id)
        REFERENCES public.candidates_job_experiences (id)
        ON DELETE CASCADE
);

CREATE TABLE public.cvs_skills
(
    cv_id              integer NOT NULL,
    candidate_skill_id integer NOT NULL,
    CONSTRAINT pk_candidates_cvs_skills PRIMARY KEY (cv_id, candidate_skill_id),
    CONSTRAINT fk_candidates_cvs_skills_cv_id FOREIGN KEY (cv_id)
        REFERENCES public.cvs (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_cvs_skills_candidates_sk_id FOREIGN KEY (candidate_skill_id)
        REFERENCES public.candidates_skills (id)
        ON DELETE CASCADE
);

CREATE TABLE public.candidates_favorite_job_advertisements
(
    candidate_id         integer NOT NULL,
    job_advertisement_id integer NOT NULL,
    CONSTRAINT pk_candidates_favorite_job_advertisements PRIMARY KEY (candidate_id, job_advertisement_id),
    CONSTRAINT fk_candidates_favorite_job_adverts_candidate_id FOREIGN KEY (candidate_id)
        REFERENCES public.candidates (user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidates_favorite_job_adverts_job_advertisement_id FOREIGN KEY (job_advertisement_id)
        REFERENCES public.job_advertisements (id)
        ON DELETE CASCADE
);

INSERT INTO schools
VALUES (1, 'Akdeniz University'),
       (2, 'Aksaray University'),
       (3, 'Anadolu University'),
       (4, 'Ankara Medipol University'),
       (5, 'Ankara University'),
       (6, 'Atilim University'),
       (7, 'Bahcesehir University'),
       (8, 'Baskent University'),
       (9, 'Bogazici University'),
       (10, 'Bursa Technical University'),
       (11, 'Bursa Uludag University'),
       (12, 'Canakkale Onsekiz Mart University'),
       (13, 'Cankaya University'),
       (14, 'Nine September University'),
       (15, 'Duzce University'),
       (16, 'Ege University'),
       (17, 'Erciyes University'),
       (18, 'Erzurum Technical University'),
       (19, 'Eskisehir Osmangazi University'),
       (20, 'Eskisehir Technical University'),
       (21, 'Firat University'),
       (22, 'Galatasaray University'),
       (23, 'Gazi University'),
       (24, 'Gebze Technical University'),
       (25, 'Gumushane University'),
       (26, 'Hacettepe University'),
       (27, 'Ihsan Dogramacı Bilkent University'),
       (28, 'Istanbul Kultur University'),
       (29, 'Istanbul Kent University'),
       (30, 'Istanbul Medipol University'),
       (31, 'Istanbul Technical University'),
       (32, 'Istanbul University'),
       (33, 'Istinye University'),
       (34, 'Izmir Economics University'),
       (35, 'Izmir High Technology institute'),
       (36, 'Kadir Has University'),
       (37, 'Karadeniz Technical University'),
       (38, 'Kayseri University'),
       (39, 'Kto Karatay University'),
       (40, 'Maltepe University'),
       (41, 'Marmara University'),
       (42, 'Mimar Sinan Fine Arts University'),
       (43, 'Mugla Sitki Kocman University'),
       (44, 'Ondokuz Mayis University'),
       (45, 'Middle East Technical University'),
       (46, 'Ozyegin University'),
       (47, 'Pamukkale University'),
       (48, 'Sabanci University'),
       (49, 'Sakarya University'),
       (50, 'Ted University'),
       (51, 'Tobb Economics and Technology University'),
       (52, 'Yildiz Technical University'),
       (53, 'Yeditepe University');

INSERT INTO departments
VALUES (1, 'Anthropology'),
       (2, 'Architecture'),
       (3, 'Archaeology'),
       (4, 'Art History'),
       (5, 'Astronomy and Astrophysics'),
       (6, 'Biochemistry'),
       (7, 'Biology'),
       (8, 'Biomedical Engineering'),
       (9, 'Biostatistics'),
       (10, 'Chemical Engineering'),
       (11, 'Chemistry'),
       (12, 'Civil Engineering'),
       (13, 'Computer Engineering'),
       (14, 'Computer Science'),
       (15, 'Dermatology'),
       (16, 'Earth and Environmental Engineering'),
       (17, 'Economics'),
       (18, 'Electrical Engineering'),
       (19, 'Epidemiology'),
       (20, 'Film'),
       (21, 'Finance and Economics'),
       (22, 'Genetics and Development'),
       (23, 'History'),
       (24, 'Industrial Engineering'),
       (25, 'Marketing'),
       (26, 'Mathematics'),
       (27, 'Mechanical Engineering'),
       (28, 'Neurology'),
       (29, 'Philosophy'),
       (30, 'Pharmacology'),
       (31, 'Physics'),
       (32, 'Political Science'),
       (33, 'Radiology'),
       (34, 'Rehabilitation and Regenerative Medicine'),
       (35, 'Religion'),
       (36, 'Sociology'),
       (37, 'Theatre'),
       (38, 'Writing');

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

INSERT INTO users
VALUES (1, 'example1@example.com', '123456', true),
       (2, 'example2@example.com', '123456', true),
       (3, 'example3@example.com', '123456', true),
       (4, 'example4@example.com', '123456', true),
       (5, 'example5@example.com', '123456', true),
       (6, 'example6@example.com', '123456', true),
       (7, 'example7@example.com', '123456', true),
       (8, 'example8@example.com', '123456', true),
       (9, 'example9@example.com', '123456', true);

INSERT INTO system_employees
VALUES (1, 'examplefn1', 'exampleln1'),
       (2, 'examplefn2', 'exampleln2'),
       (3, 'examplefn3', 'exampleln3');

INSERT INTO candidates
VALUES (4, 'examplefn4', 'exampleln4', '12345678910', 1994),
       (5, 'examplefn5', 'exampleln5', '23456789101', 1995),
       (6, 'examplefn6', 'exampleln6', '34567891012', 1996);

UPDATE candidates
SET github_account   = 'https://github.com/CosmicDust19',
    linkedin_account = 'https://www.linkedin.com/in/semih-kayan/'
WHERE user_id = 5;

INSERT INTO employers_updates
VALUES (7, 'example7@example.com', 'example_company7', 'www.example_web_site7.com', '0 200 200 20 27'),
       (8, 'example8@example.com', 'example_company8', 'www.example_web_site8.com', '0 200 200 20 28'),
       (9, 'example9@example.com', 'example_company9', 'www.example_web_site9.com', '0 200 200 20 29');

INSERT INTO employers
VALUES (7, 'example_company7', 'www.example_web_site7.com', '0 200 200 20 27', 7, true),
       (8, 'example_company8', 'www.example_web_site8.com', '0 200 200 20 28', 8, true),
       (9, 'example_company9', 'www.example_web_site9.com', '0 200 200 20 29', 9, true);
