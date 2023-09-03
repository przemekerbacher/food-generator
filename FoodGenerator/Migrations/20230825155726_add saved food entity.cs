using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodGenerator.Migrations
{
    /// <inheritdoc />
    public partial class addsavedfoodentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SavedFood",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FoodDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FoodId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedFood", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavedFood_Foods_FoodId",
                        column: x => x.FoodId,
                        principalTable: "Foods",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_SavedFood_FoodId",
                table: "SavedFood",
                column: "FoodId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SavedFood");
        }
    }
}
