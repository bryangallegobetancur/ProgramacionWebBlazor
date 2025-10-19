using Microsoft.EntityFrameworkCore;
using ProgramacionWeb.UI.Models;

namespace ProgramacionWeb.UI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Cotizacion> Cotizacion { get; set; }

        public DbSet<Encabezado> Encabezado { get; set; }
    }
}
