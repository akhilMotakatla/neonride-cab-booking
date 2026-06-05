namespace CabBooking.API.Models;

public class Ride
{
    public string RideId { get; set; } = Guid.NewGuid().ToString();
    public string PassengerType { get; set; } = "Guest"; // Registered | Guest
    public int? UserId { get; set; }
    public string? GuestSessionId { get; set; }
    public string PickupAddress { get; set; } = string.Empty;
    public string DropoffAddress { get; set; } = string.Empty;
    public double PickupLat { get; set; }
    public double PickupLng { get; set; }
    public double DropoffLat { get; set; }
    public double DropoffLng { get; set; }
    public string RideTier { get; set; } = "Economy"; // Economy | Premium | SUV | Luxury
    public double Fare { get; set; }
    public string Status { get; set; } = "Searching"; // Searching | DriverArriving | Active | Completed | Cancelled
    public string? DriverName { get; set; }
    public string? DriverVehicle { get; set; }
    public double? DriverRating { get; set; }
    public int? EtaMinutes { get; set; }
    public string? GuestEmail { get; set; }
    public string? GuestPhone { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User? User { get; set; }
}
