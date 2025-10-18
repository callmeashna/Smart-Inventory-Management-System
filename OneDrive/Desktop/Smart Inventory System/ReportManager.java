import java.util.*;

public class ReportManager {
    private List<Report> reports = new ArrayList<>();

    public ReportManager(InventoryManager im, TransactionManager tm) {
        // Register concrete report implementations
        reports.add(new LowStockReport(im));
        reports.add(new OverdueReport(tm));
    }

    // Generate all registered reports polymorphically
    public void generateAllReports() {
        for (Report r : reports) {
            r.generate();
        }
    }

    // Allow dynamic extension
    public void registerReport(Report r) { reports.add(r); }
}
