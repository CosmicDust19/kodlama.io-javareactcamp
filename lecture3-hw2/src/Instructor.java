public class Instructor extends User {
    private String[] courses = new String[0];

    public Instructor(){

    }

    public Instructor(int id, String name, String password, String email) {
        super(id, name, password, email);
    }

    public String[] getCourses() {
        return courses;
    }

    public void setCourses(String[] courses) {
        this.courses = courses;
    }
}
