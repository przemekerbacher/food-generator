using FoodGenerator.Migrations;
using FoodGenerator.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace FoodGenerator.Controllers
{
	[Authorize]
	public class HomeController : Controller
	{
		private readonly SignInManager<IdentityUser> _signInManager;

		public HomeController(SignInManager<IdentityUser> signInManager)
		{
			_signInManager = signInManager;
		}

		public IActionResult Index()
		{
			return View();
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		[AllowAnonymous]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}

		[AllowAnonymous]
		public IActionResult Login()
		{
			return View(new LoginModel());
		}

		[HttpPost]
		[ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromForm]LoginModel loginModel)
		{
			var result = await _signInManager.PasswordSignInAsync(loginModel.Email, loginModel.Password, true, false);

			if(result.Succeeded)
			{
				return RedirectToAction("Index", "Home");
			}else
			{
				ModelState.AddModelError(string.Empty, "No co ty nie wiesz jak się zalogować?");
				return View(loginModel);
			}
		}
	}
}