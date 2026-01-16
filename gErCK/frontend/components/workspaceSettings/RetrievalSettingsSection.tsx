'use client';

import { Control, Controller } from 'react-hook-form';
import { AIConfig } from '@/lib/types';

interface Props {
  control: Control<AIConfig>;
}

export default function RetrievalSettingsSection({ control }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Retrieval Settings</h2>
      <div className="space-y-4">
        <Controller
          name="top_k"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">Top K</label>
              <input {...field} type="number" className="w-full p-2 border rounded" />
            </div>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="retrieval.vector_weight"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1">Vector Weight</label>
                <input {...field} type="range" min="0" max="1" step="0.1" className="w-full" />
                <span>{field.value}</span>
              </div>
            )}
          />
          <Controller
            name="retrieval.keyword_weight"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1">Keyword Weight</label>
                <input {...field} type="range" min="0" max="1" step="0.1" className="w-full" />
                <span>{field.value}</span>
              </div>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="retrieval.recency_weight"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1">Recency Weight</label>
                <input {...field} type="range" min="0" max="1" step="0.1" className="w-full" />
                <span>{field.value}</span>
              </div>
            )}
          />
          <Controller
            name="retrieval.metadata_weight"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium mb-1">Metadata Weight</label>
                <input {...field} type="range" min="0" max="1" step="0.1" className="w-full" />
                <span>{field.value}</span>
              </div>
            )}
          />
        </div>
        {/* Filters can be added later */}
      </div>
    </div>
  );
}
