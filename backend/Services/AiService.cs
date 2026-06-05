using CabBooking.API.Data;
using CabBooking.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CabBooking.API.Services;

public class AiService
{
    private readonly AppDbContext _db;
    public AiService(AppDbContext db) => _db = db;

    public async Task<AiChatResponse> ProcessAsync(AiChatRequest req)
    {
        var msg = req.Message.ToLowerInvariant();
        string? rideStatus = null;

        // Ride-specific intent
        if (!string.IsNullOrEmpty(req.CurrentRideId))
        {
            var ride = await _db.Rides.FirstOrDefaultAsync(r => r.RideId == req.CurrentRideId);
            if (ride is not null)
            {
                var ageSeconds = (DateTime.UtcNow - ride.CreatedAt).TotalSeconds;
                rideStatus = ride.Status is "Completed" or "Cancelled" ? ride.Status
                    : ageSeconds < 15  ? "Searching"
                    : ageSeconds < 60  ? "DriverArriving"
                    : ageSeconds < 300 ? "Active"
                    : "Completed";

                if (IsTrackingIntent(msg))
                {
                    var reply = rideStatus switch
                    {
                        "Searching"      => $"We're still matching you with the best available driver nearby. This usually takes less than 60 seconds — hang tight!",
                        "DriverArriving" => $"Great news! {ride.DriverName} is on the way to you in a {ride.DriverVehicle}. ETA: ~{ride.EtaMinutes} minutes.",
                        "Active"         => $"You're currently on your way to {ride.DropoffAddress}. Sit back and enjoy the ride!",
                        "Completed"      => $"Your ride to {ride.DropoffAddress} has been completed. We hope it was a great experience!",
                        "Cancelled"      => "This ride was cancelled. Would you like to book a new ride?",
                        _                => "I'm checking on your ride right now…"
                    };
                    return new AiChatResponse(reply, rideStatus);
                }

                if (IsCancelIntent(msg))
                {
                    if (rideStatus is "Completed" or "Cancelled")
                        return new AiChatResponse("This ride can no longer be cancelled — it's already " + rideStatus.ToLower() + ".", rideStatus);
                    return new AiChatResponse("To cancel your ride, tap the 'Cancel Ride' button on the tracking screen. Your safety matters to us.", rideStatus);
                }

                if (IsDriverIntent(msg))
                {
                    var reply = $"Your driver is {ride.DriverName}, rated {ride.DriverRating:F1}★. They're driving a {ride.DriverVehicle}.";
                    return new AiChatResponse(reply, rideStatus);
                }
            }
        }

        // General pre-booking intent
        var generalReply = GetGeneralReply(msg);
        return new AiChatResponse(generalReply, rideStatus);
    }

    private static bool IsTrackingIntent(string msg) =>
        msg.Contains("where") || msg.Contains("track") || msg.Contains("status") ||
        msg.Contains("how long") || msg.Contains("eta") || msg.Contains("arrive");

    private static bool IsCancelIntent(string msg) =>
        msg.Contains("cancel") || msg.Contains("stop") || msg.Contains("refund");

    private static bool IsDriverIntent(string msg) =>
        msg.Contains("driver") || msg.Contains("car") || msg.Contains("vehicle") || msg.Contains("who");

    private static string GetGeneralReply(string msg)
    {
        if (msg.Contains("price") || msg.Contains("cost") || msg.Contains("fare") || msg.Contains("how much"))
            return "Pricing is dynamic and based on distance. Economy starts at ~$1.20/km, Premium at ~$1.85/km, SUV at ~$2.40/km, and Luxury at ~$3.50/km. Use the booking form for an exact estimate!";

        if (msg.Contains("luggage") || msg.Contains("bag") || msg.Contains("luggage"))
            return "All ride tiers allow standard luggage. For extra-large items or more than 3 bags, we recommend booking an SUV for added space.";

        if (msg.Contains("pet") || msg.Contains("dog") || msg.Contains("cat"))
            return "We're pet-friendly! Small pets in carriers are allowed in Economy and Premium rides. For larger pets, please book an SUV and let the driver know in advance.";

        if (msg.Contains("safety") || msg.Contains("sos") || msg.Contains("emergency"))
            return "Your safety is our top priority. Every ride has a built-in SOS button on the tracking screen that immediately contacts emergency services. All drivers are background-checked.";

        if (msg.Contains("guest") || msg.Contains("without account") || msg.Contains("no account"))
            return "Yes! You can book a complete ride as a guest — no account needed. Just provide an email or phone number for ride updates, and you're good to go.";

        if (msg.Contains("luxury") || msg.Contains("premium"))
            return "Our Luxury tier features top-rated professional drivers in premium vehicles like Mercedes-Benz, BMW, or Audi. Perfect for business travel or special occasions.";

        if (msg.Contains("hello") || msg.Contains("hi") || msg.Contains("hey"))
            return "Hey there! 👋 I'm your NeonRide AI assistant. I can help with pricing, tracking your ride, cancellations, or any questions about our service. How can I help?";

        if (msg.Contains("cancel") || msg.Contains("refund"))
            return "You can cancel a ride before the driver arrives at no charge. Once the driver is en route, a small cancellation fee may apply. Refunds are processed within 3–5 business days.";

        if (msg.Contains("payment") || msg.Contains("pay") || msg.Contains("credit") || msg.Contains("card"))
            return "We accept all major credit/debit cards, Apple Pay, and Google Pay. Payment is processed automatically after your ride completes.";

        if (msg.Contains("suv") || msg.Contains("group") || msg.Contains("family"))
            return "Our SUV tier seats up to 6 passengers comfortably and has extra luggage space — perfect for groups, families, or airport trips with heavy bags.";

        return "I'm here to help with your NeonRide experience! You can ask me about pricing, ride types, cancellations, pet policies, or tracking your current trip. What would you like to know?";
    }
}
