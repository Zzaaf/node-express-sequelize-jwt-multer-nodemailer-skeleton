import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TaskApi } from "../../entities/TaskApi";

export default function TasksPage({ user }) {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setIsLoading(true);
        try {
            const response = await TaskApi.getAll();
            setTasks(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load tasks');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        if (!user) {
            setError('You must be logged in to create tasks');
            return;
        }

        try {
            const response = await TaskApi.create({
                title: newTaskTitle,
                status: false,
                user_id: user.id
            });
            setTasks([...tasks, response.data]);
            setNewTaskTitle('');
            setError('');
        } catch (err) {
            setError('Failed to create task');
        }
    };

    const handleToggleStatus = async (taskId, currentStatus, taskUserId) => {
        // Проверяем владение задачей
        if (!user || taskUserId !== user.id) {
            setError('You can only modify your own tasks');
            return;
        }

        try {
            const response = await TaskApi.updateById(taskId, {
                status: !currentStatus
            });
            setTasks(tasks.map(task =>
                task.id === taskId ? response.data : task
            ));
            setError('');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update task';
            setError(errorMessage);
        }
    };

    const handleStartEdit = (task) => {
        setEditingTask(task.id);
        setEditTitle(task.title);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
        setEditTitle('');
    };

    const handleSaveEdit = async (taskId) => {
        if (!editTitle.trim()) return;

        try {
            const response = await TaskApi.updateById(taskId, {
                title: editTitle
            });
            setTasks(tasks.map(task =>
                task.id === taskId ? response.data : task
            ));
            setEditingTask(null);
            setEditTitle('');
            setError('');
        } catch (err) {
            setError('Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await TaskApi.deleteById(taskId);
            setTasks(tasks.filter(task => task.id !== taskId));
            setError('');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete task';
            setError(errorMessage);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">All Tasks</h1>
                <p className="text-gray-600">View and manage all tasks from all users</p>
            </div>

            {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Форма создания новой задачи (только для авторизованных) */}
            {user && (
                <form onSubmit={handleCreateTask} className="mb-8">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Enter new task..."
                            className="flex-1 rounded-md bg-white px-4 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                        />
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add Task
                        </button>
                    </div>
                </form>
            )}

            {/* Список задач */}
            {isLoading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Loading tasks...</p>
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No tasks yet. Create your first task!</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                                {/* Чекбокс для статуса (только для владельца) */}
                                <input
                                    type="checkbox"
                                    checked={task.status}
                                    onChange={() => handleToggleStatus(task.id, task.status, task.user_id)}
                                    disabled={!user || task.user_id !== user.id}
                                    className={`h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 ${
                                        user && task.user_id === user.id ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                                    }`}
                                />

                            {/* Название задачи */}
                            {editingTask === task.id ? (
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="flex-1 rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    autoFocus
                                />
                            ) : (
                                <span className={`flex-1 text-gray-900 ${task.status ? 'line-through text-gray-500' : ''}`}>
                                    {task.title}
                                </span>
                            )}

                            {/* Информация о пользователе */}
                            {task.User && (
                                <span className="text-sm text-gray-500">
                                    by {task.User.name}
                                </span>
                            )}

                                {/* Кнопки действий (только для владельца) */}
                                <div className="flex gap-2">
                                    {user && task.user_id === user.id ? (
                                        editingTask === task.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleSaveEdit(task.id)}
                                                    className="px-3 py-1 text-sm font-medium text-green-700 hover:text-green-800 hover:bg-green-50 rounded"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-100 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleStartEdit(task)}
                                                    className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )
                                    ) : (
                                        <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded">
                                            View only
                                        </span>
                                    )}
                                </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}