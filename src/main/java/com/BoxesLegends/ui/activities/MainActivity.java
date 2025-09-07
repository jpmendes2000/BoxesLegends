package com.BoxesLegends.ui.activities;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Inicializar banco de dados
        DatabaseInitializer.initializeDatabase();
        
        // Verificar se usuário está logado
        if (!isUserLoggedIn()) {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        }
    }
    
    private boolean isUserLoggedIn() {
        // Verificar se há usuário logado (SharedPreferences ou SQLite)
        return false;
    }
}