export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <form action="/login" method="post">
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        
      </form>
      <form action="/api/logout" method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
