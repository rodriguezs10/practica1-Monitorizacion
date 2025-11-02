document.addEventListener("DOMContentLoaded", () => {
  const usuario_id = localStorage.getItem("usuario_id");
  if (!usuario_id) {
    alert("Debes iniciar sesión para acceder al panel.");
    window.location.href = "login.html";
    return;
  }

  const vistaCitas = document.getElementById("vistaCitas");
  const vistaPerfil = document.getElementById("vistaPerfil");
  const vistaEditarCita = document.getElementById("vistaEditarCita");
  const listaCitas = document.getElementById("listaCitas");

  const btnPerfil = document.getElementById("btnPerfil");
  const btnNuevaCita = document.getElementById("btnNuevaCita");
  const btnCerrar = document.getElementById("cerrarSesion");
  const btnEliminar = document.getElementById("eliminarCuenta");
  const btnVolver = document.getElementById("volverInicio");

  const formEditar = document.getElementById("formEditarCita");
  const btnCancelarEdicion = document.getElementById("cancelarEdicion");

  let citaEditando = null;

  cargarCitas(usuario_id);

  btnPerfil.addEventListener("click", async () => {
    const res = await fetch(`http://localhost:5000/usuario/${usuario_id}`);
    const usuario = await res.json();
    document.getElementById("nombreUsuario").textContent = usuario.nombre;
    document.getElementById("emailUsuario").textContent = usuario.email;
    cambiarVista(vistaPerfil);
  });

  btnVolver.addEventListener("click", () => cambiarVista(vistaCitas));

  btnCerrar.addEventListener("click", () => {
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("nombre");
    window.location.href = "login.html";
  });

  btnEliminar.addEventListener("click", async () => {
    if (!confirm("¿Seguro que quieres eliminar tu cuenta y todos tus datos?")) return;
    const res = await fetch(`http://localhost:5000/usuario/${usuario_id}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.mensaje);
    localStorage.clear();
    window.location.href = "login.html";
  });

  btnNuevaCita.addEventListener("click", () => {
    window.location.href = "citas.html";
  });

  formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cita = {
      fecha: document.getElementById("editFecha").value,
      hora: document.getElementById("editHora").value,
      descripcion: document.getElementById("editDescripcion").value
    };
    const res = await fetch(`http://localhost:5000/citas/${citaEditando}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cita)
    });
    const data = await res.json();
    alert(data.mensaje);
    citaEditando = null;
    cambiarVista(vistaCitas);
    cargarCitas(usuario_id);
  });

  btnCancelarEdicion.addEventListener("click", () => {
    citaEditando = null;
    cambiarVista(vistaCitas);
  });

  async function cargarCitas(id) {
    const res = await fetch(`http://localhost:5000/citas/${id}`);
    const citas = await res.json();
    listaCitas.innerHTML = "";

    if (!Array.isArray(citas) || citas.length === 0) {
      listaCitas.innerHTML = "<li>No tienes citas registradas.</li>";
      return;
    }

    citas.forEach(c => {
      const li = document.createElement("li");
      const fecha = new Date(c.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
      const hora = c.hora ? c.hora.slice(0, 5) : "";
      li.innerHTML = `
        <div class="cita-fecha"><strong>${fecha} - ${hora}</strong></div>
        <div class="cita-descripcion">${c.descripcion || ""}</div>
        <div class="acciones">
          <button class="editar" data-id="${c.id}">Editar</button>
          <button class="eliminar" data-id="${c.id}">Eliminar</button>
        </div>
      `;
      listaCitas.appendChild(li);
    });

    document.querySelectorAll(".editar").forEach(btn => {
      btn.addEventListener("click", (e) => editarCita(e.target.dataset.id));
    });
    document.querySelectorAll(".eliminar").forEach(btn => {
      btn.addEventListener("click", (e) => eliminarCita(e.target.dataset.id));
    });
  }

  function cambiarVista(vista) {
    [vistaCitas, vistaPerfil, vistaEditarCita].forEach(v => (v.style.display = "none"));
    vista.style.display = "block";
  }

  async function editarCita(id) {
    const res = await fetch(`http://localhost:5000/citas/${usuario_id}`);
    const citas = await res.json();
    const cita = citas.find(c => c.id == id);
    if (!cita) return alert("No se encontró la cita.");
    document.getElementById("editFecha").value = (cita.fecha || "").slice(0, 10);
    document.getElementById("editHora").value = (cita.hora || "").slice(0, 5);
    document.getElementById("editDescripcion").value = cita.descripcion || "";
    citaEditando = id;
    cambiarVista(vistaEditarCita);
  }

  async function eliminarCita(id) {
    if (!confirm("¿Seguro que quieres eliminar esta cita?")) return;
    const res = await fetch(`http://localhost:5000/citas/${id}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.mensaje);
    cargarCitas(usuario_id);
  }
});
