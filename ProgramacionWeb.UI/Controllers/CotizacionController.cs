using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ProgramacionWeb.UI.Data;
using ProgramacionWeb.UI.Models;

namespace ProgramacionWeb.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CotizacionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;


        public CotizacionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Insertar cotización
        [HttpPost]
        public async Task<IActionResult> PostCotizacion([FromBody] Cotizacion cotizacion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.Cotizacion.Add(cotizacion);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Cotización guardada exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message });
            }
        }
        // Consultar todas las cotizaciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cotizacion>>> GetCotizacion()
        {
            return await _context.Cotizacion.ToListAsync();
        }
    }
}
