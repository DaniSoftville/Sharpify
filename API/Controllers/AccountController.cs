using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

  public class AccountController : BaseApiController
  {
    private readonly UserManager<User> _userManager;

    private readonly TokenService _tokenService;
    private readonly StoreContext _context;

    public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)

    {
      _context = context;
      _tokenService = tokenService;
      _userManager = userManager;
    }


    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) //Be sure to put here UserDto intead of user
    {
      var user = await _userManager.FindByNameAsync(loginDto.Username);
      if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
        return Unauthorized();

      var userCart = await RetrieveCart(loginDto.Username);
      var anonCart = await RetrieveCart(Request.Cookies["buyerId"]);

      if (anonCart != null)
      {
        if (userCart != null) _context.Carts.Remove(userCart);
        anonCart.BuyerId = user.UserName;
        Response.Cookies.Delete("buyerId");
        await _context.SaveChangesAsync();
      }
      return new UserDto
      {
        Email = user.Email,
        Token = await _tokenService.GenerateToken(user),
        Cart = anonCart != null ? anonCart.MapCartToDto() : userCart?.MapCartToDto()
      };
    }
    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
      var user = new User { UserName = registerDto.Username, Email = registerDto.Email };
      var result = await _userManager.CreateAsync(user, registerDto.Password);
      if (!result.Succeeded)
      {
        foreach (var error in result.Errors)
        {
          ModelState.AddModelError(error.Code, error.Description);

        }
        return ValidationProblem();
      }
      await _userManager.AddToRoleAsync(user, "Member");
      return StatusCode(201);
    }
    [Authorize]

    [HttpGet("currentUser")]
    public async Task<ActionResult<UserDto>> GetCurrentuser()
    {
      var user = await _userManager.FindByNameAsync(User.Identity.Name);
      var userCart = await RetrieveCart(User.Identity.Name);

      return new UserDto
      {
        Email = user.Email,
        Token = await _tokenService.GenerateToken(user),
        Cart = userCart?.MapCartToDto()
      };
    }

    private async Task<Cart> RetrieveCart(string buyerId)
    {
      if (string.IsNullOrEmpty(buyerId))
      {
        Response.Cookies.Delete("buyerId");
        return null;
      }
      return await _context.Carts.Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(cart => cart.BuyerId == buyerId);
    }
  }
}