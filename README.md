# Blog Academy

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-blue?logo=next.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0.5-blue?logo=tailwindcss)

Este é o repositório do projeto **Blog Academy**, um blog moderno e performático desenvolvido como parte da pós-graduação em **Desenvolvimento Full Stack** na FIAP.

## 🚀 Sobre o Projeto

O Blog Academy é uma plataforma de conteúdo focada em educação, construída com as ferramentas mais modernas do ecossistema JavaScript. O projeto utiliza Next.js para renderização estática e do lado do servidor, garantindo ótima performance e SEO, e consome uma API para processamento dos dados.

## ✨ Funcionalidades Principais

- **Postagens** Professores popderam criar, editar e exlcuir, alunos poderam visualizar e pesquisar.
- **Design Responsivo:** Experiência de leitura otimizada para desktops, tablets e celulares.
- **Tema Claro e Escuro:** Alterne entre os temas para uma leitura mais confortável.
- **Performance Otimizada:** Geração de páginas estáticas com Next.js para carregamento rápido.
- **Sintaxe de Código Destacada:** Blocos de código com realce para facilitar a leitura.

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) 15+
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) 4+
- **Gerenciamento de Conteúdo:** [API (NodeJs)](https://github.com/MelqSantos/blogAcademy.git)
- **UI/UX:** [Headless UI](https://headlessui.com/) e [Heroicons](https://heroicons.com/)

## 🏁 Como Rodar o Projeto

Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 20.x ou superior)
- [Yarn](https://yarnpkg.com/) (gerenciador de pacotes)

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/blog-academy.git
   cd blog-academy
   ```

2. **Instale as dependências:**
   ```bash
   yarn
   ```

### Execução

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   yarn dev
   ```

   > **Nota para usuários de Windows (PowerShell):** O script `dev` utiliza `cross-env` para garantir compatibilidade entre sistemas operacionais. Caso encontre problemas relacionados ao diretório de trabalho (`CWD`), o comando `yarn dev` deve resolvê-los.

1.5 **Em caso de erros utilize:**
```bash
$env:PWD = $(Get-Location).Path
```

2. **Acesse a aplicação:**
   Abra seu navegador e acesse http://localhost:3000.

---
O projeto está em constante evolução e novas funcionalidades podem ser adicionadas. Sinta-se à vontade para explorar o código!
