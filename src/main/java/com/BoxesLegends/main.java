package com.BoxesLegends;

import com.BoxesLegends.database.DatabaseInitializer;

public class Main {
    public static void main(String[] args) {
        System.out.println("🎮 Boxes Legends - Versão Console");
        System.out.println("================================");
        
        // Inicializar banco de dados
        System.out.println("📦 Inicializando sistema...");
        DatabaseInitializer.initializeDatabase();
        
        System.out.println("✅ Sistema inicializado com sucesso!");
        System.out.println("🔧 Pressione Ctrl+C para sair");
        
        // Menu simples
        showMenu();
    }
    
    private static void showMenu() {
        java.util.Scanner scanner = new java.util.Scanner(System.in);
        
        while (true) {
            System.out.println("\n🎯 MENU PRINCIPAL:");
            System.out.println("1. Testar conexão do banco");
            System.out.println("2. Simular gacha (futuro)");
            System.out.println("3. Ver inventário (futuro)");
            System.out.println("0. Sair");
            System.out.print("Escolha uma opção: ");
            
            try {
                int opcao = scanner.nextInt();
                
                switch (opcao) {
                    case 1:
                        System.out.println("🔌 Testando conexão...");
                        com.BoxesLegends.database.DatabaseConnection.testConnection();
                        break;
                    case 2:
                        System.out.println("🎲 Gacha em desenvolvimento...");
                        break;
                    case 3:
                        System.out.println("🎒 Inventário em desenvolvimento...");
                        break;
                    case 0:
                        System.out.println("👋 Saindo...");
                        scanner.close();
                        return;
                    default:
                        System.out.println("❌ Opção inválida!");
                }
            } catch (Exception e) {
                System.out.println("❌ Entrada inválida!");
                scanner.nextLine(); // limpar buffer
            }
        }
    }
}