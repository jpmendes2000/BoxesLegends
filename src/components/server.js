import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import multer from "multer"; // Import multer for file uploads
import path from "path";     // Import path for file handling

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Conexão com o banco
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "boxes_legends",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar no banco:", err);
  } else {
    console.log("✅ Conectado ao banco boxes_legends!");
  }
});

// ============================================
// Configuração do Multer para upload de imagens
// ============================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/perfil/'); // Pasta onde as fotos serão salvas
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'perfil-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Apenas imagens são permitidas!'));
  }
});

// ============================================
// ROTA DE CADASTRO
// ============================================
app.post("/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;

  // Validação dos campos
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos!" });
  }

  // Validação de email
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ erro: "Email inválido!" });
  }

  // Validação de senha
  if (senha.length < 6) {
    return res.status(400).json({ erro: "Senha deve ter no mínimo 6 caracteres!" });
  }

  // Verifica se o email já existe
  const checkEmailSql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(checkEmailSql, [email], (err, results) => {
    if (err) {
      console.error("❌ Erro ao verificar email:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    if (results.length > 0) {
      return res.status(400).json({ erro: "Este email já está cadastrado!" });
    }

    // Hash da senha
    const hash = bcrypt.hashSync(senha, 10);

    // Insere o usuário no banco com valores padrão
    const sql = `
      INSERT INTO usuarios 
      (nome, email, senha, foto_perfil, tipo_usuario, kyros, id_galeria_principal) 
      VALUES (?, ?, ?, 'default.png', 'comum', 1000, NULL)
    `;
    
    db.query(sql, [nome, email, hash], (err, result) => {
      if (err) {
        console.error("❌ Erro ao cadastrar usuário:", err);
        return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
      }
      
      console.log("✅ Usuário cadastrado com sucesso:", nome);
      res.status(201).json({ 
        sucesso: true, 
        mensagem: "Usuário cadastrado com sucesso!",
        usuario: { 
          id: result.insertId, 
          nome, 
          email,
          kyros: 1000
        }
      });
    });
  });
});

// ============================================
// ROTA DE LOGIN
// ============================================
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("❌ Erro ao buscar usuário:", err);
      return res.status(500).json({ message: "Erro no servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    const usuario = results[0];
    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    console.log("✅ Login realizado:", usuario.nome);
    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        kyros: usuario.kyros,
        foto_perfil: usuario.foto_perfil,
        tipo_usuario: usuario.tipo_usuario,
        criado_em: usuario.criado_em
      }
    });
  });
});

// ============================================
// ROTA PARA PEGAR DADOS DO USUÁRIO
// ============================================
app.get("/usuario/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id_usuario, nome, email, kyros, foto_perfil, tipo_usuario, criado_em 
    FROM usuarios 
    WHERE id_usuario = ?
  `;
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Erro ao buscar usuário:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.status(200).json({ usuario: results[0] });
  });
});

// ============================================
// ROTA PARA LISTAR PERSONAGENS DO USUÁRIO
// ============================================
app.get("/usuario/:id/personagens", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      p.id_personagem,
      p.nome,
      p.descricao,
      p.raridade,
      p.id_caixa,
      up.favorito
    FROM usuario_personagens up
    JOIN personagens p ON up.id_personagem = p.id_personagem
    WHERE up.id_usuario = ?
    ORDER BY up.favorito DESC, p.raridade DESC
  `;
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Erro ao buscar personagens:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    res.status(200).json({ personagens: results });
  });
});

