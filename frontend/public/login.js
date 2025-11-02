document.addEventListener("DOMContentLoaded", () => {
  // login
  document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.usuario_id) {
        localStorage.setItem("usuario_id", data.usuario_id);
        localStorage.setItem("nombre", data.nombre || "");
        location.href = "index.html";
      } else {
        alert(data.mensaje || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("login error:", err);
      alert("No se pudo conectar con el backend.");
    }
  });

  // registro
  document.getElementById("formRegistro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("emailReg").value;
    const password = document.getElementById("passwordReg").value;

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nombre, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Registro correcto. Ahora inicia sesión.");
        document.getElementById("formRegistro").reset();
      } else {
        alert(data.error || "Error al registrar usuario");
      }
    } catch (err) {
      console.error("registro error:", err);
      alert("No se pudo conectar con el backend.");
    }
  });
});
