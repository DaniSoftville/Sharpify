

namespace API.RequestHelpers
{
  public class MetaData
  {
    public int CurrentPage { get; set; } /*We wanna supply the client with the current page 
    that we're retaining also for the total pages, 
    and also for the page size */
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }

  }
}