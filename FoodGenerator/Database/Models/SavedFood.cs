using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FoodGenerator.Database.Models
{
	public class SavedFood
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public string Id { get; set; }
        public DateTime FoodDate { get; set; }

        public string FoodId { get; set; }
		public Food Food { get; set; }

    }
}
