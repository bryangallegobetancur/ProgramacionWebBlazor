using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ProgramacionWeb.UI.Data;
using ProgramacionWeb.UI.Models;

namespace ProgramacionWeb.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EncabezadoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;


        public EncabezadoController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Insertar Encabezado
        [HttpPost]
        public async Task<IActionResult> PostEncabezado([FromBody] Encabezado encabezado)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.Encabezado.Add(encabezado);
                await _context.SaveChangesAsync();
                return Ok(new { idEncabezado = encabezado.IDEncabezado });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        // Consultar Detalle
        [HttpGet("detalle/{id}")]
        public async Task<IActionResult> GetCotizacionDetalle(int id)
        {
            var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();

            using var command = connection.CreateCommand();
            command.CommandText = "sp_ConsultarCotizacion";
            command.CommandType = System.Data.CommandType.StoredProcedure;

            var param = command.CreateParameter();
            param.ParameterName = "@IDEncabezado";
            param.Value = id;
            command.Parameters.Add(param);

            var encabezado = new Dictionary<string, object>();
            var cotizaciones = new List<Dictionary<string, object>>();

            using (var reader = await command.ExecuteReaderAsync())
            {
                if (await reader.ReadAsync())
                {
                    encabezado["IDEncabezado"] = reader["IDEncabezado"];
                    encabezado["Nombre"] = reader["Nombre"];
                    encabezado["Ciudad"] = reader["Ciudad"];
                    encabezado["Direccion"] = reader["Direccion"];
                    encabezado["Celular"] = reader["Celular"];
                }

                if (await reader.NextResultAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        cotizaciones.Add(new Dictionary<string, object>
                        {
                            ["Nro Artículo"] = reader["Nro Artículo"],
                            ["Producto"] = reader["Producto"],
                            ["Cantidad"] = reader["Cantidad"],
                            ["PrecioUnit"] = reader["PrecioUnit"],
                            ["Total"] = reader["Total"]
                        });
                    }
                }
            }

            await connection.CloseAsync();

            return Ok(new { Encabezado = encabezado, Cotizaciones = cotizaciones });
        }

    }
}
