public class InstructorManager extends UserManager {

    void addToCourses(Instructor instructor, String course) {
        String[] newCourses = new String[instructor.getCourses().length + 1];
        for (int i = 0; i < newCourses.length - 1; i++) {
            newCourses[i] = instructor.getCourses()[i];
        }
        newCourses[newCourses.length - 1] = course;

        instructor.setCourses(newCourses);

        System.out.println(instructor.getName() + " has saved as instructor of " + course + " course.");

    }
}
