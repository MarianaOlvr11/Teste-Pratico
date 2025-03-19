from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from database import get_db_connection, create_table
import mysql.connector 

app = Flask(__name__)
CORS(app)

# cria tabela no banco
create_table()

@app.route("/")
def home():
    return render_template("index.html") #redenriza o index


# cadastro
@app.route("/api/cadastrar", methods=["POST"])
def cadastrar():
    data = request.json
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Obter código_acao usando with para garantir fechamento do cursor
        with conn.cursor() as cursor:
            cursor.execute("SELECT codigo_acao FROM tipo_acao WHERE nome_acao = %s", (data["acao"],))
            tipo_acao = cursor.fetchone()
            
            if not tipo_acao:
                return jsonify({"error": "Tipo de ação inválido"}), 400

        # Novo cursor para a operação de inserção
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO acao (codigo_acao, investimento, data_prevista, data_cadastro)
                VALUES (%s, %s, %s, CURDATE())
            """, (tipo_acao[0], data["investimento"], data["data_prevista"]))
            conn.commit()
            
        return jsonify({"message": "Ação cadastrada com sucesso!"}), 201

    except mysql.connector.Error as err:
        if conn:
            conn.rollback()
        return jsonify({"error": str(err)}), 500
    finally:
        if conn:
            conn.close()
            
@app.route("/api/tipos-acao", methods=["GET"])
def listar_tipos_acao():
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT nome_acao FROM tipo_acao")
            result = cursor.fetchall()
            return jsonify([tipo['nome_acao'] for tipo in result])
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        if conn:
            conn.close()

#registros
@app.route("/api/listar", methods=["GET"])
def listar():
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute("""
                SELECT a.id, t.nome_acao as acao, a.investimento, 
                    a.data_prevista, a.data_cadastro 
                FROM acao a
                JOIN tipo_acao t ON a.codigo_acao = t.codigo_acao
            """)
            result = cursor.fetchall()
            return jsonify(result)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        if conn:
            conn.close()

# rota para listar um único item baseado no ID
@app.route("/api/listar/<int:id>", methods=["GET"])
def listar_um(id):
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute("""
                SELECT a.id, t.nome_acao as acao, a.investimento, 
                       a.data_prevista, a.data_cadastro 
                FROM acao a
                JOIN tipo_acao t ON a.codigo_acao = t.codigo_acao
                WHERE a.id = %s
            """, (id,))
            item = cursor.fetchone()
            return jsonify(item)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        if conn:
            conn.close()

# rota para editar
@app.route("/api/editar/<int:id>", methods=["PUT"])
def editar(id):
    data = request.json
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Obter código_acao
        cursor.execute("SELECT codigo_acao FROM tipo_acao WHERE nome_acao = %s", (data["acao"],))
        tipo_acao = cursor.fetchone()
        
        if not tipo_acao:
            return jsonify({"error": "Tipo de ação inválido"}), 400
        
        cursor.execute("""
            UPDATE acao 
            SET codigo_acao = %s, investimento = %s, data_prevista = %s 
            WHERE id = %s
        """, (tipo_acao[0], data["investimento"], data["data_prevista"], id))
        
        conn.commit()  # Garantir commit
        return jsonify({"message": "Ação atualizada!"})
    
    except mysql.connector.Error as err:
        if conn:
            conn.rollback()
        return jsonify({"error": str(err)}), 500
    finally:
        if conn:
            conn.close()

# excluir
@app.route("/api/excluir/<int:id>", methods=["DELETE"])
def excluir(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM acao WHERE id=%s", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Ação excluída!"})

if __name__ == "__main__":
    app.run(debug=True)
