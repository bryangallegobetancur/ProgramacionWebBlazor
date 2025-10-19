using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProgramacionWeb.UI.Models
{
    public class Cotizacion
    {
        [Key]
        [Column("IDCotizacion")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IDCotizacion { get; set; }
        public int IDEncabezado { get; set; }
        public int IDProducto { get; set; }
        public int Cantidad { get; set; }
    }
}
