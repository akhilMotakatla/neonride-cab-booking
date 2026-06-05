namespace CabBooking.API.DTOs;

public record AiChatRequest(string Message, string? CurrentRideId, bool IsGuest);
public record AiChatResponse(string Reply, string? RideStatus);
