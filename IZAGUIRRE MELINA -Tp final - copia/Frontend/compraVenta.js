document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const Abreviatura = document.getElementById("Abreviatura").value;
    const Action = document.getElementById("Accion").value;
    const Cantidad = parseFloat(document.getElementById("Cantidad").value);
    const Fecha = new Date();
    //const Fecha = document.getElementById("Fecha").value;
    const fiat = "ars";

    if (Cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0");
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
        //alert(precioUnitario);
        break;
      }
       /* for (const item of data) {
          let precioUnitario;

          if (Action === "purchase") {
          precioUnitario = item.ask;
          } else {
           precioUnitario = item.bid;
          }
        }*/

      /* for (const [exchange, item] of Object.entries(data)) {
          let precioUnitario = Action === "purchase" ? item.ask : item.bid;
         console.log(`Exchange: ${exchange}, Precio: $${precioUnitario}`);
        }*/
       
       
         /*if (Action === "purchase") {
         precioUnitario = data.ask;
        } else {
         precioUnitario = data.bid;
         }*/

          //for (const [exchange, item] of Object.entries(data)) {
          /*for (const exchange in data) {
            const precioUnitario = Action === "purchase" ? data[exchange].totalAsk : data[exchange].totalBid;

            /*if (precio < 10000000) { // solo si el precio es menor a 10 millones
            sumatoria += precio;
             cantidadExchanges++;
            }*/
          
      const Cotizacion = parseFloat((precioUnitario * Cantidad).toFixed(2));
            //alert(Cotizacion);
      const transaccion = {
        Id: 0,
        MonedaId: 1,
        Cantidad,
        Cotizacion,
        Fecha,
      };

        alert(JSON.stringify(transaccion));

        const res = await fetch("http://localhost:5164/Transaccions/Create", {
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


      alert("Transacción registrada correctamente");
      formulario.reset();

    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error durante la operación");
    }
  });
});
