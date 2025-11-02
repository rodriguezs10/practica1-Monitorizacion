document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCita");
  const btnVolver = document.getElementById("volver");

  const usuario_id = localStorage.getItem("usuario_id");
  if (!usuario_id) {
    alert("Debes iniciar sesión para crear citas.");
    location.href = "login.html";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cita = {
      usuario_id,
      fecha: document.getElementById("fecha").value,
      hora: document.getElementById("hora").value,
      descripcion: document.getElementById("descripcion").value || ""
    };
    try {
      const res = await fetch("http://localhost:5000/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cita)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje);
        location.href = "index.html";
      } else {
        alert(data.error || "Error al guardar la cita.");
      }
    } catch (err) {
      console.error("Error al guardar cita:", err);
      alert("No se pudo conectar con el backend.");
    }
  });

  btnVolver.addEventListener("click", () => location.href = "index.html");
});
