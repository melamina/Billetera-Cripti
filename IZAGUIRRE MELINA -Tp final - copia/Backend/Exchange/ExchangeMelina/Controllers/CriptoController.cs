using Microsoft.AspNetCore.Mvc;

namespace ExchangeMelina.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CriptoController : Controller
    {
        [HttpGet("{moneda}/{fiat}/{cantidad}")]
        public async Task<IActionResult> ObtenerCotizacion(string moneda, string fiat, decimal cantidad)
        {
            using var client = new HttpClient();
            var url = $"https://criptoya.com/api/{moneda}/{fiat}/{cantidad}";

            try
            {
                var response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode(); // lanza excepción si falla
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

