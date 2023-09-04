using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class CartController : BaseApiController
  {
    private readonly StoreContext _context;

    public CartController(StoreContext context)
    {
      _context = context;
    }


    [HttpGet(Name = "GetCart")]
    public async Task<ActionResult<CartDto>> GetCart()
    {
      var cart = await RetrieveCart(GetBuyerId());
      if (cart == null) return NotFound();
      return cart.MapCartToDto();

    }



    [HttpPost] //api/cart?productId=3&quantity=2
    public async Task<ActionResult<CartDto>> AddItemToCart(int productId, int quantity)
    {
      //get cart
      var cart = await RetrieveCart(GetBuyerId());
      //create cart
      if (cart == null) cart = CreateCart();
      //get product
      var product = await _context.Products.FindAsync(productId);
      if (product == null) return BadRequest(new ProblemDetails { Title = "Product Not Found" });
      //add item
      cart.AddItem(product, quantity);
      //save changes
      var result = await _context.SaveChangesAsync() > 0;

      if (result) return CreatedAtRoute("GetCart", cart.MapCartToDto());
      return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
    }



    [HttpDelete]
    public async Task<ActionResult> RemoveCartItem(int productId, int quantity)
    {
      //get cart 
      var cart = await RetrieveCart(GetBuyerId());

      if (cart == null) return NotFound();
      //remove item or reduce quantity
      cart.RemoveItem(productId, quantity);
      //save changes
      var result = await _context.SaveChangesAsync() > 0;
      if (result) return Ok();
      return BadRequest(new ProblemDetails { Title = "Problem removing item from cart." });
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
            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
    }

    private string GetBuyerId()
    {
      return User.Identity?.Name ?? Request.Cookies["buyerId"];
    }
    private Cart CreateCart()
    {
      var buyerId = User.Identity?.Name;
      if (string.IsNullOrEmpty(buyerId))
      {
        buyerId = Guid.NewGuid().ToString();
        var cookiesOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
        Response.Cookies.Append("buyerId", buyerId, cookiesOptions);
      }

      var cart = new Cart { BuyerId = buyerId }; //When creating a new cart, this is only the property needed.
      _context.Carts.Add(cart);
      return cart;
    }

  }
}