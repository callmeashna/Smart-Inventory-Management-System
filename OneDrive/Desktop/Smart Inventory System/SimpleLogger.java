import java.io.*;
import java.util.logging.*;

public class SimpleLogger {
    private static Logger logger = Logger.getLogger("SmartInventoryLog");

    static {
        try {
            new File("logs").mkdirs();
            FileHandler fh = new FileHandler("logs/error.log", true);
            fh.setFormatter(new SimpleFormatter());
            logger.addHandler(fh);
        } catch (IOException e) {
            System.out.println("Could not initialize logger.");
        }
    }

    public static void log(Exception e) {
        logger.log(Level.SEVERE, e.getMessage(), e);
    }
}
