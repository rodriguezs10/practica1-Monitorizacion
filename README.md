
# Práctica 1 - Despliegue de una aplicación con Docker

*Asignatura:* Despliegue y Monitorización en la Nube

*Alumno:* Adrián López Martín y Alejandro Rodríguez Salán  

*Fecha:* 02 de noviembre de 2025

---


La aplicación se compone de tres servicios principales:

- **Base de datos (PostgreSQL):** almacena usuarios y citas médicas.  
- **Backend (Flask):** gestiona la lógica de negocio y las operaciones CRUD.  
- **Frontend (Node.js + HTML/JS):** interfaz web que permite interactuar con el sistema.

---

## Especificaciones técnicas

- **Lenguaje:** Python (Flask) y JavaScript (Node.js, Express).  
- **Base de datos:** PostgreSQL.  
- **Despliegue:** Docker y Docker Compose.  
- **Arquitectura:** Tres contenedores conectados entre sí (db, backend, frontend).

---

## Estructura del proyecto

```

practica1/
├── db/
│   ├── Dockerfile
│   └── init.sql
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── public/
│       ├── login.html
│       ├── index.html
│       ├── citas.html
│       ├── login.css
│       ├── index.css
│       ├── citas.css
│       ├── login.js
│       ├── index.js
│       └── citas.js
├── README.md
└── docker-compose.yml

````

---

## Cómo ejecutar la aplicación

### Prerrequisitos
- Tener instalados **Docker**.

### Pasos de ejecución

1. Abrir una terminal en el directorio raíz del proyecto.  
2. Ejecutar los siguientes comandos:

   ```bash
   docker-compose down -v
   docker-compose up --build

   otra opción: hacer click derecho en el archivo docker-compose.yml y seleccionar Compose up.
    ```


3. Esperar a que todos los contenedores se inicien correctamente.
   Los servicios quedarán disponibles en las siguientes direcciones:

   * **Frontend:** [http://localhost:3000](http://localhost:3000)
   * **Backend:** [http://localhost:5000](http://localhost:5000)
   * **Base de datos:** Puerto 5433

4. Acceder a la web desde:

   ```
   http://localhost:3000
   ```

---

## Descripción del funcionamiento

* **Login y registro:** permite crear usuarios e iniciar sesión.
* **Gestión de citas:** los usuarios pueden crear, visualizar, editar y eliminar citas.
* **Conexión entre servicios:** el frontend se comunica con el backend mediante peticiones HTTP, y el backend se conecta con PostgreSQL para almacenar la información.

---

## Comprobaciones básicas

### 1. Verificar el estado de los contenedores

```bash
docker-compose ps
```

### 2. Comprobar que el backend responde

```bash
curl http://localhost:5000/health
```

Debe devolver:

```
{"status": "ok"}
```



### 3. Prueba en el navegador

1. Entrar a `http://localhost:3000`.
2. Registrar un usuario o iniciar sesión.
3. Crear una cita y comprobar que se muestra en el panel.
4. Editar o eliminar una cita.
5. Cerrar sesión y volver al login.


---

## Comandos útiles

```bash
# Detener y eliminar todos los contenedores
docker-compose down -v

# Ver los logs del sistema
docker-compose logs

# Reiniciar un servicio específico
docker-compose restart frontend
```

---


## Repositorio en GitHub
**[https://github.com/adriannlm/practica1-Monitorizacion](https://github.com/adriannlm/practica1-Monitorizacion)**







