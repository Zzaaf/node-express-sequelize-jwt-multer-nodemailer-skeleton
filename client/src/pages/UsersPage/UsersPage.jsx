import UserList from "../../widgets/UserList/UserList";

export default function UsersPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
                <p className="text-gray-600">Browse all registered users</p>
            </div>
            <UserList />
        </div>
    );
}