package com.BoxesLegends.database;

public class DatabaseInitializer {
    public static void initializeDatabase() {
        System.out.println("📦 Inicializando banco de dados...");
        
        // Agora testConnection() retorna boolean, então pode ser usado em if
        if (DatabaseConnection.testConnection()) {
            System.out.println("✅ Conexão com SQL Server bem-sucedida!");
            createTablesIfNotExists();
        } else {
            System.out.println("❌ Não foi possível conectar ao banco");
        }
    }
    
    private static void createTablesIfNotExists() {
        System.out.println("🛠️  Criando tabelas... (implementação futura)");
        // Aqui você implementará a criação das tabelas depois
    }
}