package com.BoxesLegends;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.stage.Stage;
import com.BoxesLegends.database.DatabaseInitializer;

public class Main extends Application {
    
    private Label statusLabel;
    
    @Override
    public void start(Stage primaryStage) throws Exception {
        // Inicializar banco de dados
        DatabaseInitializer.initializeDatabase();
        
        // ==================== LAYOUT PRINCIPAL ====================
        VBox mainLayout = new VBox(20);
        mainLayout.setAlignment(Pos.CENTER);
        mainLayout.setPadding(new Insets(40));
        mainLayout.setStyle("-fx-background-color: linear-gradient(to bottom, #2c3e50, #3498db);");
        
        // ==================== TÍTULO ====================
        Label titleLabel = new Label("🎮 BOXES LEGENDS");
        titleLabel.setFont(Font.font("Arial", 36));
        titleLabel.setTextFill(Color.WHITE);
        titleLabel.setStyle("-fx-effect: dropshadow(gaussian, rgba(0,0,0,0.5), 10, 0.5, 0, 2);");
        
        // ==================== STATUS ====================
        statusLabel = new Label("✅ Banco inicializado com sucesso!");
        statusLabel.setFont(Font.font("Arial", 16));
        statusLabel.setTextFill(Color.WHITE);
        
        // ==================== BOTÕES PRINCIPAIS ====================
        HBox buttonBox = new HBox(20);
        buttonBox.setAlignment(Pos.CENTER);
        
        // Botão Gacha
        Button gachaButton = createStyledButton("🎲 Abrir Caixa Gacha", "#e74c3c");
        gachaButton.setOnAction(e -> openGachaBox());
        
        // Botão Inventário
        Button inventoryButton = createStyledButton("🎒 Meu Inventário", "#27ae60");
        inventoryButton.setOnAction(e -> showInventory());
        
        // Botão Mercado
        Button marketButton = createStyledButton("💰 Mercado", "#f39c12");
        marketButton.setOnAction(e -> openMarketplace());
        
        buttonBox.getChildren().addAll(gachaButton, inventoryButton, marketButton);
        
        // ==================== BOTÕES DE CONFIGURAÇÃO ====================
        HBox configBox = new HBox(15);
        configBox.setAlignment(Pos.CENTER);
        
        Button testButton = createSmallButton("🔌 Testar Conexão", "#2980b9");
        testButton.setOnAction(e -> testConnection());
        
        Button statsButton = createSmallButton("📊 Estatísticas", "#8e44ad");
        statsButton.setOnAction(e -> showStatistics());
        
        Button exitButton = createSmallButton("🚪 Sair", "#7f8c8d");
        exitButton.setOnAction(e -> primaryStage.close());
        
        configBox.getChildren().addAll(testButton, statsButton, exitButton);
        
        // ==================== ÁREA DE LOG ====================
        TextArea logArea = new TextArea();
        logArea.setEditable(false);
        logArea.setPrefHeight(150);
        logArea.setStyle("-fx-control-inner-background: #2c3e50; -fx-text-fill: white; -fx-font-size: 12px;");
        logArea.setText("📋 Log do Sistema:\n✅ Aplicação iniciada com sucesso!\n✅ JavaFX 21 funcionando!");
        
        // ==================== ADICIONAR TUDO AO LAYOUT ====================
        mainLayout.getChildren().addAll(
            titleLabel,
            statusLabel,
            buttonBox,
            configBox,
            logArea
        );
        
        // ==================== CENA E STAGE ====================
        Scene scene = new Scene(mainLayout, 1000, 700);
        
        // Adicionar CSS externo
        try {
            scene.getStylesheets().add(getClass().getResource("/styles/desktop/main.css").toExternalForm());
        } catch (Exception e) {
            logArea.appendText("\n⚠️ CSS não encontrado, usando estilo padrão");
        }
        
        primaryStage.setTitle("Boxes Legends - Gacha Collection");
        primaryStage.setScene(scene);
        primaryStage.setMaximized(true); // TELA CHEIA
        primaryStage.show();
    }
    
    // ==================== MÉTODOS AUXILIARES ====================
    
    private Button createStyledButton(String text, String color) {
        Button button = new Button(text);
        button.setStyle(String.format(
            "-fx-background-color: %s; -fx-text-fill: white; -fx-font-size: 14px; -fx-font-weight: bold; " +
            "-fx-padding: 15 25; -fx-background-radius: 8; -fx-effect: dropshadow(gaussian, rgba(0,0,0,0.3), 8, 0.5, 0, 2);",
            color
        ));
        
        button.setOnMouseEntered(e -> button.setStyle(String.format(
            "-fx-background-color: derive(%s, 20%%); -fx-text-fill: white; -fx-font-size: 14px; -fx-font-weight: bold; " +
            "-fx-padding: 15 25; -fx-background-radius: 8; -fx-effect: dropshadow(gaussian, rgba(0,0,0,0.4), 10, 0.5, 0, 3);",
            color
        )));
        
        button.setOnMouseExited(e -> button.setStyle(String.format(
            "-fx-background-color: %s; -fx-text-fill: white; -fx-font-size: 14px; -fx-font-weight: bold; " +
            "-fx-padding: 15 25; -fx-background-radius: 8; -fx-effect: dropshadow(gaussian, rgba(0,0,0,0.3), 8, 0.5, 0, 2);",
            color
        )));
        
        return button;
    }
    
    private Button createSmallButton(String text, String color) {
        Button button = new Button(text);
        button.setStyle(String.format(
            "-fx-background-color: %s; -fx-text-fill: white; -fx-font-size: 12px; " +
            "-fx-padding: 8 15; -fx-background-radius: 5;",
            color
        ));
        
        button.setOnMouseEntered(e -> button.setStyle(String.format(
            "-fx-background-color: derive(%s, 20%%); -fx-text-fill: white; -fx-font-size: 12px; " +
            "-fx-padding: 8 15; -fx-background-radius: 5;",
            color
        )));
        
        return button;
    }
    
    // ==================== HANDLERS DOS BOTÕES ====================
    
    private void testConnection() {
        statusLabel.setText("🔌 Testando conexão com o banco...");
        com.BoxesLegends.database.DatabaseConnection.testConnection();
        statusLabel.setText("✅ Conexão testada com sucesso!");
    }
    
    private void openGachaBox() {
        statusLabel.setText("🎲 Abrindo caixa gacha...");
        // GachaService.simulateGacha();
        statusLabel.setText("🎉 Caixa aberta! Verifique seu inventário.");
    }
    
    private void showInventory() {
        statusLabel.setText("🎒 Carregando inventário...");
        // InventoryService.showInventory();
        statusLabel.setText("📦 Inventário carregado!");
    }
    
    private void openMarketplace() {
        statusLabel.setText("💰 Acessando mercado...");
        // MarketplaceService.openMarket();
        statusLabel.setText("🏪 Mercado disponível!");
    }
    
    private void showStatistics() {
        statusLabel.setText("📊 Calculando estatísticas...");
        // StatsService.showStats();
        statusLabel.setText("📈 Estatísticas disponíveis!");
    }

    public static void main(String[] args) {
        launch(args);
    }
}