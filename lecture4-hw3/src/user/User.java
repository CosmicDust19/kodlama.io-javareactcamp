package user;

import misc.Entity;

import java.time.LocalDate;

public class User implements Entity {
    private int id;
    private int userNumber;
    private String firstName;
    private String lastName;
    private String nationalityId;
    private LocalDate birthDate;
    private String nickName;
    private String password;
    private String cardInfo; //representative

    public User(int id, int userNumber, String firstName, String lastName, String nationalityId, LocalDate birthDate, String nickName, String password) {
        this.id = id;
        this.userNumber = userNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nationalityId = nationalityId;
        this.birthDate = birthDate;
        this.nickName = nickName;
        this.password = password;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserNumber() {
        return userNumber;
    }

    public void setUserNumber(int userNumber) {
        this.userNumber = userNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getNationalityId() {
        return nationalityId;
    }

    public void setNationalityId(String nationalityId) {
        this.nationalityId = nationalityId;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCardInfo() {
        return cardInfo;
    }

    public void setCardInfo(String cardInfo) {
        this.cardInfo = cardInfo;
    }

}
