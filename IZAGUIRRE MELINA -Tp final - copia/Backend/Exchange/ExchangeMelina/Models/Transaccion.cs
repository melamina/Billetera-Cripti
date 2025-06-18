namespace ExchangeMelina.Models
{
    public class Transaccion
    {
        public int Id { get; set; }
        public int MonedaId { get; set; }
        public double Cantidad { get; set; }
        public double Cotizacion { get; set; }
        public DateTime Fecha { get; set; }
        public Moneda? moneda { get; set; }
    }
}
