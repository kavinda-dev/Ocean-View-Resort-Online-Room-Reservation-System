package com.oceanview.util;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * DatabaseConnection – Singleton Pattern Implementation.
 *
 * Ensures only ONE database connection instance exists throughout
 * the application lifecycle, promoting memory efficiency and
 * controlled resource usage.
 */
public class DatabaseConnection {

    private static DatabaseConnection instance;
    private Connection connection;

    private static final String PROPERTIES_FILE = "/db.properties";

    // Private constructor – prevents external instantiation
    private DatabaseConnection() {
        try {
            Properties props = loadProperties();
            String url = props.getProperty("db.url");
            String username = props.getProperty("db.username");
            String password = props.getProperty("db.password");

            Class.forName("com.mysql.cj.jdbc.Driver");
            this.connection = DriverManager.getConnection(url, username, password);

            System.out.println("[DatabaseConnection] Connection established successfully.");
        } catch (ClassNotFoundException | SQLException | IOException e) {
            throw new RuntimeException("Failed to initialize database connection: " + e.getMessage(), e);
        }
    }

    /**
     * Returns the single instance of DatabaseConnection.
     * Uses synchronized block to ensure thread safety.
     */
    public static synchronized DatabaseConnection getInstance() {
        if (instance == null || isConnectionClosed()) {
            instance = new DatabaseConnection();
        }
        return instance;
    }

    /**
     * Returns the active JDBC Connection.
     */
    public Connection getConnection() {
        return connection;
    }

    /**
     * Checks if the current connection is closed or null.
     */
    private static boolean isConnectionClosed() {
        try {
            return instance.connection == null || instance.connection.isClosed();
        } catch (SQLException e) {
            return true;
        }
    }

    /**
     * Loads database configuration from db.properties file.
     */
    private Properties loadProperties() throws IOException {
        Properties props = new Properties();
        try (InputStream is = getClass().getResourceAsStream(PROPERTIES_FILE)) {
            if (is == null) {
                throw new IOException("Cannot find " + PROPERTIES_FILE + " in classpath.");
            }
            props.load(is);
        }
        return props;
    }

    /**
     * Closes the database connection (call on application shutdown).
     */
    public void closeConnection() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                instance = null;
                System.out.println("[DatabaseConnection] Connection closed.");
            }
        } catch (SQLException e) {
            System.err.println("[DatabaseConnection] Error closing connection: " + e.getMessage());
        }
    }
}
