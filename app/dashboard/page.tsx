"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/lib/api";

type Task = {
  id: string;
  title: string;
  status:
    | "TODO"
    | "IN_PROGRESS"
    | "DONE";
  createdAt: string;
};

type User = {
  name: string;
  email: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [title, setTitle] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  async function loadUser() {
    const res = await fetch(
      API.me,
      {
        credentials:
          "include",
      }
    );

    if (!res.ok) {
      router.push("/login");
      return;
    }

    const data = await res.json();
    setUser(data);
  }

  async function loadTasks() {
    const res = await fetch(
      API.tasks,
      {
        credentials:
          "include",
      }
    );

    const data = await res.json();

    if (res.ok) {
      setTasks(data);
    }

    setLoading(false);
  }

  async function createTask(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!title.trim()) return;

    setCreating(true);

    const res = await fetch(
      API.tasks,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        credentials:
          "include",
        body: JSON.stringify({
          title,
        }),
      }
    );

    if (res.ok) {
      setTitle("");
      loadTasks();
    }

    setCreating(false);
  }

  async function updateStatus(
    id: string,
    status: string
  ) {
    const res = await fetch(
      `${API.tasks}/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        credentials:
          "include",
        body: JSON.stringify({
          status,
        }),
      }
    );

    if (res.ok) {
      loadTasks();
    }
  }

  async function logout() {
    await fetch(API.logout, {
      method: "POST",
      credentials:
        "include",
    });

    router.push("/login");
  }

  useEffect(() => {
    async function init() {
      await loadUser();
      await loadTasks();
    }

    init();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Dashboard
            </h1>

            <p className="text-gray-600">
              Welcome,{" "}
              {user?.name ||
                "User"}
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <form
            onSubmit={createTask}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="Enter task title"
              className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />

            <button
              type="submit"
              disabled={creating}
              className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {creating
                ? "Adding..."
                : "Add Task"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              Loading...
            </div>
          ) : tasks.length ===
            0 ? (
            <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
              No tasks yet
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl shadow p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {task.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      task.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <select
                  value={
                    task.status
                  }
                  onChange={(e) =>
                    updateStatus(
                      task.id,
                      e.target
                        .value
                    )
                  }
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="TODO">
                    To Do
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="DONE">
                    Done
                  </option>
                </select>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}