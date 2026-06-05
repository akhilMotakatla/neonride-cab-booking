namespace CabBooking.API.DTOs;

public record EstimateRequest(
    double PickupLat, double PickupLng,
    double DropoffLat, double DropoffLng,
    string PickupAddress, string DropoffAddress
);

public record TierEstimate(string Tier, double Fare, int EtaMinutes, string Description, string Icon);

public record EstimateResponse(List<TierEstimate> Tiers, double DistanceKm);

public record BookRideRequest(
    string PickupAddress, string DropoffAddress,
    double PickupLat, double PickupLng,
    double DropoffLat, double DropoffLng,
    string RideTier,
    double Fare,
    int? UserId,
    string? GuestSessionId,
    string? GuestEmail,
    string? GuestPhone
);

public record RideResponse(
    string RideId, string Status, string PickupAddress, string DropoffAddress,
    string RideTier, double Fare, string? DriverName, string? DriverVehicle,
    double? DriverRating, int? EtaMinutes, string PassengerType, DateTime CreatedAt
);

public record TrackResponse(
    string RideId, string Status, string? DriverName, string? DriverVehicle,
    double? DriverRating, int? EtaMinutes,
    double PickupLat, double PickupLng,
    double DropoffLat, double DropoffLng,
    string PickupAddress, string DropoffAddress
);
