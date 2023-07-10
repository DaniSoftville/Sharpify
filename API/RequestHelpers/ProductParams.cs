

namespace API.RequestHelpers
{
  public class ProductParams : PaginationParams //We can use these pagination params derived from this class from :PaginationParams
  {
    public string OrderBy { get; set; }
    public string SearchTerm { get; set; }
    public string Types { get; set; }
    public string Brands { get; set; }
  }
}