using Microsoft.AspNetCore.Mvc;
using ExchangeMelina.Data;
using ExchangeMelina.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ExchangeMelina.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CriptoController : Controller
    {
        private readonly AppDbContext _context;

        public CriptoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("monedas")]
        public async Task<IActionResult> ObtenerMonedasDesdeDb()
        {
            var monedas = await _context.Monedas.ToListAsync();

            var resultado = monedas.Select(m => new
            {
                id = m.Id,
                abreviatura = m.Abreviatura,
                nombre = m.Nombre
            });

            return Ok(resultado);
        }

        [HttpGet("{moneda}/{fiat}/{cantidad}")]
        public async Task<IActionResult> ObtenerCotizacion(string moneda, string fiat, decimal cantidad)
        {
            using var client = new HttpClient();
            var url = $"https://criptoya.com/api/{moneda}/{fiat}/{cantidad}";

            try
            {
                var response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                return Content(content, "application/json");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener cotización: {ex.Message}");
            }
        }
    }
}
        //[HttpGet("monedas")]
        //public async Task<IActionResult> ObtenerMonedasDesdeCriptoYa()
        //{
        //    try
        //    {
        //        using var http = new HttpClient();
        //        var json = await http.GetStringAsync("https://criptoya.com/api/p2p");

        //        var monedasFiltradas = new[] { "btc", "eth", "usdc", "usdt", "bnb", "dai" };
        //        var jsonData = JsonDocument.Parse(json).RootElement;

        //        var resultado = new List<object>();

        //        foreach (var moneda in monedasFiltradas)
        //        {
        //            if (jsonData.TryGetProperty(moneda, out var _))
        //            {
        //                resultado.Add(new { abreviatura = moneda, nombre = moneda.ToUpper() });
        //            }
        //        }

        //        return Ok(resultado);
        //    }
        //    catch
        //    {
        //        return StatusCode(500, "Error al consultar CriptoYa");
        //    }
        //}
