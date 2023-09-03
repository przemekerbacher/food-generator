using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FoodGenerator.Database.Models
{
	[PrimaryKey(nameof(FoodsId), nameof(IngredientdId))]
	public class FoodIngredient
	{
		public string FoodsId { get; set; }
		public string IngredientdId { get; set; }

        public Ingredient Ingredient { get; set; }
        public Food Food { get; set; }
    }
}
