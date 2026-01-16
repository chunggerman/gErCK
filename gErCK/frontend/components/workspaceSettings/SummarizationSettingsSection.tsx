'use client';

import { Control, Controller } from 'react-hook-form';
import { AIConfig } from '@/lib/types';

interface Props {
  control: Control<AIConfig>;
}

export default function SummarizationSettingsSection({ control }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Summarization Settings</h2>
      <div className="space-y-4">
        <Controller
          name="summarization.enabled"
          control={control}
          render={({ field }) => (
            <div>
              <label className="flex items-center">
                <input {...field} type="checkbox" checked={field.value} className="mr-2" />
                Enabled
              </label>
            </div>
          )}
        />
        <Controller
          name="summarization.frequency"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <input {...field} type="number" className="w-full p-2 border rounded" />
            </div>
          )}
        />
        <Controller
          name="summarization.style"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Style</label>
              <select {...field} className="w-full p-2 border rounded">
                <option value="adaptive">Adaptive</option>
                <option value="concise">Concise</option>
              </select>
            </div>
          )}
        />
        <Controller
          name="summarization.max_length"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Max Length</label>
              <select {...field} className="w-full p-2 border rounded">
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          )}
        />
      </div>
    </div>
  );
}
