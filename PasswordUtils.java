import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class PasswordUtils {
    private static final SecureRandom RAND = new SecureRandom();
    private static final int ITERATIONS = 65536;
    private static final int KEY_LENGTH = 256;

    // Format: pbkdf2$iterations$saltBase64$hashBase64
    public static String hashPassword(String password) {
        try {
            byte[] salt = new byte[16];
            RAND.nextBytes(salt);
            KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
            SecretKeyFactory f = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] hash = f.generateSecret(spec).getEncoded();
            return String.format("pbkdf2$%d$%s$%s", ITERATIONS, Base64.getEncoder().encodeToString(salt), Base64.getEncoder().encodeToString(hash));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static boolean verifyPassword(String password, String stored) {
        try {
            if (stored == null || !stored.startsWith("pbkdf2$")) return false;
            String[] parts = stored.split("\\$");
            int iterations = Integer.parseInt(parts[1]);
            byte[] salt = Base64.getDecoder().decode(parts[2]);
            byte[] hash = Base64.getDecoder().decode(parts[3]);
            KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, iterations, hash.length * 8);
            SecretKeyFactory f = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] testHash = f.generateSecret(spec).getEncoded();
            if (testHash.length != hash.length) return false;
            int diff = 0;
            for (int i = 0; i < hash.length; i++) diff |= hash[i] ^ testHash[i];
            return diff == 0;
        } catch (Exception e) {
            return false;
        }
    }
}
