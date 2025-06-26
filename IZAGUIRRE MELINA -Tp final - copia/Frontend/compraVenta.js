let listaMonedas = [];
document.addEventListener("DOMContentLoaded", () => {
  cargarMonedasDesdeBackend();

  const formulario = document.getElementById("formulario");

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const Abreviatura = document.getElementById("Abreviatura").value;
    const Action = document.getElementById("Accion").value;
    const Cantidad = parseFloat(document.getElementById("Cantidad").value);
    const Fecha = new Date();
    const fiat = "ars";

    if (Cantidad <= 0) {
      mostrarMensaje("La cantidad debe ser mayor a 0");
      return;
    }

    try {
      const criptoResponse = await fetch(
        `http://localhost:5164/api/cripto/${Abreviatura}/${fiat}/1`
      );

      if (!criptoResponse.ok) {
        throw new Error("Error al obtener cotización");
      }

      const data = await criptoResponse.json();

      let precioUnitario;
      for (const exchange in data) {
        precioUnitario = data[exchange].totalBid;
      }

      const Cotizacion = parseFloat((precioUnitario * Cantidad).toFixed(2));
      
      let cotizacionFinal = Cotizacion;
      // si es una venta - cotización negativa
      if (Action === "sale") {
        cotizacionFinal *= -1;
      }

      const monedaSeleccionada = listaMonedas.find(
        (m) => m.abreviatura === Abreviatura
      );

      if (!monedaSeleccionada) {
        mostrarMensaje("No se encontró la moneda seleccionada.");
        return;
      }

      const transaccion = {
        Id: 0,
        MonedaId: monedaSeleccionada.id,
        Cantidad,
       Cotizacion: cotizacionFinal,
        Fecha
      };

      const res = await fetch("http://localhost:5164/api/transaccion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaccion),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Respuesta del servidor:", errorText);
        throw new Error("Error al guardar la transacción: " + errorText);
      }

      mostrarMensaje("Transacción registrada correctamente");
      formulario.reset();
    } catch (error) {
      console.error("Error:", error);
      mostrarMensaje("Ocurrió un error durante la operación");
    }
  });
});

function cargarMonedasDesdeBackend() {
  const select = document.getElementById("Abreviatura");
  select.innerHTML = "";

  listaMonedas = [
    { id: 1, abreviatura: "btc", nombre: "Bitcoin" },
    { id: 3, abreviatura: "eth", nombre: "Ethereum" },
    { id: 4, abreviatura: "usdc", nombre: "USDC" },
    { id: 5, abreviatura: "usdt", nombre: "USDT" },
    { id: 6, abreviatura: "bnb", nombre: "BNB" },
    { id: 8, abreviatura: "dai", nombre: "DAI" }
  ];

  listaMonedas.forEach((mon) => {
    const option = document.createElement("option");
    option.value = mon.abreviatura;
    option.textContent = `${mon.nombre} (${mon.abreviatura.toUpperCase()})`;
    select.appendChild(option);
  });
}

function mostrarMensaje(texto) {
  let mensajeDiv = document.getElementById("mensaje");
  if (!mensajeDiv) {
    mensajeDiv = document.createElement("div");
    mensajeDiv.id = "mensaje";
    mensajeDiv.style.position = "fixed";
    mensajeDiv.style.top = "20px";
    mensajeDiv.style.left = "50%";
    mensajeDiv.style.transform = "translateX(-50%)";
    mensajeDiv.style.padding = "10px 20px";
    mensajeDiv.style.background = "#dff0d8";
    mensajeDiv.style.color = "#3c763d";
    mensajeDiv.style.border = "1px solid #3c763d";
    mensajeDiv.style.borderRadius = "5px";
    mensajeDiv.style.zIndex = "9999";
    document.body.appendChild(mensajeDiv);
  }

  mensajeDiv.innerText = texto;
  mensajeDiv.style.display = "block";
  setTimeout(() => (mensajeDiv.style.display = "none"), 3000);
}
