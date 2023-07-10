using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

  public class ProductsController : BaseApiController
  {
    private readonly StoreContext _context;

    public ProductsController(StoreContext context)
    {
      _context = context;


    }
    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts([FromQuery] ProductParams productParams) /* If we don't specify a root parameter for the http get,
     then our API controller is going to assume that we want to pass this as a query string value, because we want to order by the value of this string of order, we use a switch expression to do so*/
    {
      var query = _context.Products
      .Sort(productParams.OrderBy)
      .Search(productParams.SearchTerm)
      .Filter(productParams.Brands, productParams.Types)
      .AsQueryable();



      var products = await PagedList<Product>.ToPagedList(query,
      productParams.PageNumber, productParams.PageSize);
      Response.AddPaginationHeader(products.MetaData);//In CamelCase serialised as well

      return products;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
      var product = await _context.Products.FindAsync(id);
      if (product == null) return NotFound();
      return product;
    }
    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters() /*We're gonna return an object with two different lists of strings inside it amd instead of creating a type,
     we're just going to return an action result instead of an action result. Specify the method GetFilters*/
    {
      var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
      var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();
      return Ok(new { brands, types });//Create an anonymous object passing the brands and types
    }
  }
}



