using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FoodGenerator.Database.Models
{
	public class Food
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public string Id { get; set; }
		public string Name { get; set; }
		public FoodTypes Type { get; set; }
        public byte DaysCount { get; set; }

        public List<FoodIngredient> FoodIngredients { get; set; } = new List<FoodIngredient>();
        public List<SavedFood> SavedFood { get; set; }

        [NotMapped]
        public List<string> IngredientsIds { get; set; } = new List<string>();
    }
}
