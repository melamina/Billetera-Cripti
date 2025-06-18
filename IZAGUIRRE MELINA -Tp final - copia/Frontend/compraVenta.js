document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");

  console.log(window.location.origin);

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const Abreviatura = document.getElementById("Abreviatura").value;
    const Action = document.getElementById("accion").value;
    const Cantidad = parseFloat(document.getElementById("Cantidad").value);
    const Fecha = document.getElementById("Fecha").value;
    const fiat = "ars";

    if (Cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    try {
     
      const response = await fetch(`https://criptoya.com/api/${Abreviatura}/${fiat}/${Cantidad}`);
      if (!response.ok) {
      throw new Error("Error al obtener datos");
      }
      const data = await response.json();

     let precioUnitario;

      if (action === "purchase") {
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
      alert("Hubo un problema al registrar la transacción");
    }
  });
});