using FoodGenerator.Database;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var developmentOrigins = "_localhost";

builder.Services
    .AddControllersWithViews()
    .AddRazorRuntimeCompilation()
    .AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddDbContext<DatabaseContext>(
        options => options.UseSqlServer("name=ConnectionStrings:DefaultConnection"));

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<DatabaseContext>();


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: developmentOrigins,
                      policy =>
                      {
                          policy
                          .WithOrigins("https://localhost:3000")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                      });
});

builder.Services.AddAuthentication();
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = new PathString("/Home/Login");
    options.ReturnUrlParameter = "";
});

var app = builder.Build();


if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

if (!app.Environment.IsDevelopment())
{
    app.UseAuthorization();
}

app.UseCors(developmentOrigins);

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

app.MigrateDatabase();
