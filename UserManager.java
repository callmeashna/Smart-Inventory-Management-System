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
                User u = User.fromCSV(line);
                // If password is plaintext (no pbkdf2$ prefix), upgrade it
                if (u.getPassword() != null && !u.getPassword().startsWith("pbkdf2$")) {
                    String hashed = PasswordUtils.hashPassword(u.getPassword());
                    u = new User(u.getId(), u.getName(), u.getRole(), hashed);
                    users.add(u);
                    // will rewrite file later after load
                } else {
                    users.add(u);
                }
            }
        } catch (IOException e) {
            // No users file yet
        }
        // If any users had plaintext passwords, persist the upgraded hashes
        saveUsers();
    }

    public void saveUsers() {
        try (PrintWriter pw = new PrintWriter(new FileWriter(FILE))) {
            for (User u : users) pw.println(u.toCSV());
        } catch (IOException e) {
            System.out.println("Error saving users");
        }
    }

    public void registerUser(String id, String name, String role, String password) {
        String hashed = PasswordUtils.hashPassword(password);
        users.add(new User(id, name, role, hashed));
        saveUsers();
        System.out.println("User registered");
    }

    public User login(String id, String password) {
        for (User u : users) {
            if (u.getId().equals(id) && PasswordUtils.verifyPassword(password, u.getPassword())) return u;
        }
        return null;
    }
}
