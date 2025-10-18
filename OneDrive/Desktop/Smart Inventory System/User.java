public class User {
    private String id;
    private String name;
    private String role;
    private String password;

    public User(String id, String name, String role, String password) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.password = password;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getPassword() { return password; }

    // CSV formatting
    public String toCSV() { return id + "," + name + "," + role + "," + password; }

    public static User fromCSV(String csv) {
        String[] parts = csv.split(",");
        return new User(parts[0], parts[1], parts[2], parts[3]);
    }
}
