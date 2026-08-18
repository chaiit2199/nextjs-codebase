export default function AdminPage() {
    return (
        <div>
            <h1>AdminPage</h1>
            <form action="/api/logout" method="post">
                <button type="submit">Logout</button>
            </form>
        </div>
    );
}