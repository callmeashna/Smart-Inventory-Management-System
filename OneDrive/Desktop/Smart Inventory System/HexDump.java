import java.io.*;
import java.nio.file.*;

public class HexDump {
    public static void main(String[] args) throws Exception {
        for (String f : args) {
            byte[] b = Files.readAllBytes(Paths.get(f));
            System.out.print(f + ": ");
            for (int i = 0; i < Math.min(8, b.length); i++) {
                System.out.printf("%02X ", b[i]);
            }
            System.out.println();
        }
    }
}