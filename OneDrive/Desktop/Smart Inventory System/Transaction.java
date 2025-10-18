import java.time.LocalDate;

public class Transaction {
    private String transactionId;
    private String userId;
    private String itemId;
    private LocalDate issueDate;
    private LocalDate returnDate;

    public Transaction(String t, String u, String i, LocalDate issue, LocalDate ret) {
        this.transactionId = t; this.userId = u; this.itemId = i; this.issueDate = issue; this.returnDate = ret;
    }

    public String toCSV() { return transactionId + "," + userId + "," + itemId + "," + issueDate + "," + (returnDate != null ? returnDate : "none"); }

    public static Transaction fromCSV(String csv) {
        String[] p = csv.split(",");
        LocalDate issue = LocalDate.parse(p[3]);
        LocalDate ret = p[4].equals("none") ? null : LocalDate.parse(p[4]);
        return new Transaction(p[0], p[1], p[2], issue, ret);
    }

    public String getItemId() { return itemId; }
    public String getUserId() { return userId; }
    public LocalDate getReturnDate() { return returnDate; }
}
