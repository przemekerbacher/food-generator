using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodGenerator.Migrations
{
    /// <inheritdoc />
    public partial class renameingredients : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodIngredients_Ingredeints_IngredientId",
                table: "FoodIngredients");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Ingredeints",
                table: "Ingredeints");

            migrationBuilder.RenameTable(
                name: "Ingredeints",
                newName: "Ingredients");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Ingredients",
                table: "Ingredients",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FoodIngredients_Ingredients_IngredientId",
                table: "FoodIngredients",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodIngredients_Ingredients_IngredientId",
                table: "FoodIngredients");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Ingredients",
                table: "Ingredients");

            migrationBuilder.RenameTable(
                name: "Ingredients",
                newName: "Ingredeints");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Ingredeints",
                table: "Ingredeints",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FoodIngredients_Ingredeints_IngredientId",
                table: "FoodIngredients",
                column: "IngredientId",
                principalTable: "Ingredeints",
                principalColumn: "Id");
        }
    }
}
