using FoodGenerator.Database;
using FoodGenerator.Database.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodGenerator.Controllers
{
	[ApiController]
	[Route("[controller]/[action]")]
	[Authorize]
	public class ApiController : ControllerBase
	{
		private readonly DatabaseContext _context;

		public ApiController(DatabaseContext context)
		{
			_context = context;
		}

		[HttpPost]
		public Food CreateFood(Food food)
		{
			_context.Add(food);

			var ingredients = _context.Ingredients.Where(i => food.IngredientsIds.Contains(i.Id));
			var foodIngredients = ingredients.Select(i => new FoodIngredient
			{
				IngredientdId = i.Id,
				FoodsId = food.Id
			}).ToList();
			
			food.FoodIngredients = foodIngredients;

			_context.SaveChanges();

			return food;
		}

		[HttpGet]
		public List<Food> ReadFoods()
		{
			var foods = _context.Foods.Include(i => i.FoodIngredients).ToList().Select(i =>
			{
				i.IngredientsIds = i.FoodIngredients.Select(x => x.IngredientdId).ToList();

				return i;
			}).ToList();

			return foods;
		}

		[HttpPut]
		public Food UpdateFood(string id, Food updatedItem)
		{
			var currentFood = _context.Foods.FirstOrDefault(i => i.Id == id);

			using (var tran = _context.Database.BeginTransaction())
			{
				try
				{

					var recordsToRemove = _context.FoodIngredients.Where(i => i.FoodsId == id);
					_context.FoodIngredients.RemoveRange(recordsToRemove);
					_context.SaveChanges();

					
					currentFood.Name = updatedItem.Name;
					currentFood.DaysCount = updatedItem.DaysCount;
					currentFood.Type = updatedItem.Type;

					//assign new ingredients 
					var ingredients = _context.Ingredients.Where(i => updatedItem.IngredientsIds.Contains(i.Id));
					var foodIngredients = ingredients.Select(i => new FoodIngredient
					{
						IngredientdId = i.Id,
						FoodsId = id
					}).ToList();
					currentFood.FoodIngredients = foodIngredients;

					_context.SaveChanges();

					tran.Commit();
				}catch
				{
					tran.Rollback();
				}

			}

			return currentFood;
		}

		[HttpDelete]
		public bool DeleteFood(string id)
		{
			var food = _context.Foods.FirstOrDefault(i => i.Id == id);

			_context.Foods.Remove(food);
			_context.SaveChanges();

			return true;
		}

		[HttpPost]
		public Ingredient CreateIngredient(Ingredient ingredient)
		{
			_context.Add(ingredient);
			_context.SaveChanges();

			return ingredient;
		}

		[HttpGet]
		public IQueryable<Ingredient> ReadIngredients()
		{
			return _context.Ingredients;
		}

		[HttpPut]
		public Ingredient UpdateIngredient(string id, Ingredient updatedItem)
		{
			var currentIngredient = _context.Ingredients.FirstOrDefault(i => i.Id == id);

			currentIngredient.Name = updatedItem.Name;

			_context.SaveChanges();

			return currentIngredient;
		}

		[HttpDelete]
		public bool DeleteIngredient(string id)
		{
			var ingredient = _context.Ingredients.FirstOrDefault(i => i.Id == id);

			_context.Ingredients.Remove(ingredient);
			_context.SaveChanges();

			return true;
		}

		[HttpPost]
		public IActionResult SaveFood(List<SavedFood> savedFood)
		{
			using(var tran = _context.Database.BeginTransaction())
			{
				try
				{
					var dates = savedFood.Select(i => i.FoodDate).ToList();

					//do not replicate current date
					var toRemove = _context.SavedFood.Where(i => dates.Contains(i.FoodDate)).ToList();
					_context.RemoveRange(toRemove);
					_context.SaveChanges();

					//add new
					_context.AddRange(savedFood);
					_context.SaveChanges();

					tran.Commit();
				}
				catch (Exception ex)
				{
					tran.Rollback();
				}
			}
			

			return Ok();
		}

		[HttpGet]
		public IQueryable<SavedFood> ReadSavedFood(DateTime startDate, DateTime endDate)
		{
			var query = from n in _context.SavedFood
						orderby n.FoodDate
						where n.FoodDate >= startDate && n.FoodDate <= endDate
						select n;
			return query;
		}
	}
}
