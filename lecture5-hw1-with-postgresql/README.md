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

###### ────────────────────────────────────────────────
#### I will ask something, Is there any different and more efficient way to take information that if email caught to unique key constraint in the database. (Please See. [UserManager](https://github.com/CosmicDust19/kodlama.io-javacamp/blob/master/lecture5-hw1-with-postgresql/src/business/concretes/UserManager.java) Row: 44 and 72)
###### We can contact via [LinkedIn](https://www.linkedin.com/in/semih-kayan/) or Discord: CosmicDust#4917
