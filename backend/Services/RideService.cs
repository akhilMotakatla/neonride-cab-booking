using CabBooking.API.Data;
using CabBooking.API.DTOs;
using CabBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CabBooking.API.Services;

public class RideService
{
    private readonly AppDbContext _db;
    private static readonly string[] DriverNames = ["Marcus Johnson", "Priya Patel", "Carlos Rivera", "Aisha Thompson", "David Chen", "Sofia Martinez"];
    private static readonly string[] EconomyVehicles = ["Toyota Corolla (Silver)", "Honda Civic (White)", "Hyundai Elantra (Gray)"];
    private static readonly string[] PremiumVehicles = ["Toyota Camry (Black)", "Honda Accord (Navy)", "Nissan Altima (White)"];
    private static readonly string[] SuvVehicles = ["Ford Explorer (Black)", "Toyota Highlander (Silver)", "Chevrolet Tahoe (White)"];
    private static readonly string[] LuxuryVehicles = ["Mercedes-Benz E-Class (Black)", "BMW 5 Series (Midnight Blue)", "Audi A6 (Obsidian)"];

    public RideService(AppDbContext db) => _db = db;

    public EstimateResponse GetEstimate(EstimateRequest req)
    {
        var distKm = HaversineKm(req.PickupLat, req.PickupLng, req.DropoffLat, req.DropoffLng);
        distKm = Math.Max(distKm, 1.0);

        var tiers = new List<TierEstimate>
        {
            new("Economy",  Math.Round(distKm * 1.20 + 2.50, 2), (int)(distKm * 2.5 + 3), "Affordable & Comfortable", "🚗"),
            new("Premium",  Math.Round(distKm * 1.85 + 3.00, 2), (int)(distKm * 2.2 + 2), "Top-Rated Drivers",         "🚙"),
            new("SUV",      Math.Round(distKm * 2.40 + 4.00, 2), (int)(distKm * 2.0 + 4), "Spacious for Groups",       "🚐"),
            new("Luxury",   Math.Round(distKm * 3.50 + 6.00, 2), (int)(distKm * 1.8 + 2), "Premium Black Car Service", "✨"),
        };

        return new EstimateResponse(tiers, Math.Round(distKm, 2));
    }

    public async Task<Ride> BookRideAsync(BookRideRequest req)
    {
        var rng = new Random();
        var driverName = DriverNames[rng.Next(DriverNames.Length)];
        var vehicles = req.RideTier switch
        {
            "Premium" => PremiumVehicles,
            "SUV"     => SuvVehicles,
            "Luxury"  => LuxuryVehicles,
            _         => EconomyVehicles,
        };
        var plate = $"{(char)('A' + rng.Next(26))}{(char)('A' + rng.Next(26))}{rng.Next(1000, 9999)}";

        var ride = new Ride
        {
            RideId         = Guid.NewGuid().ToString(),
            PassengerType  = req.UserId.HasValue ? "Registered" : "Guest",
            UserId         = req.UserId,
            GuestSessionId = req.GuestSessionId,
            GuestEmail     = req.GuestEmail,
            GuestPhone     = req.GuestPhone,
            PickupAddress  = req.PickupAddress,
            DropoffAddress = req.DropoffAddress,
            PickupLat      = req.PickupLat,
            PickupLng      = req.PickupLng,
            DropoffLat     = req.DropoffLat,
            DropoffLng     = req.DropoffLng,
            RideTier       = req.RideTier,
            Fare           = req.Fare,
            Status         = "Searching",
            DriverName     = driverName,
            DriverVehicle  = $"{vehicles[rng.Next(vehicles.Length)]} · {plate}",
            DriverRating   = Math.Round(4.6 + rng.NextDouble() * 0.4, 1),
            EtaMinutes     = rng.Next(3, 12),
        };

        _db.Rides.Add(ride);
        await _db.SaveChangesAsync();
        return ride;
    }

    public async Task<Ride?> GetRideAsync(string rideId) =>
        await _db.Rides.FirstOrDefaultAsync(r => r.RideId == rideId);

    public async Task<bool> CancelRideAsync(string rideId)
    {
        var ride = await _db.Rides.FirstOrDefaultAsync(r => r.RideId == rideId);
        if (ride is null || ride.Status is "Completed" or "Cancelled") return false;
        ride.Status = "Cancelled";
        await _db.SaveChangesAsync();
        return true;
    }

    // Simulate status progression based on age of ride
    public string GetSimulatedStatus(Ride ride)
    {
        if (ride.Status is "Completed" or "Cancelled") return ride.Status;
        var age = (DateTime.UtcNow - ride.CreatedAt).TotalSeconds;
        return age switch
        {
            < 15  => "Searching",
            < 60  => "DriverArriving",
            < 300 => "Active",
            _     => "Completed",
        };
    }

    private static double HaversineKm(double lat1, double lng1, double lat2, double lng2)
    {
        const double R = 6371;
        var dLat = ToRad(lat2 - lat1);
        var dLng = ToRad(lng2 - lng1);
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2)
              + Math.Cos(ToRad(lat1)) * Math.Cos(ToRad(lat2))
              * Math.Sin(dLng / 2) * Math.Sin(dLng / 2);
        return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    }
    private static double ToRad(double deg) => deg * Math.PI / 180;
}
