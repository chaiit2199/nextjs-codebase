export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
       <h1>Hello World</h1>

      <form action="/api/logout" method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
