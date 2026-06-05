namespace CabBooking.API.DTOs;

public record RegisterRequest(string FullName, string Email, string Password, string? PhoneNumber);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, int UserId, string FullName, string Email);
