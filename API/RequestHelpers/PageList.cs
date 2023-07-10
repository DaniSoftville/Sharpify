using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
  public class PagedList<T> : List<T> //We can use this class with any of our entities
  {
    /*//we're gonna give it a generic type parameter, and the way we do this is by opening angle brackets and say this page list can be a type of T*/
    public PagedList(List<T> items, int count, int pageNumber, int pageSize)
    {
      MetaData = new MetaData
      {
        TotalCount = count, //TotalCount it's gonna be equal to the count we pass to the constructor parameter
        PageSize = pageSize,
        CurrentPage = pageNumber,
        TotalPages = (int)Math.Ceiling(count / (double)pageSize)/*We calculate TotalPages, for example if we get 15 products in our database, the page size was 10, then we would have 2 pages.*/
      };
      AddRange(items); //Add items for our list
    }

    public MetaData MetaData { get; set; }
    public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query,
    int pageNumber, int pageSize)
    {
      /*from products controller, 
      it's gonna be the counts after we've done our sorting, our searching and filtering
      And that's the total count of items available in the list after those filters have been applied.*/
      var count = await query.CountAsync();//execute the query against the database to find out the total count of itmes available
      var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();//We dont want to skip anything but we want the first 10 items
      return new PagedList<T>(items, count, pageNumber, pageSize);//We want the metadata back as well as the items same order passed in the constructor   
    }/*We don't know which entity are we working with*/
  }

}