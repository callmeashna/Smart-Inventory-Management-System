import java.io.*;
import java.util.*;

public class InventoryManager {
    private List<Item> items = new ArrayList<>();
    private final String FILE = "data/items.txt";

    public void loadItems() {
        items.clear();
        try (BufferedReader br = new BufferedReader(new FileReader(FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                items.add(Item.fromCSV(line));
            }
        } catch (IOException e) {
            System.out.println("No items file found, starting fresh.");
        }
    }

    public void saveItems() {
        try (PrintWriter pw = new PrintWriter(new FileWriter(FILE))) {
            for (Item i : items) pw.println(i.toCSV());
        } catch (IOException e) {
            System.out.println("Error saving items.");
        }
    }

    public void addItem(Item item) {
        items.add(item);
        saveItems();
        System.out.println("\033[1;32mItem added successfully!\033[0m");
    }

    public void viewItems() {
        System.out.println("\033[1;36m--- Available Items ---\033[0m");
        for (Item i : items)
            System.out.printf("%s | %s | %s | Qty: %d\n", i.getItemId(), i.getName(), i.getCategory(), i.getQuantity());
    }

    public Item searchItemById(String id) {
        for (Item i : items) if (i.getItemId().equals(id)) return i;
        return null;
    }

    // Expose items for reporting and other modules (read-only)
    public List<Item> getItems() {
        return Collections.unmodifiableList(items);
    }
}
