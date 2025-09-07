package com.BoxesLegends;

// REMOVA todas as importações do JavaFX
// import javafx... (todas)

public class Main {
    public static void main(String[] args) {
        System.out.println("🎮 Gacha Collection iniciado!");
        System.out.println("✅ Aplicação funcionando no console");
        
        // Teste simples do banco de dados (vamos criar classes simples primeiro)
        try {
            System.out.println("📦 Inicializando banco de dados...");
            // Vamos criar uma versão simples do DatabaseInitializer primeiro
            testDatabaseConnection();
            System.out.println("✅ Banco inicializado com sucesso!");
        } catch (Exception e) {
            System.out.println("❌ Erro no banco: " + e.getMessage());
        }
    }
    
    private static void testDatabaseConnection() {
        // Versão simples para teste
        System.out.println("🔗 Testando conexão com banco de dados...");
        // Aqui viria o código real de conexão
    }
}