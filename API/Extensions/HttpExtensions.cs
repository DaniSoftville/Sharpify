
using System.Text.Json;
using API.RequestHelpers;

namespace API.Extensions
{
  public static class HttpExtensions
  {
    public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
    {
      var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
      response.Headers.Add("Pagination", System.Text.Json.JsonSerializer.Serialize(metaData, options));//Serialise into json what's inside our metadata
      response.Headers.Add("Access-Control-Expose-Headers", "Pagination");//We need to allow tghe client to read the pagination header on the client, be precise here.
    }
  }
}