"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getTemplate,
  updateTemplate,
  deleteTemplate,
} from "@/lib/api/instructionTemplates";
import type { InstructionTemplate } from "@/types";

export default function TemplateEditorPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const templateId = params.templateId as string;

  const [template, setTemplate] = useState<InstructionTemplate | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getTemplate(workspaceId, templateId);
        if (!cancelled) {
          setTemplate(data);
          setName(data.name);
          setDescription(data.description || "");
          setContent(data.content);
        }
      } catch {
        if (!cancelled) setError("Failed to load template");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [workspaceId, templateId]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      setSaving(true);
      await updateTemplate(workspaceId, templateId, {
        name: name.trim(),
        description: description.trim() || undefined,
        content,
      });
      router.push(`/workspace/${workspaceId}/templates`);
    } catch {
      setError("Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this template?")) return;
    try {
      setDeleting(true);
      await deleteTemplate(workspaceId, templateId);
      router.push(`/workspace/${workspaceId}/templates`);
    } catch {
      setError("Failed to delete template");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/workspace/${workspaceId}/templates`);
  };

  if (loading) return <p className="text-sm text-gray-500">Loading template…</p>;
  if (!template) return <p className="text-sm text-red-600">Template not found.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit Instruction Template</h1>

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
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="ml-auto rounded border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
