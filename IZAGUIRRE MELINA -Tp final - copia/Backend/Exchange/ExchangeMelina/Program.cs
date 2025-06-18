using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "PermitirFrontend",
        policy =>
        {
            policy.WithOrigins("http://127.0.0.1:5500") // tu HTML
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
builder.Services.AddControllersWithViews();


string cadena = builder.Configuration.GetConnectionString("CadenaSqlServer");

builder.Services.AddDbContext<ExchangeMelina.Data.AppDbContext>(options =>
    options.UseSqlServer(cadena));

var app = builder.Build();

app.UseCors("PermitirFrontend");

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
