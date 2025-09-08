package com.BoxesLegends.ui.controllers;

import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.event.ActionEvent;

public class MainController {
    
    @FXML
    private Label welcomeLabel;
    
    @FXML
    private Button gachaButton;
    
    @FXML
    private Button inventoryButton;
    
    @FXML
    public void initialize() {
        System.out.println("✅ MainController inicializado!");
        if (welcomeLabel != null) {
            welcomeLabel.setText("Bem-vindo ao Boxes Legends!");
        }
    }
    
    @FXML
    private void handleGachaButton(ActionEvent event) {
        System.out.println("🎲 Botão Gacha clicado!");
        // TODO: Implementar navegação para tela gacha
    }
    
    @FXML
    private void handleInventoryButton(ActionEvent event) {
        System.out.println("🎒 Botão Inventário clicado!");
        // TODO: Implementar navegação para tela inventário
    }
}