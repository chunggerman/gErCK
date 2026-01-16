'use client';

import { Control, Controller } from 'react-hook-form';
import { AIConfig } from '@/lib/types';

interface Props {
  control: Control<AIConfig>;
}

export default function MemorySettingsSection({ control }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Memory Settings</h2>
      <div className="space-y-4">
        <Controller
          name="memory.window_size"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Window Size</label>
              <input {...field} type="number" className="w-full p-2 border rounded" />
            </div>
          )}
        />
        <Controller
          name="memory.use_summary"
          control={control}
          render={({ field }) => (
            <div>
              <label className="flex items-center">
                <input {...field} type="checkbox" checked={field.value} className="mr-2" />
                Use Summary
              </label>
            </div>
          )}
        />
      </div>
    </div>
  );
}
