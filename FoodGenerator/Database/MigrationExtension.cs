using Microsoft.EntityFrameworkCore;

namespace FoodGenerator.Database
{
    public static class MigrationExtension
    {
        public static IApplicationBuilder MigrateDatabase(this IApplicationBuilder app)
        {
            var dbContext = app.ApplicationServices.GetRequiredService<DatabaseContext>();
            dbContext.Database.Migrate();

            return app;
        }
    }
}
