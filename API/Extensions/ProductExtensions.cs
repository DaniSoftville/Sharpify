

using API.Entities;

namespace API.Extensions
{
  public static class ProductExtensions /* This is gonna be static, we don't want to create any instance of this class to use this extension method */
  {
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
    {
      if (string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);
      query = orderBy switch
      {
        "price" => query.OrderBy(p => p.Price),
        "priceDesc" => query.OrderByDescending(p => p.Price),
        _ => query.OrderBy(p => p.Name)
      };
      return query;
    }//We want to return a queryable type Product from this method
    public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
    {
      if (string.IsNullOrWhiteSpace(searchTerm)) return query;
      var lowerCaseSearchTerm = searchTerm.Trim().ToLower();
      return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));

    }
    public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
    {/*//We specify parameters as query and an array of types and array of brands, 
    so the user can choose between multiple types and brands as strings*/
      var brandList = new List<string>();
      var typeList = new List<string>();
      if (!string.IsNullOrEmpty(brands))
        brandList.AddRange(brands.ToLower().Split(",").ToList());/* Gives us a list of brand that we can use to query against our database*/
      if (!string.IsNullOrEmpty(types))
        typeList.AddRange(types.ToLower().Split(",").ToList());/* Gives us a list of types that we can use to query against our database*/
      query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower())); /* First we check if it is equal to 0, we do nothing. 
    Otherwise, look for all the brands that matches anything inside the brandList */
      query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower())); /* First we check if it is equal to 0, we do nothing. 
    Otherwise, look for all the types that matches anything inside the typeList */
      return query;
    }
  }
}