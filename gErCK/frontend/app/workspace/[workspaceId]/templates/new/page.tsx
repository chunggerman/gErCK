"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createTemplate } from "@/lib/api/instructionTemplates";

export default function NewTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      setSaving(true);
      await createTemplate(workspaceId, {
        name: name.trim(),
        description: description.trim() || undefined,
        content,
      });
      router.push(`/workspace/${workspaceId}/templates`);
    } catch {
      setError("Failed to create template");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/workspace/${workspaceId}/templates`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Create Instruction Template</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-2">
        <label className="block text-sm font-medium">Name</label>
        <input
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Description (optional)</label>
        <input
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Content</label>
        <textarea
          className="h-64 w-full rounded border border-gray-300 px-2 py-1 text-sm font-mono"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={handleCancel}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
