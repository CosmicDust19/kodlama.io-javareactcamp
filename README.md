Java - React Camp Works | **Kodlama.io**

Discord: CosmicDust#4917

### ***HRMS Project***

Back-End
[***Source Code***](https://github.com/CosmicDust19/kodlama.io-javareactcamp/tree/master/hrms-backend)
& [***SQL Script***](https://github.com/CosmicDust19/kodlama.io-javareactcamp/blob/master/hrms-backend/hrms-database.sql)
& [Server (Swagger UI)](https://javareactcamp-hrms-backend.herokuapp.com/swagger-ui.html)

![](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![](https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Front-End
[***Source Code***](https://github.com/CosmicDust19/kodlama.io-javareactcamp/tree/master/hrms-frontend)
& [Server](https://javareactcamp-hrms-frontend.herokuapp.com/)

![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

* Trial accounts
    * ###### All passwords: 123456
    * ###### Candidate: example5@example.com (4-5-6)
    * ###### Employer: example7@example.com (7-8-9)
    * ###### System Employee: example1@example.com (1-2-3)

* ###### If you have a problem, you can clear the site data or change your browser
  * ###### Clearing site data : F12(Chrome) > application > storage > clear site data button
  * ###### It happens when entering the site after a long time, because old state may be incompatible with the new one
___
About Servers

* ###### ***If no one has used the servers recently, it may take a while to start*** ⚠
* ###### ***You may get an error while starting the server, you should refresh the page -maybe 2 times- and it will start (It is all about heroku)*** ⚠
* ###### ***When the [front-end server](https://javareactcamp-hrms-frontend.herokuapp.com/) starts, the [back-end server](https://javareactcamp-hrms-backend.herokuapp.com/swagger-ui.html) also needs to be started, so you can start both of them simultaneously to wait less***
* ###### ***It takes about 1.5 minutes to start the servers***

----
**SQL Script** ([hrms-database.sql](https://github.com/CosmicDust19/kodlama.io-javareactcamp/blob/master/hrms-backend/hrms-database.sql))

**PostgreSQL ER Diagram** ([hrms-database.pgerd](https://github.com/CosmicDust19/kodlama.io-javareactcamp/blob/master/hrms-backend/hrms-database.pgerd))
###### ![](https://user-images.githubusercontent.com/74824916/133880291-faffa18a-ccb5-4abb-99f7-9ec40951ca28.png)

----
```
⚠ Info: 🟡 States  & 🟣 Users & 🔵 Pages
```
## 📄 Summary

* **Users: Candidates, employers and system employees**
* ###### 🟣 Employers
    * **Become itself(company) and its job adverts visible after system employees are confirmed**
    * **Can be managed account infos and it becomes visible after confirmation**
    * **Can be added a logo**
* ###### 🟣 Candidates
    * **Can enter their infos**
    * **Then they can add these infos to CV optionally**
    * **Can add job adverts to their favorites**
    * **Images can be added to profile and CVs**
* ###### 🟣 System Employees
    * **Can confirm job adverts' release and update; employers' sign up and update**
    * **Can manage other things like positions, cities etc. as well**
    * **Can be managed account**

---

## 📸 Some pictures

###### Detailed description is at the bottom of the page


🟡 Logged Out

![main](https://user-images.githubusercontent.com/74824916/133850522-dfab256d-905c-4e66-a472-cf099a3acc7e.png)
![login](https://user-images.githubusercontent.com/74824916/133850532-296061de-1ca8-46eb-8cb8-24f2e9fa5078.png)
![sign up candidate](https://user-images.githubusercontent.com/74824916/133850529-04a7de6e-c346-499b-9f7d-f6ff96b45db2.png)
![sign up employer](https://user-images.githubusercontent.com/74824916/133850525-40f2bd51-beec-4789-bd47-0dab06fc2e45.png)
![candidates](https://user-images.githubusercontent.com/74824916/133929326-09d9c6d4-6f71-497f-adfc-48f31f35f5ad.png)
---
🟡 Logged In

* 🟣 Candidate

![cand main](https://user-images.githubusercontent.com/74824916/133929097-16a2c50e-3198-4a7b-bf00-1b16739b4a34.png)
![cand infos](https://user-images.githubusercontent.com/74824916/133850764-097cfb01-e7a2-407e-80a0-006c126f96a0.png)
![cand infos 2](https://user-images.githubusercontent.com/74824916/133850772-5656bfd9-9cf3-4b40-b50c-9bffd700cd7e.png)
![cand cv](https://user-images.githubusercontent.com/74824916/133850771-9766162a-b4af-4eb0-923f-df658688b710.png)

---

* 🟣 Employer

![empl job advert](https://user-images.githubusercontent.com/74824916/133851204-0fd59c25-7a59-47fa-a940-c9d9ab05b2f4.png)
![empl account](https://user-images.githubusercontent.com/74824916/133851202-14288cb0-e0ee-43b5-a6bf-fd5a92a3bdd1.png)
![empl photo](https://user-images.githubusercontent.com/74824916/133851198-ed107023-3635-4504-a41e-d391e48c534d.png)

---

* 🟣 System Employee

![sys empl job adverts](https://user-images.githubusercontent.com/74824916/133851305-ac8063c3-b02b-431f-9dae-bb43862b4152.png)
![sys empl job adverts 2](https://user-images.githubusercontent.com/74824916/133851303-d846386c-01e9-44a3-bfaf-9a89a1052a99.png)
![sys empl job advert detail](https://user-images.githubusercontent.com/74824916/133851300-29b04503-c9ab-4bf8-8df1-e1a4066d06a6.png)
![sys empl employers](https://user-images.githubusercontent.com/74824916/133851299-657f4564-3a80-4e14-9803-41699fbedeb2.png)
![sys empl employer detail](https://user-images.githubusercontent.com/74824916/133851311-12d009fd-f4a7-4fce-a6f3-7c06e64fa998.png)
![sys empl other](https://user-images.githubusercontent.com/74824916/133851309-8fcb9d5f-07be-4dbe-971e-5b88cba43b4d.png)

___
## 📜 A Detailed description of the ***HRMS*** project

### 🟡 Logged Out

* ###### 🔵 Main Page (Job adverts)
    * **View job adverts**
    * **Job adverts can be filtered, sorted, paginated**
    * **Can be navigated to details**
    * **Items per page and row can be changed**
    * **Displayed fields**
        * Position title, employer, city, working model/time, creation date
    * **Filtering options**
        * All job advert fields
    * **Sorting options**
        * **By date**: Creation date, application deadline
        * **Alphabetically**: Position title, employers' company name, city name
        * **Numerically**: Min/max salary, open positions

* ###### 🔵 Users
    * **Summaries of employers and candidates are displayed and can be navigated to their details**

* ###### 🔵 Job advert detail
    * **View details of the related job advert**
    * **Can be navigated to employer's website and details**
    * **Fields**
        * Position, employer, city, working time/model, salary info(if exists), application deadline, open positions,
          job description, employer detail(table), creation date

* ###### 🔵 Employer detail
    * **View details of the related employer**
    * **Can be navigated to website and employer's job adverts**
    * **Fields**
        * Company name, email, phone number, website, job adverts(If exist)

* ###### 🔵 Candidate detail
    * **View details of the related candidate**
    * **Fields**
        * First name, last name, age, email
    * **Icons**
        * Github link and linkedin link navigate to link on click(If exist)
    * **Other fields (If exist)**
        * **Job experience** fields: Workplace, position, start year, quit year
        * **School** fields: School, department, start year, graduation year
        * **Language** fields: Language, language level (CEFR)
        * **Skills**

* ###### 🔵 Login
    * **Required fields: email, password**

* ###### 🔵 Sign up
    * **All fields should be in correct format**
    * **Required fields**
        * **Candidate**: First name, last name, nationality id, birth year, email, password(and repeat)
        * **Employer**: Company name, website, phone number, email, password(and repeat)
        * **System employee**: First name, last name, email, password(and repeat)

---

### 🟡 Logged in (Includes logged out sections)

🟣 Candidate

* ###### 🔵 Job adverts
    * **Job adverts can be added to favorites and favorites can be viewed, filtered, sorted etc.**
* ###### 🔵 CVs
    * **CVs can be added, deleted, viewed, edited etc.**
    * **Image**
        * A photo of the related candidate
        * Image options * Can be uploaded multiple images and user selects an image among them * Can be made cv photo,
          removed from cv photo and deleted
    * **Title**
        * The distinguishing feature of CV's
    * **Cover letter (optional)**
        * It can be edited-displayed (up to 1000 characters)
    * **CV's multiple fields**
        * Infos should be added infos section first to add to CVs
        * Can be added multiple and displays an "Are you sure ?" popup when wanted to be deleted
        * ***Job experiences***: Selectable from candidate's job experiences
        * ***Schools***: Selectable from candidate's schools
        * ***Languages***: Selectable from candidate's languages
        * ***Skills***: Selectable from candidate's skills
* ###### 🔵 Infos
    * **Add button activates when required fields are filled (When start year greater than end year, add button will be
      disabled.)**
    * **Displays an "Are you sure ?" popup when wanted to be deleted**
    * **There is 2 display option: Simple & Editable**
    * **Fields**
        * **Job experience** fields: Workplace, position, start year, quit year
        * **School** fields: School, department, start year, graduation year
        * **Language** fields: Language, language level (CEFR)
        * **Skills** (Only skill name)
* ###### 🔵 Account settings
    * **Profile photo options**
        * Can be uploaded multiple images(up to 1 MB) and user selects a photo among them
        * Can be made profile photo, deleted, removed from profile
    * **Displays main infos**
    * **Editable fields**
        * Email, account links, password
        * Fields should be in correct format
        * Password update and account deletion actions require old password
    * **Account can be deleted**

---
🟣 Employer

* ###### 🔵 Job adverts
    * **New job advert can be added**
        * Required fields: Position, city, working time/model, deadline, open positions, job description
        * Optional fields: Min/max salary
        * Job adverts becomes visible to other users after system employees confirmation
    * **All job adverts are manageable**
        * All fields can be updated (It'll be visible after confirmation)
        * Info labels are displayed related with selected job advert
        * Management dropdown table
            * ⇒ Deactivated or deleted(Displays an "Are you sure ?" popup when wanted to be deleted)
            * ⇒ Can be navigated to job advert detail
                * Displays requested updates in addition to all the things
* ###### 🔵 Summary
    * **A summary of the employer (To can be displayed employer's infos and requested updates simply)**
* ###### 🔵 Account settings
    * **Can be uploaded logo (system is the same as other users)**
    * **All fields requires confirmation by system employees(password excluded)**
    * **Editable fields**
        * Fields should be in correct format
        * Password update and account deletion actions requires old password
        * Email-website(Together)
            * ⇒ Email's and website's domains should be the same
        * Other fields
            * ⇒ Company name, phone number, password
    * **Account can be deleted**

---
🟣 System employee

* ###### 🔵 Job adverts (In addition to all the things
    * **In tabular form, more detailed**
    * **Included info labels**
    * **Management dropdown table options**
        * *Verify, reject, cancel verification, verify update*
        * *Can be headed to job advert details (In addition to all the things)*
            * Included management dropdown table
            * Pending updates are displayed
            * Can be navigated to employer's details and managed such as job advert
        * *Filtering options*
            * "Statuses" option in addition to all the filters
                * Statuses: Release approval, update approval, verified, rejected, active, inactive
* ###### 🔵 Employers (In addition to all the things)
    * **In tabular form**
    * **Included info labels and a management dropdown**
    * **Filtering options**
        * ***Statuses***: Sign up approval, update approval, verified, rejected
        * ***Search***: Searches in employer's company names, phone numbers, emails, websites
* ###### 🔵 Other
    * **Positions, cities, schools, departments, languages, skills can be added, displayed, paginated**
* ###### 🔵 Account settings
    * **Can be uploaded user's photos (System is the same as other users)**
    * **Editable fields**
        * Fields should be in correct format
        * Password update and account deletion actions require old password
        * First name, last name, email, password
    * **Account can be deleted**_

---