// ============================================
// ROTA PARA ABRIR UMA CAIXA
// ============================================
app.post("/abrir-caixa", (req, res) => {
  const { id_usuario, id_caixa } = req.body;

  if (!id_usuario || !id_caixa) {
    return res.status(400).json({ erro: "Dados incompletos!" });
  }

  // Busca informações da caixa
  const caixaSql = "SELECT * FROM caixas WHERE id_caixa = ?";
  
  db.query(caixaSql, [id_caixa], (err, caixaResults) => {
    if (err) {
      console.error("❌ Erro ao buscar caixa:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    if (caixaResults.length === 0) {
      return res.status(404).json({ erro: "Caixa não encontrada" });
    }

    const caixa = caixaResults[0];

    // Verifica se usuário tem kyros suficientes
    const usuarioSql = "SELECT kyros FROM usuarios WHERE id_usuario = ?";
    
    db.query(usuarioSql, [id_usuario], (err, usuarioResults) => {
      if (err) {
        console.error("❌ Erro ao buscar usuário:", err);
        return res.status(500).json({ erro: "Erro no servidor" });
      }

      const usuario = usuarioResults[0];
      
      if (usuario.kyros < caixa.preco_kyros) {
        return res.status(400).json({ erro: "Kyros insuficientes!" });
      }

      // Busca personagens disponíveis nesta caixa
      const personagensSql = `
        SELECT * FROM personagens 
        WHERE id_caixa = ? 
        ORDER BY RAND() 
        LIMIT 1
      `;
      
      db.query(personagensSql, [id_caixa], (err, personagensResults) => {
        if (err) {
          console.error("❌ Erro ao sortear personagem:", err);
          return res.status(500).json({ erro: "Erro no servidor" });
        }

        if (personagensResults.length === 0) {
          return res.status(404).json({ erro: "Nenhum personagem disponível nesta caixa" });
        }

        const personagem = personagensResults[0];

        // Atualiza kyros do usuário
        const updateKyrosSql = "UPDATE usuarios SET kyros = kyros - ? WHERE id_usuario = ?";
        
        db.query(updateKyrosSql, [caixa.preco_kyros, id_usuario], (err) => {
          if (err) {
            console.error("❌ Erro ao atualizar kyros:", err);
            return res.status(500).json({ erro: "Erro no servidor" });
          }

          // Adiciona personagem ao usuário (ou incrementa se já tem)
          const addPersonagemSql = `
            INSERT INTO usuario_personagens (id_usuario, id_personagem, favorito)
            VALUES (?, ?, 0)
          `;
          
          db.query(addPersonagemSql, [id_usuario, personagem.id_personagem], (err) => {
            if (err) {
              console.error("❌ Erro ao adicionar personagem:", err);
              return res.status(500).json({ erro: "Erro ao adicionar personagem" });
            }

            console.log(`✅ ${personagem.nome} obtido por usuário ${id_usuario}`);
            
            res.status(200).json({
              sucesso: true,
              mensagem: `Você obteve: ${personagem.nome}!`,
              personagem: personagem,
              kyros_restantes: usuario.kyros - caixa.preco_kyros
            });
          });
        });
      });
    });
  });
});

// ============================================
// ROTA PARA LISTAR TODAS AS CAIXAS
// ============================================
app.get("/caixas", (req, res) => {
  const sql = `
    SELECT 
      id_caixa,
      tipo,
      tamanho,
      preco_kyros,
      probabilidade_rara,
      criado_em
    FROM caixas
    ORDER BY preco_kyros ASC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Erro ao buscar caixas:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    res.status(200).json({ caixas: results });
  });
});

// ============================================
// ROTA PARA LISTAR TODAS AS RARIDADES
// ============================================
app.get("/raridades", (req, res) => {
  const sql = "SELECT * FROM raridades ORDER BY probabilidade DESC";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Erro ao buscar raridades:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    res.status(200).json({ raridades: results });
  });
});

// ============================================
// ROTA PARA UPLOAD DE FOTO DE PERFIL
// ============================================
app.post("/usuario/foto", upload.single('foto'), (req, res) => {
  const { id_usuario } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ erro: "Nenhuma imagem enviada!" });
  }

  const caminhoFoto = `/uploads/perfil/${req.file.filename}`;

  const sql = "UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?";
  db.query(sql, [caminhoFoto, id_usuario], (err) => {
    if (err) {
      console.error("❌ Erro ao atualizar foto:", err);
      return res.status(500).json({ erro: "Erro ao atualizar foto" });
    }

    console.log("✅ Foto atualizada para usuário:", id_usuario);
    res.status(200).json({
      sucesso: true,
      mensagem: "Foto atualizada com sucesso!",
      foto_perfil: caminhoFoto
    });
  });
});

// ============================================
// ROTA PARA ATUALIZAR DADOS DO USUÁRIO
// ============================================
// In src/components/server.js, update the PUT /usuario/:id route
app.put("/usuario/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  if (!nome && !email && !senha) {
    return res.status(400).json({ erro: "Informe pelo menos um campo para atualizar!" });
  }

  let sql = "UPDATE usuarios SET ";
  const valores = [];

  if (nome) {
    sql += "nome = ?";
    valores.push(nome);
  }

  if (email) {
    if (valores.length > 0) sql += ", ";
    sql += "email = ?";
    valores.push(email);
  }

  if (senha) {
    if (valores.length > 0) sql += ", ";
    const hash = bcrypt.hashSync(senha, 10); // Hash the new password
    sql += "senha = ?";
    valores.push(hash);
  }

  sql += " WHERE id_usuario = ?";
  valores.push(id);

  db.query(sql, valores, (err) => {
    if (err) {
      console.error("❌ Erro ao atualizar usuário:", err);
      return res.status(500).json({ erro: "Erro ao atualizar dados" });
    }

    console.log("✅ Dados atualizados para usuário:", id);
    res.status(200).json({
      sucesso: true,
      mensagem: "Dados atualizados com sucesso!"
    });
  });
});
// ============================================
// ROTA PARA MARCAR PERSONAGEM COMO FAVORITO
// ============================================
app.post("/usuario/favoritar", (req, res) => {
  const { id_usuario, id_personagem } = req.body;

  if (!id_usuario || !id_personagem) {
    return res.status(400).json({ erro: "Dados incompletos!" });
  }

  // Primeiro, remove todos os favoritos do usuário
  const removeFavoritosSql = "UPDATE usuario_personagens SET favorito = 0 WHERE id_usuario = ?";
  
  db.query(removeFavoritosSql, [id_usuario], (err) => {
    if (err) {
      console.error("❌ Erro ao remover favoritos:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    // Depois, marca o personagem selecionado como favorito
    const addFavoritoSql = `
      UPDATE usuario_personagens 
      SET favorito = 1 
      WHERE id_usuario = ? AND id_personagem = ?
    `;
    
    db.query(addFavoritoSql, [id_usuario, id_personagem], (err) => {
      if (err) {
        console.error("❌ Erro ao favoritar personagem:", err);
        return res.status(500).json({ erro: "Erro ao favoritar" });
      }

      console.log(`✅ Personagem ${id_personagem} favoritado por usuário ${id_usuario}`);
      res.status(200).json({
        sucesso: true,
        mensagem: "Personagem favoritado com sucesso!"
      });
    });
  });
});

// Inicia o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log("📋 Rotas disponíveis:");
  console.log("   POST /cadastro");
  console.log("   POST /login");
  console.log("   GET  /usuario/:id");
  console.log("   GET  /usuario/:id/personagens");
  console.log("   POST /abrir-caixa");
  console.log("   GET  /caixas");
  console.log("   GET  /raridades");
  console.log("   POST /usuario/foto");
  console.log("   PUT  /usuario/:id");
  console.log("   POST /usuario/favoritar");
});