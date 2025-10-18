public class Item {
    private String itemId;
    private String name;
    private int quantity;
    private String category;
    private int threshold;

    public Item(String itemId, String name, int quantity, String category, int threshold) {
        this.itemId = itemId;
        this.name = name;
        this.quantity = quantity;
        this.category = category;
        this.threshold = threshold;
    }

    public String getItemId() { return itemId; }
    public String getName() { return name; }
    public int getQuantity() { return quantity; }
    public String getCategory() { return category; }
    public int getThreshold() { return threshold; }
    public void setQuantity(int q) { quantity = q; }

    public String toCSV() { return itemId + "," + name + "," + quantity + "," + category + "," + threshold; }

    public static Item fromCSV(String csv) {
        String[] p = csv.split(",");
        return new Item(p[0], p[1], Integer.parseInt(p[2]), p[3], Integer.parseInt(p[4]));
    }
}
