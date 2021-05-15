### If you wanna try: 

### 1) Paste this into the query tool:

######

    -- Attention! : PUBLIC SCHEMA WILL BE RESET.
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;

    CREATE TABLE public.users(
        id serial NOT NULL, first_name character varying(100) NOT NULL, 
        last_name character varying(100) NOT NULL, email 
        character varying(100) NOT NULL, 
        password character varying(100) NOT NULL, 
        CONSTRAINT pk_users PRIMARY KEY (id),
        CONSTRAINT uk_users_email UNIQUE (email)
    );

######

### 2) Add the postgre driver to your project
###### If you need, steps are in the init-postgre-driver file
### That's all...
