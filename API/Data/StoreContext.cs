using Microsoft.EntityFrameworkCore;
using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using API.Entities.OrderAggregate;

namespace API.Data
{
  public class StoreContext : IdentityDbContext<User, Role, int>
  {
    public StoreContext(DbContextOptions options) : base(options)
    {
    }
    public DbSet<Product> Products { get; set; }
    public DbSet<Cart> Carts { get; set; }

    public DbSet<Order> Orders { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      builder.Entity<User>()
      .HasOne(a => a.Address)
      .WithOne() //A user has one address with one user effectively
      .HasForeignKey<UserAddress>(a => a.Id)
      .OnDelete(DeleteBehavior.Cascade); //Because we want our user address to be deleted if we delete a user entity.


      builder.Entity<Role>()
      .HasData(
        new Role { Id = 1, Name = "Member", NormalizedName = "MEMBER" },
        new Role { Id = 2, Name = "Admin", NormalizedName = "ADMIN" }
      );
    }
  }
}