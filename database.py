import mysql.connector

#conexao com meu banco
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="gestaoverbas"
    )

#tabela
def create_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tipo_acao (
            codigo_acao INT AUTO_INCREMENT PRIMARY KEY,
            nome_acao VARCHAR(100) NOT NULL UNIQUE
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS acao (
            id INT AUTO_INCREMENT PRIMARY KEY,
            codigo_acao INT,
            investimento DOUBLE,
            data_prevista DATE,
            data_cadastro DATE DEFAULT (CURRENT_DATE),
            FOREIGN KEY (codigo_acao) REFERENCES tipo_acao(codigo_acao)
        )
    """)
    
    # inserção inicial
    cursor.execute("""
        INSERT IGNORE INTO tipo_acao (nome_acao)
        VALUES ('Palestra'), ('Evento'), ('Apoio Gráfico')
    """)
    
    conn.commit()
    conn.close()
    
