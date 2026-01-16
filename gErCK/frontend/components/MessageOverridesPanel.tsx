"use client";

import { useEffect, useState } from "react";
import { listTemplates } from "@/lib/api/instructionTemplates";
import type { InstructionTemplate } from "@/types";

type Props = {
  workspaceId: string;
  config: any;
  onChange: (config: any) => void;
};

export function MessageOverridesPanel({ workspaceId, config, onChange }: Props) {
  const [templates, setTemplates] = useState<InstructionTemplate[]>([]);
  const [templateMode, setTemplateMode] = useState<"none" | "library" | "custom">(
    config.instruction_template
      ? "library"
      : config.custom_instruction_template
      ? "custom"
      : "none"
  );
  const [customTemplate, setCustomTemplate] = useState<string>(
    config.custom_instruction_template || ""
  );

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

  const updateConfig = (patch: any) => {
    onChange({
      ...config,
      ...patch,
    });
  };

  const handleTemplateModeChange = (mode: "none" | "library" | "custom") => {
    setTemplateMode(mode);

    if (mode === "none") {
      updateConfig({
        instruction_template: undefined,
        custom_instruction_template: undefined,
      });
    }

    if (mode === "library") {
      updateConfig({
        custom_instruction_template: undefined,
      });
    }

    if (mode === "custom") {
      updateConfig({
        instruction_template: undefined,
        custom_instruction_template: customTemplate,
      });
    }
  };

  const handleTemplateSelect = (id: string) => {
    updateConfig({ instruction_template: id || undefined });
  };

  const handleCustomChange = (value: string) => {
    setCustomTemplate(value);
    if (templateMode === "custom") {
      updateConfig({ custom_instruction_template: value });
    }
  };

  return (
    <div className="space-y-3 rounded border border-gray-200 bg-white p-3 text-sm">
      <div className="font-medium">Message Overrides</div>

      {/* Existing controls for model, top_k, etc. remain unchanged */}

      <div className="space-y-1">
        <div className="text-xs font-medium">Instruction Template</div>

        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={templateMode === "none"}
              onChange={() => handleTemplateModeChange("none")}
            />
            <span>None</span>
          </label>

          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={templateMode === "library"}
              onChange={() => handleTemplateModeChange("library")}
            />
            <span>From library</span>
          </label>

          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={templateMode === "custom"}
              onChange={() => handleTemplateModeChange("custom")}
            />
            <span>Custom</span>
          </label>
        </div>

        {templateMode === "library" && (
          <select
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
            value={config.instruction_template ?? ""}
            onChange={(e) => handleTemplateSelect(e.target.value)}
          >
            <option value="">Select template</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        )}

        {templateMode === "custom" && (
          <textarea
            className="mt-1 h-32 w-full rounded border border-gray-300 px-2 py-1 text-xs font-mono"
            value={customTemplate}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="Write a custom instruction template for this message…"
          />
        )}
      </div>
    </div>
  );
}
