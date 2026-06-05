using CabBooking.API.DTOs;
using CabBooking.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace CabBooking.API.Controllers;

[ApiController]
[Route("api/rides")]
public class RidesController : ControllerBase
{
    private readonly RideService _rideService;

    public RidesController(RideService rideService) => _rideService = rideService;

    [HttpPost("estimate")]
    public IActionResult GetEstimate([FromBody] EstimateRequest req)
    {
        var result = _rideService.GetEstimate(req);
        return Ok(result);
    }

    [HttpPost("book")]
    public async Task<IActionResult> BookRide([FromBody] BookRideRequest req)
    {
        if (req.UserId is null && string.IsNullOrEmpty(req.GuestSessionId))
            return BadRequest(new { message = "Either UserId or GuestSessionId is required." });

        var ride = await _rideService.BookRideAsync(req);
        return Ok(new RideResponse(
            ride.RideId, ride.Status, ride.PickupAddress, ride.DropoffAddress,
            ride.RideTier, ride.Fare, ride.DriverName, ride.DriverVehicle,
            ride.DriverRating, ride.EtaMinutes, ride.PassengerType, ride.CreatedAt
        ));
    }

    [HttpGet("track/{id}")]
    public async Task<IActionResult> TrackRide(string id)
    {
        var ride = await _rideService.GetRideAsync(id);
        if (ride is null) return NotFound(new { message = "Ride not found." });

        var simulatedStatus = _rideService.GetSimulatedStatus(ride);

        return Ok(new TrackResponse(
            ride.RideId, simulatedStatus, ride.DriverName, ride.DriverVehicle,
            ride.DriverRating, ride.EtaMinutes,
            ride.PickupLat, ride.PickupLng,
            ride.DropoffLat, ride.DropoffLng,
            ride.PickupAddress, ride.DropoffAddress
        ));
    }

    [HttpPost("cancel/{id}")]
    public async Task<IActionResult> CancelRide(string id)
    {
        var success = await _rideService.CancelRideAsync(id);
        if (!success)
            return BadRequest(new { message = "Ride cannot be cancelled at this time." });

        return Ok(new { message = "Ride cancelled successfully." });
    }
}
