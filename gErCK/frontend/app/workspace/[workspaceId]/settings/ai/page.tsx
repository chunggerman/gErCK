'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AIConfig } from '@/lib/types';
import { getWorkspaceAIConfig, updateWorkspaceAIConfig } from '@/lib/api';
import ModelSettingsSection from '@/components/workspaceSettings/ModelSettingsSection';
import RetrievalSettingsSection from '@/components/workspaceSettings/RetrievalSettingsSection';
import SummarizationSettingsSection from '@/components/workspaceSettings/SummarizationSettingsSection';
import MemorySettingsSection from '@/components/workspaceSettings/MemorySettingsSection';
import ChunkingSettingsSection from '@/components/workspaceSettings/ChunkingSettingsSection';
import InstructionTemplateSection from '@/components/workspaceSettings/InstructionTemplateSection';
import SaveBar from '@/components/workspaceSettings/SaveBar';

export default function WorkspaceSettingsPage() {
  const { workspaceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { control, handleSubmit, reset, watch, formState: { isDirty } } = useForm<AIConfig>();

  useEffect(() => {
    if (workspaceId) {
      getWorkspaceAIConfig(workspaceId as string)
        .then((config) => {
          reset(config);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to load config:', error);
          setLoading(false);
        });
    }
  }, [workspaceId, reset]);

  const onSubmit = async (data: AIConfig) => {
    setSaving(true);
    try {
      await updateWorkspaceAIConfig(workspaceId as string, data);
      reset(data); // Reset dirty state
    } catch (error) {
      console.error('Failed to save config:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI Configuration</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <ModelSettingsSection control={control} />
        <RetrievalSettingsSection control={control} />
        <SummarizationSettingsSection control={control} />
        <MemorySettingsSection control={control} />
        <ChunkingSettingsSection control={control} />
        <InstructionTemplateSection control={control} workspaceId={workspaceId as string} />
        <SaveBar isDirty={isDirty} saving={saving} onCancel={() => reset()} />
      </form>
    </div>
  );
}
