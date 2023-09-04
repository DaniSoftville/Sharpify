
namespace API.DTOs
{
  public class RegisterDto : LoginDto //Simply Username and Password from LoginDto and ask them for Email address as well
  {
    public string Email { get; set; }
  }
}