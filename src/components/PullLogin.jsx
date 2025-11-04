// src/components/PullLogin.jsx
export const usuariosFake = [
  {
    email: "admin@site.com",
    password: "123456",
    nome: "Administrador",
    tipo: "admin"
  },
  {
    email: "user@site.com",
    password: "123456",
    nome: "Usuário Comum",
    tipo: "comum"
  }
];

export function verificarLogin(email, password) {
  // Procura se existe usuário válido
  const user = usuariosFake.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    return {
      sucesso: true,
      usuario: user
    };
  } else {
    return {
      sucesso: false,
      mensagem: "E-mail ou senha inválidos!"
    };
  }
}
