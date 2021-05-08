
public class Student extends User{
    private String[] learning = new String[0];
    private String[] enrolled = new String[0];
    private String[] completed = new String[0];

    Student(){

    }

    public Student(int id, String name, String password, String email){
        super(id, name, password, email);
    }

    public String[] getLearning() {
        return learning;
    }

    public void setLearning(String[] learning) {
        this.learning = learning;
    }


    public String[] getEnrolled() {
        return enrolled;
    }

    public void setEnrolled(String[] enrolled) {
        this.enrolled = enrolled;
    }

    public String[] getCompleted() {
        return completed;
    }

    public void setCompleted(String[] completed) {
        this.completed = completed;
    }
}
