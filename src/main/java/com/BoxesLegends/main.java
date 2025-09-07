package com.BoxesLegends;

/*
    * IMPORTS !
 */
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;


/*
     * CONECTIVIDADE !
 */
import com.BoxesLegends.database.DatabaseInitializer;






/*
    * CLASSE Main ! 
 */

 
public class Main extends Application {
    @Override
    public void start(Stage primaryStage) throws Exception {
        // Inicializar banco de dados
        DatabaseInitializer.initializeDatabase();
        
        // Carregar a tela principal
        Parent root = FXMLLoader.load(getClass().getResource("/fxml/main.fxml"));
        primaryStage.setTitle("Gacha Collection");
        primaryStage.setScene(new Scene(root, 800, 600));
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}