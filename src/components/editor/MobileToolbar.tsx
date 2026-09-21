"use client";

import React, { useState } from "react";
import { 
  FileText, 
  PlusSquare, 
  Palette, 
  Sliders, 
  Eye, 
  Save, 
  X 
} from "lucide-react";
import { CanvasElement, Invitation } from "@/lib/types";
import PropertiesPanel from "./PropertiesPanel";
import LeftPanel from "./LeftPanel";

interface MobileToolbarProps {
  invitation: Invitation;
  selectedElement: CanvasElement | null;
  onUpdateField: (field: string, value: any) => void;
  onAddElement: (element: Partial<CanvasElement>) => void;
  onUpdateElement: (element: CanvasElement) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (element: CanvasElement) => void;
  onSelectElementId: (id: string | null) => void;
  onPreview: () => void;
  onSave: () => void;
}

export default function MobileToolbar({
  invitation,
  selectedElement,
  onUpdateField,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onSelectElementId,
  onPreview,
  onSave,
}: MobileToolbarProps) {
  const [activeSheet, setActiveSheet] = useState<"menu" | "properties" | null>(null);

  return (
    <>
      {/* Sticky Bottom Floating Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveSheet(activeSheet === "menu" ? null : "menu")}
          className="flex flex-col items-center justify-center p-1 text-stone-600 hover:text-amber-700"
        >
          <PlusSquare className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Tools</span>
        </button>

        <button
          onClick={() => setActiveSheet(activeSheet === "properties" ? null : "properties")}
          className={`flex flex-col items-center justify-center p-1 ${
            selectedElement ? "text-amber-700 font-bold" : "text-stone-400"
          }`}
        >
          <Sliders className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Properties</span>
        </button>

        <button
          onClick={onPreview}
          className="flex flex-col items-center justify-center p-1 text-stone-600 hover:text-amber-700"
        >
          <Eye className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Preview</span>
        </button>

        <button
          onClick={onSave}
          className="flex flex-col items-center justify-center p-1 text-amber-700 font-semibold"
        >
          <Save className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Save</span>
        </button>
      </div>

      {/* Bottom Sheet Drawer */}
      {activeSheet && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-5">
            {/* Sheet Handle & Close */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-stone-100">
              <div className="h-1 w-12 rounded-full bg-stone-300 mx-auto" />
              <button
                onClick={() => setActiveSheet(null)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sheet Body */}
            <div className="overflow-y-auto p-4 flex-1">
              {activeSheet === "menu" && (
                <LeftPanel
                  invitation={invitation}
                  onUpdateField={onUpdateField}
                  onAddElement={(el) => {
                    onAddElement(el);
                    setActiveSheet("properties");
                  }}
                  onSelectElementId={onSelectElementId}
                />
              )}

              {activeSheet === "properties" && (
                <PropertiesPanel
                  selectedElement={selectedElement}
                  onUpdateElement={onUpdateElement}
                  onDeleteElement={(id) => {
                    onDeleteElement(id);
                    setActiveSheet(null);
                  }}
                  onDuplicateElement={onDuplicateElement}
                  onClose={() => setActiveSheet(null)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
