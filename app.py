from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from database import get_db_connection, create_table

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
    data = request.json # dados serão em json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO marketing (acao, data_prevista, investimento) VALUES (%s, %s, %s)",
                   (data["acao"], data["data_prevista"], data["investimento"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Ação cadastrada com sucesso!"})

#registros
@app.route("/api/listar", methods=["GET"])
def listar():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM marketing")
    result = cursor.fetchall()
    conn.close()
    return jsonify(result)

# rota para listar um único item baseado no ID
@app.route("/api/listar/<int:id>", methods=["GET"])
def listar_um(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM marketing WHERE id=%s", (id,))
    item = cursor.fetchone()
    conn.close()
    return jsonify(item)

# rota para editar
@app.route("/api/editar/<int:id>", methods=["PUT"])
def editar(id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE marketing SET acao=%s, data_prevista=%s, investimento=%s WHERE id=%s",
                   (data["acao"], data["data_prevista"], data["investimento"], id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Ação atualizada!"})

# excluir
@app.route("/api/excluir/<int:id>", methods=["DELETE"])
def excluir(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM marketing WHERE id=%s", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Ação excluída!"})

if __name__ == "__main__":
    app.run(debug=True)
