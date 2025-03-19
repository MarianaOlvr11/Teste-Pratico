# Gestão de Verbas

## Visão Geral
Sistema web para gerenciar o orçamento de marketing, permitindo cadastrar, listar, editar e excluir investimentos. O projeto segue um modelo simples e funcional, garantindo eficiência e usabilidade. Procurei ser mais fiel possível ao protótipo fornecido.

## Tecnologias Utilizadas
- **Frontend:** HTML, CSS, Bootstrap 3.4.1, Font Awesome, DataTables, jQuery
- **Backend:** Python (Flask)
- **Banco de Dados:** MySQL

## Funcionalidades
- Cadastro, edição e exclusão de investimentos
- Interface interativa

## Estrutura do Projeto
```
/
|-- static/
|   |-- css/style.css
|   |-- js/script.js
|-- templates/index.html
|-- app.py
|-- database.py
|-- requirements.txt
|-- README.md
```

## Como Executar

### Banco de Dados

O sistema utiliza **MySQL** como banco de dados. O arquivo `database.py` gerencia a conexão e a criação da tabela necessária.  

#### Configuração do Banco de Dados:
1. Certifique-se de que o MySQL está instalado e em execução.
2. Crie um banco de dados chamado `gestaoverbas`:
   ```sql
   CREATE DATABASE gestaoverbas;
   ```
3. Altere as credenciais de acesso ao MySQL (`host`, `user`, `password`) no arquivo `database.py` para a de seu banco.

Para criar a tabela diretamente pelo Python, basta executar:
```bash
python -c "import database; database.create_table()"
```
### Ambiente Virtual e Execução:

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-repositorio.git
   ```
2. Acesse o diretório:
   ```bash
   cd nome-do-projeto
   ```
3. Crie e ative um ambiente virtual:
   ```bash
    python -m venv meu_ambiente_virtual #cria o ambiente

   
   source meu_ambiente_virtual/bin/activate  # Linux/Mac
   meu_ambiente_virtual\Scripts\activate  # Windows
   ```
4. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
5. Execute o servidor Flask:
   ```bash
   python app.py
   ```
6. Acesse `http://127.0.0.1:5000/` no navegador.

## API Backend
- `GET /investimentos` - Retorna a lista de investimentos
- `POST /investimentos` - Adiciona um novo investimento
- `PUT /investimentos/<id>` - Atualiza um investimento existente
- `DELETE /investimentos/<id>` - Remove um investimento

## Dependências
O arquivo `requirements.txt` deve conter as seguintes dependências:
```
flask
flask-mysql
flask-cors
flask-mysql-connector
```


