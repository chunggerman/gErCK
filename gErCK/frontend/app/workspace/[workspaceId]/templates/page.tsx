"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { listTemplates, deleteTemplate } from "@/lib/api/instructionTemplates";
import type { InstructionTemplate } from "@/types";

export default function TemplatesPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [templates, setTemplates] = useState<InstructionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await listTemplates(workspaceId);
        if (!cancelled) setTemplates(data);
      } catch {
        if (!cancelled) setError("Failed to load templates");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  const handleCreate = () => {
    router.push(`/workspace/${workspaceId}/templates/new`);
  };

  const handleEdit = (id: string) => {
    router.push(`/workspace/${workspaceId}/templates/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    try {
      setDeletingId(id);
      await deleteTemplate(workspaceId, id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete template");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Instruction Templates</h1>
        <button
          onClick={handleCreate}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Template
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-500">Loading templates…</p>
      ) : templates.length === 0 ? (
        <p className="text-sm text-gray-500">No templates yet. Create one to get started.</p>
      ) : (
        <div className="space-y-2">
          {templates.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2"
            >
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                {t.description && (
                  <div className="text-xs text-gray-500">{t.description}</div>
                )}
                <div className="text-xs text-gray-400">
                  Updated: {new Date(t.updated_at).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(t.id)}
                  className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                  className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId === t.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
