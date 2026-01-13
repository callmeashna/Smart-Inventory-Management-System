import java.util.*;

public class AppMain {
    private static ReportManager rm;
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
    UserManager um = new UserManager();
    InventoryManager im = new InventoryManager();
    TransactionManager tm = new TransactionManager(im);
    rm = new ReportManager(im, tm);

        um.loadUsers(); im.loadItems(); tm.loadTransactions();

        System.out.println("\033[1;34mWelcome to Smart Inventory Management System\033[0m");

        while (true) {
            System.out.println("\n1. Login\n2. Register\n3. Exit");
            System.out.print("Choice: ");
            int c = readInt(sc);
            if (c == -1) System.exit(0);

            if (c == 1) {
                System.out.print("User ID: "); String uid = sc.nextLine();
                System.out.print("Password: "); String pass = sc.nextLine();
                User u = um.login(uid, pass);
                if (u == null) System.out.println("\033[1;31mInvalid credentials!\033[0m");
                else menu(u, im, tm, sc);
            } else if (c == 2) {
                System.out.print("New ID: "); String id = sc.nextLine();
                System.out.print("Name: "); String name = sc.nextLine();
                System.out.print("Role (student/admin): "); String role = sc.nextLine();
                System.out.print("Password: "); String pass = sc.nextLine();
                um.registerUser(id, name, role, pass);
            } else System.exit(0);
        }
    }

    static void menu(User u, InventoryManager im, TransactionManager tm, Scanner sc) {
        if (u.getRole().equalsIgnoreCase("admin")) {
            while (true) {
                System.out.println("\n1. View Items\n2. Add Item\n3. Generate Reports\n4. Logout");
                System.out.print("Choice: "); int c = readInt(sc);
                if (c == -1) return;
                if (c == 1) im.viewItems();
                else if (c == 2) {
                    System.out.print("Item ID: "); String id = sc.nextLine();
                    System.out.print("Name: "); String name = sc.nextLine();
                    System.out.print("Qty: "); int q = readInt(sc);
                    System.out.print("Category: "); String cat = sc.nextLine();
                    System.out.print("Threshold: "); int th = readInt(sc);
                    im.addItem(new Item(id, name, q, cat, th));
                } else if (c == 3) {
                    rm.generateAllReports();
                } else return;
            }
        } else {
            while (true) {
                System.out.println("\n1. View Items\n2. Borrow Item\n3. Logout");
                System.out.print("Choice: "); int c = readInt(sc);
                if (c == -1) return;
                if (c == 1) im.viewItems();
                else if (c == 2) {
                    System.out.print("Enter Item ID: "); String id = sc.nextLine();
                    System.out.print("Duration (days): "); int days = readInt(sc);
                    tm.checkoutItem(u.getId(), id, days);
                } else return;
            }
        }
    }

    // Helper to read an integer safely from Scanner (reads full line and parses)
    private static int readInt(Scanner sc) {
        while (true) {
            String line;
            try {
                line = sc.nextLine();
            } catch (java.util.NoSuchElementException e) {
                return -1; // signal EOF to callers
            }
            try {
                return Integer.parseInt(line.trim());
            } catch (NumberFormatException e) {
                System.out.print("Please enter a valid number: ");
            }
        }
    }
}
