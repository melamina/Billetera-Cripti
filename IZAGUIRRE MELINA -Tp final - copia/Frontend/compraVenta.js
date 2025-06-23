document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const Abreviatura = document.getElementById("Abreviatura").value;
    const Action = document.getElementById("Accion").value;
    const Cantidad = parseFloat(document.getElementById("Cantidad").value);
    const Fecha = document.getElementById("Fecha").value;
    const fiat = "ars";

    if (Cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    try {
      const criptoResponse = await fetch(
        `http://localhost:5164/api/cripto/${Abreviatura}/${fiat}/${Cantidad}`
      );

      if (!criptoResponse.ok) {
        throw new Error("Error al obtener cotización");
      }

      const data = await criptoResponse.json();

      let precioUnitario;

      if (Action === "purchase") {
        precioUnitario = data.ask;
      } else {
        precioUnitario = data.bid;
      }

      const Cotizacion = parseFloat((precioUnitario * Cantidad).toFixed(2));

      const transaccion = {
        Abreviatura,
        Action,
        Cantidad,
        Cotizacion,
        Fecha,
      };

      const res = await fetch("http://localhost:5164/Transaccions/Create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaccion),
      });

      if (!res.ok) {
        throw new Error("Error al guardar la transacción");
      }

      alert("Transacción registrada correctamente");
      formulario.reset();

    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error durante la operación");
    }
  });
});
