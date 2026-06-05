using CabBooking.API.DTOs;
using CabBooking.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace CabBooking.API.Controllers;

[ApiController]
[Route("api/ai")]
public class AiController : ControllerBase
{
    private readonly AiService _aiService;

    public AiController(AiService aiService) => _aiService = aiService;

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AiChatRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Message))
            return BadRequest(new { message = "Message cannot be empty." });

        var response = await _aiService.ProcessAsync(req);
        return Ok(response);
    }
}
