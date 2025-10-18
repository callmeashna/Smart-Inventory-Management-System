import java.io.*;
import java.time.LocalDate;
import java.util.List;

public class OverdueReport implements Report {
    private TransactionManager transactionManager;
    private final String REPORT_FILE = "reports/reports.txt";

    public OverdueReport(TransactionManager tm) {
        this.transactionManager = tm;
    }

    @Override
    public boolean generate() {
        try {
            new java.io.File("reports").mkdirs();
            try (PrintWriter out = new PrintWriter(new FileWriter(REPORT_FILE, true))) {
                out.println("\n--- OVERDUE REPORT (" + LocalDate.now() + ") ---");
                List<Transaction> txs = transactionManager.getTransactions();
                boolean any = false;
                for (Transaction t : txs) {
                    if (t.getReturnDate() != null && t.getReturnDate().isBefore(LocalDate.now())) {
                        any = true;
                        String line = "User: " + t.getUserId() + " | Item: " + t.getItemId() + " | Due: " + t.getReturnDate();
                        out.println(line);
                        System.out.println(line);
                    }
                }
                if (!any) {
                    out.println("(none)");
                    System.out.println("(none)");
                }
            }
            return true;
        } catch (IOException e) {
            System.out.println("Error writing overdue report.");
            return false;
        }
    }
}
