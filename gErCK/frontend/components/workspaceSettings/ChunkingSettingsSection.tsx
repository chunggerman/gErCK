'use client';

import { Control, Controller } from 'react-hook-form';
import { AIConfig } from '@/lib/types';

interface Props {
  control: Control<AIConfig>;
}

export default function ChunkingSettingsSection({ control }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Chunking Settings</h2>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="chunking.size"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <input {...field} type="number" className="w-full p-2 border rounded" />
            </div>
          )}
        />
        <Controller
          name="chunking.overlap"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Overlap</label>
              <input {...field} type="number" className="w-full p-2 border rounded" />
            </div>
          )}
        />
      </div>
    </div>
  );
}
