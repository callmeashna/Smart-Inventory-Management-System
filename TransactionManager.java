import java.io.*;
import java.util.*;
import java.time.*;

public class TransactionManager {
    private List<Transaction> transactions = new ArrayList<>();
    private final String FILE = "data/transactions.txt";
    private InventoryManager invRef;

    public TransactionManager(InventoryManager invRef) {
        this.invRef = invRef;
    }

    public void loadTransactions() {
        transactions.clear();
        try (BufferedReader br = new BufferedReader(new FileReader(FILE))) {
            String line;
            while ((line = br.readLine()) != null)
                transactions.add(Transaction.fromCSV(line));
        } catch (IOException e) {
            System.out.println("No transaction file found.");
        }
    }

    public void saveTransactions() {
        try (PrintWriter pw = new PrintWriter(new FileWriter(FILE))) {
            for (Transaction t : transactions) pw.println(t.toCSV());
        } catch (IOException e) {
            System.out.println("Error saving transactions!");
        }
    }

    public void checkoutItem(String userId, String itemId, int days) {
        try {
            Item item = invRef.searchItemById(itemId);
            if (item != null && item.getQuantity() > 0) {
                item.setQuantity(item.getQuantity() - 1);
                invRef.saveItems();
                String txId = "T" + System.currentTimeMillis();
                Transaction tx = new Transaction(txId, userId, itemId, LocalDate.now(), LocalDate.now().plusDays(days));
                transactions.add(tx);
                saveTransactions();
                System.out.println("\033[1;32mItem checked out successfully! ID: " + txId + "\033[0m");
                System.out.println("Remaining quantity: " + item.getQuantity());
            } else {
                System.out.println("\033[1;31mItem unavailable!\033[0m");
            }
        } catch (Exception e) {
            SimpleLogger.log(e);
            System.out.println("An error occurred during checkout. See logs/error.log");
        }
    }

    // Return an unmodifiable list of transactions for reporting
    public List<Transaction> getTransactions() {
        return Collections.unmodifiableList(transactions);
    }
}
