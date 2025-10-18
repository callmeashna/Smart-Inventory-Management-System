import java.io.*;
import java.time.LocalDate;
import java.util.*;

public class ReportManager {
    private InventoryManager inventoryManager;
    private TransactionManager transactionManager;
    private final String REPORT_FILE = "reports/reports.txt";

    public ReportManager(InventoryManager im, TransactionManager tm) {
        this.inventoryManager = im;
        this.transactionManager = tm;
    }

    public void generateLowStockReport() {
        try (PrintWriter out = new PrintWriter(new FileWriter(REPORT_FILE, true))) {
            out.println("\n--- LOW STOCK REPORT (" + LocalDate.now() + ") ---");
            System.out.println("\033[1;33mLow Stock Items:\033[0m");

            for (Item i : inventoryManager.getItems()) {
                if (i.getQuantity() <= i.getThreshold()) {
                    String line = i.getName() + " (ID: " + i.getItemId() + ") - Qty: " + i.getQuantity();
                    out.println(line);
                    System.out.println(line);
                }
            }
        } catch (IOException e) {
            System.out.println("Error writing low stock report.");
        }
    }

    public void generateOverdueReport() {
        try (PrintWriter out = new PrintWriter(new FileWriter(REPORT_FILE, true))) {
            out.println("\n--- OVERDUE REPORT (" + LocalDate.now() + ") ---");
            for (Transaction t : transactionManager.getTransactions()) {
                if (t.getReturnDate() != null && t.getReturnDate().isBefore(LocalDate.now())) {
                    String line = "User: " + t.getUserId() + " | Item: " + t.getItemId() + " | Due: " + t.getReturnDate();
                    out.println(line);
                    System.out.println(line);
                }
            }
        } catch (IOException e) {
            System.out.println("Error writing overdue report.");
        }
    }

    public void generateUsageSummary() {
        int totalTransactions = transactionManager.getTransactions().size();
        System.out.println("\033[1;34mTotal transactions so far: " + totalTransactions + "\033[0m");
    }
}
