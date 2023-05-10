using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
  [Table("CartItems")]
  public class CartItem //One to one relationship between CartItem and Product
  {
    public int Id { get; set; }
    public int Quantity { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; }

    public int CartId { get; set; }
    public Cart Cart { get; set; }
  }
}