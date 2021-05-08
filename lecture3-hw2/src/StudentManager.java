public class StudentManager extends UserManager {

    public void addToLearning(Student student, String course) {
        String[] newLearning = new String[student.getLearning().length + 1];
        for (int i = 0; i < newLearning.length - 1; i++) {
            newLearning[i] = student.getLearning()[i];
        }
        newLearning[newLearning.length - 1] = course;

        student.setLearning(newLearning);

        System.out.println(student.getName() + " has start learning to " + course + " course.");
    }

    public void addToEnrolled(Student student, String course) {
        String[] newEnrolled = new String[student.getEnrolled().length + 1];
        for (int i = 0; i < newEnrolled.length - 1; i++) {
            newEnrolled[i] = student.getEnrolled()[i];
        }
        newEnrolled[newEnrolled.length - 1] = course;

        student.setEnrolled(newEnrolled);

        System.out.println(student.getName() + " has enrolled to " + course + " course.");
    }

    public void addToCompleted(Student student, String course) {
        String[] newCompleted = new String[student.getCompleted().length + 1];
        for (int i = 0; i < newCompleted.length - 1; i++) {
            newCompleted[i] = student.getCompleted()[i];
        }
        newCompleted[newCompleted.length - 1] = course;

        student.setCompleted(newCompleted);

        System.out.println(student.getName() + " has completed to " + course + " course.");
    }

}
