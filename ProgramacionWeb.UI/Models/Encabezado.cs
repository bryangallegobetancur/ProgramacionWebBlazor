using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProgramacionWeb.UI.Models
{
    public class Encabezado
    {
        [Key]
        [Column("IDEncabezado")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IDEncabezado { get; set; }

        public string Nombre { get; set; }
        public string Ciudad { get; set; }
        public string Direccion { get; set; }
        public string Celular { get; set; }
    }
}
