import mysql.connector

#conexao com meu banco
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="1104",
        database="pharmaviews"
    )

#tabela
def create_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS marketing (
            id INT AUTO_INCREMENT PRIMARY KEY,
            acao VARCHAR(100),
            data_prevista DATE,
            investimento DECIMAL(10,2)
        )
    """)
    conn.commit()
    conn.close()
