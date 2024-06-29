using FluentCMS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FluentCMS.Data;

public class AppDbContext: IdentityDbContext <IdentityUser>
{
    public AppDbContext(){}
    public AppDbContext(DbContextOptions<AppDbContext> options):base(options){}
    public DbSet<Schema> Schemas { get; set; } = null!;
}
