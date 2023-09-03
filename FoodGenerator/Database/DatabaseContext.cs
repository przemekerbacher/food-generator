using FoodGenerator.Database.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Hosting;

namespace FoodGenerator.Database
{
	public class DatabaseContext : IdentityDbContext
	{
		public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
		{

		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
			ConsiderDateTimeAsUTC(modelBuilder);
		}

		public DbSet<Food> Foods { get; set; }
		public DbSet<Ingredient> Ingredients { get; set; }
		public DbSet<FoodIngredient> FoodIngredients { get; set; }
		public DbSet<SavedFood> SavedFood { get; set; }

		private void ConsiderDateTimeAsUTC(ModelBuilder modelBuilder)
		{
			var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
							v => v.ToUniversalTime(),
							v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

			var nullableDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
				v => v.HasValue ? v.Value.ToUniversalTime() : v,
				v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v);

			foreach (var entityType in modelBuilder.Model.GetEntityTypes())
			{
				if (entityType.IsKeyless)
				{
					continue;
				}

				foreach (var property in entityType.GetProperties())
				{
					if (property.ClrType == typeof(DateTime))
					{
						property.SetValueConverter(dateTimeConverter);
					}
					else if (property.ClrType == typeof(DateTime?))
					{
						property.SetValueConverter(nullableDateTimeConverter);
					}
				}
			}
		}
	}
}
