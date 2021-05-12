
-- WARNING!!! : SCHEMA WILL BE RESET.
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE public.users
(
    id       serial                 NOT NULL,
    email    character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE public.candidates
(
    id             integer                NOT NULL,
    first_name     character varying(100) NOT NULL,
    last_name      character varying(100) NOT NULL,
    nationality_id character(11)[]        NOT NULL,
    birth_year     smallint               NOT NULL,
    CONSTRAINT pk_candidates PRIMARY KEY (id),
    CONSTRAINT uk_candidates_nationality_id UNIQUE (nationality_id),
    CONSTRAINT fk_candidates_id_users_id FOREIGN KEY (id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.employers
(
    id           integer                NOT NULL,
    company_name character varying(100) NOT NULL,
    web_site     character varying(200) NOT NULL,
    phone_number character varying(15)  NOT NULL,
    CONSTRAINT pk_employers PRIMARY KEY (id),
    CONSTRAINT fk_employers_id_users_id FOREIGN KEY (id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.system_employees
(
    id         integer                NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name  character varying(100) NOT NULL,
    CONSTRAINT pk_system_employees PRIMARY KEY (id),
    CONSTRAINT fk_system_employees_id_users_id FOREIGN KEY (id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.positions
(
    id     integer                NOT NULL,
    title  character varying(100) NOT NULL,
    detail character varying(200) NOT NULL,
    CONSTRAINT pk_positions PRIMARY KEY (id),
    CONSTRAINT uk_positions_title UNIQUE (title)
);

CREATE TABLE public.employers_verifications
(
    id                       integer NOT NULL,
    is_system_verified       boolean NOT NULL DEFAULT False,
    is_email_verified        boolean NOT NULL DEFAULT False,
    system_verification_date date,
    email_verification_date  date,
    CONSTRAINT pk_employers_verifications PRIMARY KEY (id),
    CONSTRAINT fk_employers_verifications_id_employers_id FOREIGN KEY (id)
        REFERENCES public.employers (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.candidates_verifications
(
    id                      integer NOT NULL,
    is_email_verified       boolean NOT NULL DEFAULT False,
    email_verification_date boolean,
    CONSTRAINT pk_candidates_verifications PRIMARY KEY (id),
    CONSTRAINT fk_candidates_verifications_id_candidates_id FOREIGN KEY (id)
        REFERENCES public.candidates (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);