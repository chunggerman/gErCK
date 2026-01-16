'use client';

import { Control, Controller } from 'react-hook-form';
import { AIConfig } from '@/lib/types';

interface Props {
  control: Control<AIConfig>;
}

export default function ModelSettingsSection({ control }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Model Settings</h2>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="model"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <select {...field} className="w-full p-2 border rounded">
                <option value="">Select model</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
          )}
        />
        <Controller
          name="embedding_model"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Embedding Model</label>
              <select {...field} className="w-full p-2 border rounded">
                <option value="">Select embedding model</option>
                <option value="text-embedding-ada-002">Ada-002</option>
              </select>
            </div>
          )}
        />
      </div>
    </div>
  );
}
