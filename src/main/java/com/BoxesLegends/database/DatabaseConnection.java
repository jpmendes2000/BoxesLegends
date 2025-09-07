package com.BoxesLegends.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static DatabaseConnection instance;
    private Connection connection;
    
    private static String url = "jdbc:sqlserver://localhost:1433;databaseName=gacha_db;encrypt=true;trustServerCertificate=true";
    private static String username = "sa";
    private static String password = "Senha@12345!";

    private DatabaseConnection() throws SQLException {
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            this.connection = DriverManager.getConnection(url, username, password);
            System.out.println("✅ Conexão com banco estabelecida!");
        } catch (ClassNotFoundException ex) {
            throw new SQLException("Database driver not found", ex);
        }
    }

    public static DatabaseConnection getInstance() throws SQLException {
        if (instance == null) {
            instance = new DatabaseConnection();
        } else if (instance.getConnection().isClosed()) {
            instance = new DatabaseConnection();
        }
        return instance;
    }

    public Connection getConnection() {
        return connection;
    }
    
    // Mude para retornar boolean em vez de void
    public static boolean testConnection() {
        try {
            Connection conn = DriverManager.getConnection(url, username, password);
            boolean isValid = conn.isValid(2);
            conn.close();
            
            if (isValid) {
                System.out.println("✅ Teste de conexão bem-sucedido!");
            } else {
                System.out.println("❌ Conexão inválida!");
            }
            return isValid;
        } catch (SQLException e) {
            System.out.println("❌ Erro na conexão: " + e.getMessage());
            return false;
        }
    }
}