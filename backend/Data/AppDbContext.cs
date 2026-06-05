using CabBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CabBooking.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Ride> Rides => Set<Ride>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.UserId);
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.FullName).IsRequired();
            e.Property(u => u.Email).IsRequired();
            e.Property(u => u.PasswordHash).IsRequired();
        });

        modelBuilder.Entity<Ride>(e =>
        {
            e.HasKey(r => r.RideId);
            e.HasIndex(r => r.UserId);
            e.HasIndex(r => r.GuestSessionId);
            e.HasIndex(r => r.Status);
            e.HasOne(r => r.User)
             .WithMany(u => u.Rides)
             .HasForeignKey(r => r.UserId)
             .IsRequired(false);
            e.Property(r => r.PassengerType)
             .HasConversion<string>();
        });
    }
}
