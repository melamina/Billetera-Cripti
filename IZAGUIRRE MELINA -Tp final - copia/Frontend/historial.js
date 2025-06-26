function cargarTransacciones() {
  fetch("http://localhost:5164/api/transacciones")
    .then(respuesta => {
      if (!respuesta.ok) {
        throw new Error("No se pudo cargar el historial");
      }
      return respuesta.json();
    })
    .then(transacciones => {
      const tabla = document.getElementById("tabla-transacciones");
      tabla.innerHTML = ""; 
      transacciones.forEach(t => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
          <td>${t.abreviatura ?? "N/D"}</td>
          <td>${t.cotizacion >= 0 ? "Compra" : "Venta"}</td>
          <td>${t.cantidad}</td>
          <td>$${t.cotizacion}</td>
          <td>${formatearFecha(t.fecha)}</td>
        `;

        tabla.appendChild(fila);
      });
    })
    .catch(error => {
      console.error("Error al cargar transacciones:", error);
    });
}

// Formato simple: 2025-06-17T20:00:00 => 17/06/2025 20:00
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  const hora = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  return `${dia}/${mes}/${año} ${hora}:${minutos}`;
}