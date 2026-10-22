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
  onUpdateFields?: (updates: Partial<Invitation>) => void;
  onAddElement: (element: Partial<CanvasElement>) => void;
  onUpdateElement: (element: CanvasElement) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (element: CanvasElement) => void;
  onSelectElementId: (id: string | null) => void;
  onPreview: () => void;
  onSave: () => void;
  onPublish: () => void;
  isPublished?: boolean;
  activeSheet?: "menu" | "properties" | null;
  onSetActiveSheet?: (sheet: "menu" | "properties" | null) => void;
  mobileTab?: "canvas" | "form";
  onSelectMobileTab?: (tab: "canvas" | "form") => void;
}

export default function MobileToolbar({
  invitation,
  selectedElement,
  onUpdateField,
  onUpdateFields,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onSelectElementId,
  onPreview,
  onSave,
  onPublish,
  isPublished,
  activeSheet: controlledActiveSheet,
  onSetActiveSheet,
  mobileTab,
  onSelectMobileTab,
}: MobileToolbarProps) {
  const [internalActiveSheet, setInternalActiveSheet] = useState<"menu" | "properties" | null>(null);
  const activeSheet = controlledActiveSheet !== undefined ? controlledActiveSheet : internalActiveSheet;
  const setActiveSheet = onSetActiveSheet || setInternalActiveSheet;

  // Auto-open element properties when an element is tapped on the canvas
  React.useEffect(() => {
    if (selectedElement) {
      setActiveSheet("properties");
    }
  }, [selectedElement?.id]);

  return (
    <>
      {/* Sticky Bottom Floating Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 flex items-center justify-between shadow-2xl">
        <button
          onClick={() => {
            if (onSelectMobileTab) {
              onSelectMobileTab(mobileTab === "form" ? "canvas" : "form");
            } else {
              setActiveSheet(activeSheet === "menu" ? null : "menu");
            }
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
            (activeSheet === "menu" || mobileTab === "form") ? "text-amber-700 bg-amber-50" : "text-stone-600"
          }`}
        >
          <PlusSquare className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-bold">
            {mobileTab === "form" ? "Canvas View" : "Edit Form"}
          </span>
        </button>

        <button
          onClick={() => setActiveSheet(activeSheet === "properties" ? null : "properties")}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
            selectedElement ? "text-amber-700 font-bold" : "text-stone-400"
          } ${activeSheet === "properties" ? "bg-amber-50" : ""}`}
        >
          <Sliders className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-bold">Element</span>
        </button>

        <button
          onClick={onPreview}
          className="flex flex-col items-center justify-center p-1.5 text-stone-600 hover:text-amber-700 rounded-xl"
        >
          <Eye className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-bold">Preview</span>
        </button>

        <button
          onClick={onSave}
          className="flex flex-col items-center justify-center p-1.5 text-stone-700 hover:text-amber-700 rounded-xl"
        >
          <Save className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] font-bold">Save</span>
        </button>

        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-2 rounded-xl shadow-md text-xs font-bold active:scale-95 transition"
        >
          <span>{isPublished ? "Live" : "Publish"}</span>
          <span className="text-[10px] opacity-90 font-mono">
            {invitation.isPremium ? "₹1,100" : "Free"}
          </span>
        </button>
      </div>

      {/* Bottom Sheet Drawer */}
      {activeSheet && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-5">
            {/* Sheet Handle & Close */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-stone-100 bg-stone-50/50">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-stone-800">
                  {activeSheet === "properties" 
                    ? (selectedElement?.type === "text" ? `Edit Text: ${selectedElement.fieldKey || "Element"}` : "Customize Element") 
                    : "Edit Invitation Details"}
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveSheet(null);
                  onSelectElementId(null);
                }}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-200"
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
                  onUpdateFields={onUpdateFields}
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
                  onClose={() => {
                    setActiveSheet(null);
                    onSelectElementId(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
