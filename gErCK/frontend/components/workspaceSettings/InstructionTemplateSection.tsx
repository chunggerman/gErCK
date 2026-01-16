"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listTemplates } from "@/lib/api/instructionTemplates";
import type { InstructionTemplate } from "@/types";

type Props = {
  workspaceId: string;
  value: string | null; // templateId or null
  onChange: (templateId: string | null) => void;
};

export function InstructionTemplateSection({ workspaceId, value, onChange }: Props) {
  const router = useRouter();
  const [templates, setTemplates] = useState<InstructionTemplate[]>([]);
  const [selected, setSelected] = useState<InstructionTemplate | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await listTemplates(workspaceId);
      if (!cancelled) setTemplates(data);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }
    const found = templates.find((t) => t.id === value) || null;
    setSelected(found);
  }, [value, templates]);

  const handleSelect = (id: string | "") => {
    if (!id) onChange(null);
    else onChange(id);
  };

  const handleEdit = () => {
    if (!value) return;
    router.push(`/workspace/${workspaceId}/templates/${value}`);
  };

  const handleCreate = () => {
    router.push(`/workspace/${workspaceId}/templates/new`);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Instruction Template</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            disabled={!value}
            className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
          >
            Edit Template
          </button>
          <button
            onClick={handleCreate}
            className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
          >
            Create New Template
          </button>
        </div>
      </div>

      <select
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
        value={value ?? ""}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="">No template</option>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {selected && (
        <div className="rounded border border-gray-200 bg-gray-50 p-2">
          <div className="text-xs font-medium">{selected.name}</div>
          {selected.description && (
            <div className="text-xs text-gray-500">{selected.description}</div>
          )}
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-xs text-gray-700">
            {selected.content}
          </pre>
        </div>
      )}
    </div>
  );
}
