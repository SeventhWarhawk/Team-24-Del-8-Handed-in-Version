namespace The_Food_Works_WebAPI
{
    public interface IJwtAuthenticationManager
    {
        string Authenticate(string username, string password);
    }
}