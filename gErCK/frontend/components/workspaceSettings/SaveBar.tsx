'use client';

interface Props {
  isDirty: boolean;
  saving: boolean;
  onCancel: () => void;
}

export default function SaveBar({ isDirty, saving, onCancel }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end space-x-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border rounded"
        disabled={saving}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        disabled={!isDirty || saving}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
