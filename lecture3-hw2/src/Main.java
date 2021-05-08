public class Main {
    public static void main(String[] args) {
        Instructor instructor = new Instructor(1, "Abdurrazak Yosma", "1234", "example@gmail.com");
        Student student1 = new Student(2, "Burhanettin Yetmişbir", "12345", "example@gmail.com");
        Student student2 = new Student(3, "Murtaza Camel", "123456", "example@gmail.com");

        StudentManager studentManager = new StudentManager();
        InstructorManager instructorManager = new InstructorManager();

        instructorManager.add(instructor);
        studentManager.add(student1);
        studentManager.add(student2);

        System.out.println();
        instructorManager.addToCourses(instructor,"Java");
        instructorManager.addToCourses(instructor,"C#");

        System.out.println();
        studentManager.addToEnrolled(student1,"Java");
        studentManager.addToEnrolled(student2,"C#");


    }

}
