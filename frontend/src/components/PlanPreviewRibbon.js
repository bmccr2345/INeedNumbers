import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const PlanPreviewRibbon = ({ previewPlan, onClear }) => {
  const ribbonRoot = document.getElementById('plan-preview-portal');
  
  if (!ribbonRoot || !previewPlan) return null;

  const ribbon = (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-900 px-4 py-2 text-sm font-medium shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <span>
          Previewing {previewPlan} plan (no billing) — for testing only
        </span>
        <button
          onClick={onClear}
          className="flex items-center space-x-1 text-amber-900 hover:text-amber-800 transition-colors"
          aria-label="Clear plan preview"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );

  return createPortal(ribbon, ribbonRoot);
};

export default PlanPreviewRibbon;