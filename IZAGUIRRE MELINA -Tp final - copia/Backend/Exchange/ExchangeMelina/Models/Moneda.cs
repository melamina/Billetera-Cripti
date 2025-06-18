using System.Transactions;

namespace ExchangeMelina.Models
{
    public class Moneda
    {
        public int Id { get; set; }
        public string Abreviatura { get; set; }
        public string Nombre { get; set; }
        public List<Transaccion>? Transacciones { get; set; }
    }
}
