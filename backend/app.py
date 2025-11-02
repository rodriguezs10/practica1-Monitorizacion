from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2, os, time

app = Flask(__name__)
CORS(app)

db_config = {
    "host": os.getenv("DB_HOST", "db"),
    "database": os.getenv("DB_NAME", "clinica"),
    "user": os.getenv("DB_USER", "admin"),
    "password": os.getenv("DB_PASS", "admin"),
    "port": int(os.getenv("DB_PORT", 5432)),
}

def get_connection(retries=10, wait=2):
    for i in range(retries):
        try:
            return psycopg2.connect(**db_config)
        except Exception as e:
            if i == retries - 1:
                print("Conexion a la BD fallida:", e)
                raise
            print(f"BD no lista, reintentando: ({i+1}/{retries})...")
            time.sleep(wait)

@app.get("/health")
def health():
    try:
        conn = get_connection()
        conn.close()
        return {"status": "ok"}
    except:
        return {"status": "db_error"}, 500

# --------- USUARIOS ----------
@app.post("/register")
def register():
    data = request.json or {}
    nombre = data.get("nombre")
    email = data.get("email")
    password = data.get("password")
    if not all([nombre, email, password]):
        return {"error": "Faltan datos"}, 400
    conn = get_connection(); cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO usuarios (nombre, email, password) VALUES (%s, %s, %s)",
            (nombre, email, password),
        )
        conn.commit()
        return {"mensaje": "Usuario registrado con éxito"}
    except psycopg2.Error as e:
        conn.rollback()
        return {"error": e.pgerror or str(e)}, 500
    finally:
        cur.close(); conn.close()

@app.post("/login")
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")
    if not all([email, password]):
        return {"error": "Faltan datos"}, 400
    conn = get_connection(); cur = conn.cursor()
    cur.execute("SELECT id, nombre FROM usuarios WHERE email=%s AND password=%s",
                (email, password))
    user = cur.fetchone()
    cur.close(); conn.close()
    if user:
        return {"mensaje": "Login correcto", "usuario_id": user[0], "nombre": user[1]}
    return {"mensaje": "Credenciales incorrectas"}, 401

@app.route("/usuario/<int:usuario_id>", methods=["GET", "DELETE"])
def usuario(usuario_id):
    conn = get_connection(); cur = conn.cursor()
    if request.method == "GET":
        cur.execute("SELECT nombre, email FROM usuarios WHERE id=%s", (usuario_id,))
        row = cur.fetchone()
        cur.close(); conn.close()
        if row:
            return {"nombre": row[0], "email": row[1]}
        return {"error": "Usuario no encontrado"}, 404
    else:
        cur.execute("DELETE FROM usuarios WHERE id=%s", (usuario_id,))
        conn.commit()
        cur.close(); conn.close()
        return {"mensaje": "Usuario y sus datos eliminados correctamente"}

# --------- CITAS ----------
@app.get("/citas/<int:usuario_id>")
def get_citas(usuario_id):
    conn = get_connection(); cur = conn.cursor()
    cur.execute("""SELECT id, fecha, hora, descripcion
                   FROM citas WHERE usuario_id=%s ORDER BY fecha, hora""", (usuario_id,))
    rows = cur.fetchall()
    cur.close(); conn.close()
    return [{"id": r[0], "fecha": str(r[1]), "hora": str(r[2]), "descripcion": r[3]} for r in rows]

@app.post("/citas")
def crear_cita():
    data = request.json or {}
    usuario_id = data.get("usuario_id")
    fecha = data.get("fecha")
    hora = data.get("hora")
    descripcion = data.get("descripcion", "")
    if not all([usuario_id, fecha, hora]):
        return {"error": "Faltan datos"}, 400
    conn = get_connection(); cur = conn.cursor()
    cur.execute("""INSERT INTO citas (usuario_id, fecha, hora, descripcion)
                   VALUES (%s, %s, %s, %s)""",
                (usuario_id, fecha, hora, descripcion))
    conn.commit()
    cur.close(); conn.close()
    return {"mensaje": "Cita creada correctamente"}

@app.put("/citas/<int:cita_id>")
def actualizar_cita(cita_id):
    data = request.json or {}
    fecha = data.get("fecha")
    hora = data.get("hora")
    descripcion = data.get("descripcion", "")
    conn = get_connection(); cur = conn.cursor()
    cur.execute("""UPDATE citas SET fecha=%s, hora=%s, descripcion=%s WHERE id=%s""",
                (fecha, hora, descripcion, cita_id))
    conn.commit()
    cur.close(); conn.close()
    return {"mensaje": "Cita actualizada correctamente"}

@app.delete("/citas/<int:cita_id>")
def eliminar_cita(cita_id):
    conn = get_connection(); cur = conn.cursor()
    cur.execute("DELETE FROM citas WHERE id=%s", (cita_id,))
    conn.commit()
    cur.close(); conn.close()
    return {"mensaje": "Cita eliminada correctamente"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
