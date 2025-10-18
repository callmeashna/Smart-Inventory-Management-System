import java.io.*;
import java.util.*;

public class UserManager {
    private List<User> users = new ArrayList<>();
    private final String FILE = "data/users.txt";

    public void loadUsers() {
        users.clear();
        try (BufferedReader br = new BufferedReader(new FileReader(FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                users.add(User.fromCSV(line));
            }
        } catch (IOException e) {
            // No users file yet
        }
    }

    public void saveUsers() {
        try (PrintWriter pw = new PrintWriter(new FileWriter(FILE))) {
            for (User u : users) pw.println(u.toCSV());
        } catch (IOException e) { System.out.println("Error saving users"); }
    }

    public void registerUser(String id, String name, String role, String password) {
        users.add(new User(id, name, role, password));
        saveUsers();
        System.out.println("User registered");
    }

    public User login(String id, String password) {
        for (User u : users) if (u.getId().equals(id) && u.getPassword().equals(password)) return u;
        return null;
    }
}
