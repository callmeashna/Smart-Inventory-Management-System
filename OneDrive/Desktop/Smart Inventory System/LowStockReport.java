import java.io.*;
import java.time.LocalDate;
import java.util.List;

public class LowStockReport implements Report {
    private final InventoryManager inventoryManager;
    private static final String REPORT_FILE = "reports/reports.txt";

    public LowStockReport(InventoryManager im) {
        this.inventoryManager = im;
    }

    @Override
    public boolean generate() {
        try {
            new java.io.File("reports").mkdirs();
            try (PrintWriter out = new PrintWriter(new FileWriter(REPORT_FILE, true))) {
                out.println("\n--- LOW STOCK REPORT (" + LocalDate.now() + ") ---");
                System.out.println("\033[1;33mLow Stock Items:\033[0m");

                List<Item> items = inventoryManager.getItems();
                boolean any = false;
                for (Item i : items) {
                    if (i.getQuantity() <= i.getThreshold()) {
                        any = true;
                        String line = i.getName() + " (ID: " + i.getItemId() + ") - Qty: " + i.getQuantity();
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
            System.out.println("Error writing low stock report.");
            return false;
        }
    }
}
