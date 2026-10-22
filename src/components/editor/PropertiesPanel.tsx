"use client";

import React, { useRef } from "react";
import { 
  Type, 
  Trash2, 
  Copy, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Layers, 
  X, 
  Sliders,
  Image as ImageIcon,
  Upload,
  Camera
} from "lucide-react";
import { CanvasElement } from "@/lib/types";

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (updated: CanvasElement) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (element: CanvasElement) => void;
  onClose?: () => void;
}

const FONT_OPTIONS = [
  { label: "Playfair Display (Serif)", value: "Playfair Display" },
  { label: "Cormorant Garamond (Serif)", value: "Cormorant Garamond" },
  { label: "Cinzel (Regal Serif)", value: "Cinzel" },
  { label: "Great Vibes (Calligraphy)", value: "Great Vibes" },
  { label: "Inter (Modern Sans)", value: "Inter" },
  { label: "Georgia (Classic)", value: "Georgia" },
];

const COLOR_SWATCHES = [
  "#2D261E",
  "#D4AF37",
  "#C06C52",
  "#C47B89",
  "#580A18",
  "#0F382C",
  "#0B132B",
  "#FFFFFF",
  "#7A6E5E",
];

export default function PropertiesPanel({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onClose,
}: PropertiesPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedElement) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onUpdateElement({ ...selectedElement, src: dataUrl });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (!selectedElement) {
    return (
      <aside className="w-full lg:w-72 border-l border-stone-200 bg-white flex flex-col shrink-0 z-20 p-6 text-center justify-center text-stone-400 h-full lg:h-[calc(100vh-4rem)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 mb-3">
          <Sliders className="h-6 w-6" />
        </div>
        <h4 className="font-serif text-sm font-bold text-stone-700">Element Properties</h4>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
          Select any element on the canvas to customize its typography, colors, and layout.
        </p>
      </aside>
    );
  }

  const isText = selectedElement.type === "text";
  const isButton = selectedElement.type === "button";
  const isShape = selectedElement.type === "shape" || selectedElement.type === "divider";
  const isImage = selectedElement.type === "image";

  return (
    <aside className="w-full lg:w-72 border-l border-stone-200 bg-white flex flex-col shrink-0 z-20 h-full lg:h-[calc(100vh-4rem)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
            {selectedElement.type}
          </span>
          <span className="text-xs font-bold text-stone-800 truncate max-w-[120px]">
            {selectedElement.fieldKey || selectedElement.id}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TEXT SPECIFIC PROPERTIES */}
        {isText && (
          <>
            {/* Text Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Text Content</label>
              <textarea
                rows={2}
                value={selectedElement.text || ""}
                onChange={(e) => onUpdateElement({ ...selectedElement, text: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Font Family</label>
              <select
                value={selectedElement.fontFamily || "Inter"}
                onChange={(e) => onUpdateElement({ ...selectedElement, fontFamily: e.target.value })}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size & Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Size ({selectedElement.fontSize || 24}px)
                </label>
                <input
                  type="range"
                  min={12}
                  max={120}
                  value={selectedElement.fontSize || 24}
                  onChange={(e) =>
                    onUpdateElement({ ...selectedElement, fontSize: Number(e.target.value) })
                  }
                  className="w-full accent-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Weight</label>
                <select
                  value={selectedElement.fontWeight || "400"}
                  onChange={(e) =>
                    onUpdateElement({ ...selectedElement, fontWeight: e.target.value as any })
                  }
                  className="w-full rounded-xl border border-stone-200 px-2 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Regular (400)</option>
                  <option value="600">Semi-Bold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                </select>
              </div>
            </div>

            {/* Alignment & Style Buttons */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Text Alignment</label>
              <div className="flex items-center gap-1 rounded-xl border border-stone-200 p-1">
                {[
                  { align: "left", icon: AlignLeft },
                  { align: "center", icon: AlignCenter },
                  { align: "right", icon: AlignRight },
                ].map(({ align, icon: Icon }) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() =>
                      onUpdateElement({ ...selectedElement, textAlign: align as any })
                    }
                    className={`flex-1 flex justify-center py-1.5 rounded-lg text-stone-600 transition ${
                      selectedElement.textAlign === align ? "bg-amber-100 text-amber-900 font-bold" : "hover:bg-stone-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}

                <div className="h-4 w-[1px] bg-stone-200 mx-1" />

                <button
                  type="button"
                  onClick={() =>
                    onUpdateElement({
                      ...selectedElement,
                      fontStyle: selectedElement.fontStyle === "italic" ? "normal" : "italic",
                    })
                  }
                  className={`px-2 py-1.5 rounded-lg text-stone-600 transition ${
                    selectedElement.fontStyle === "italic" ? "bg-amber-100 text-amber-900 font-bold" : "hover:bg-stone-50"
                  }`}
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Letter Spacing</span>
                <span className="font-mono text-stone-500">{selectedElement.letterSpacing || 0}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={16}
                value={selectedElement.letterSpacing || 0}
                onChange={(e) =>
                  onUpdateElement({ ...selectedElement, letterSpacing: Number(e.target.value) })
                }
                className="w-full accent-amber-600"
              />
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Text Color</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="color"
                  value={selectedElement.color || "#2D261E"}
                  onChange={(e) => onUpdateElement({ ...selectedElement, color: e.target.value })}
                  className="h-8 w-8 cursor-pointer rounded-lg border border-stone-200 p-0.5"
                />
                <input
                  type="text"
                  value={selectedElement.color || "#2D261E"}
                  onChange={(e) => onUpdateElement({ ...selectedElement, color: e.target.value })}
                  className="w-24 rounded-lg border border-stone-200 px-2 py-1 text-xs font-mono uppercase"
                />
              </div>

              {/* Quick Swatches */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {COLOR_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => onUpdateElement({ ...selectedElement, color: hex })}
                    className="h-5 w-5 rounded-full border border-black/15 transition hover:scale-110"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* BUTTON PROPERTIES */}
        {isButton && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Button Label</label>
              <input
                type="text"
                value={selectedElement.buttonText || ""}
                onChange={(e) =>
                  onUpdateElement({ ...selectedElement, buttonText: e.target.value })
                }
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Action Type</label>
              <select
                value={selectedElement.actionType || "rsvp"}
                onChange={(e) =>
                  onUpdateElement({ ...selectedElement, actionType: e.target.value as any })
                }
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              >
                <option value="rsvp">Open RSVP Modal</option>
                <option value="map">Open Google Maps</option>
                <option value="calendar">Sync with Calendar</option>
                <option value="link">Custom External Link</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Button Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedElement.buttonBg || "#D4AF37"}
                  onChange={(e) =>
                    onUpdateElement({ ...selectedElement, buttonBg: e.target.value })
                  }
                  className="h-8 w-8 cursor-pointer rounded-lg border border-stone-200 p-0.5"
                />
                <input
                  type="text"
                  value={selectedElement.buttonBg || "#D4AF37"}
                  onChange={(e) =>
                    onUpdateElement({ ...selectedElement, buttonBg: e.target.value })
                  }
                  className="w-24 rounded-lg border border-stone-200 px-2 py-1 text-xs font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedElement.buttonColor || "#FFFFFF"}
                  onChange={(e) =>
                    onUpdateElement({ ...selectedElement, buttonColor: e.target.value })
                  }
                  className="h-8 w-8 cursor-pointer rounded-lg border border-stone-200 p-0.5"
                />
                <input
                  type="text"
                  value={selectedElement.buttonColor || "#FFFFFF"}
                  onChange={(e) =>
                    onUpdateElement({ ...selectedElement, buttonColor: e.target.value })
                  }
                  className="w-24 rounded-lg border border-stone-200 px-2 py-1 text-xs font-mono uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* SHAPE / DIVIDER PROPERTIES */}
        {isShape && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Stroke Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedElement.strokeColor || "#D4AF37"}
                  onChange={(e) =>
                    onUpdateElement({ ...selectedElement, strokeColor: e.target.value })
                  }
                  className="h-8 w-8 cursor-pointer rounded-lg border border-stone-200 p-0.5"
                />
                <input
                  type="text"
                  value={selectedElement.strokeColor || "#D4AF37"}
                  onChange={(e) =>
                    onUpdateElement({ ...selectedElement, strokeColor: e.target.value })
                  }
                  className="w-24 rounded-lg border border-stone-200 px-2 py-1 text-xs font-mono uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* IMAGE PROPERTIES */}
        {isImage && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">Image Preview</label>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 shadow-inner">
                <img
                  src={selectedElement.src || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition flex items-center justify-center gap-2"
            >
              <Camera className="h-4 w-4" />
              <span>Replace Photo from Device</span>
            </button>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Image URL</label>
              <input
                type="url"
                value={selectedElement.src || ""}
                onChange={(e) => onUpdateElement({ ...selectedElement, src: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Corner Radius */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Corner Radius</label>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {[
                  { label: "Square", val: 0 },
                  { label: "Soft", val: 16 },
                  { label: "Round", val: 32 },
                  { label: "Circle", val: 500 },
                ].map(({ label, val }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onUpdateElement({ ...selectedElement, borderRadius: val })}
                    className={`py-1.5 rounded-lg text-[10px] font-bold border transition ${
                      selectedElement.borderRadius === val || (!selectedElement.borderRadius && val === 16)
                        ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={selectedElement.width || 400}
                  onChange={(e) => onUpdateElement({ ...selectedElement, width: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-200 px-2 py-1.5 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={selectedElement.height || 400}
                  onChange={(e) => onUpdateElement({ ...selectedElement, height: Number(e.target.value) })}
                  className="w-full rounded-xl border border-stone-200 px-2 py-1.5 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ACTIONS & LAYER TOOLS */}
        <div className="pt-4 border-t border-stone-100 space-y-2">
          <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
            Layer Actions
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onDuplicateElement(selectedElement)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              <Copy className="h-3.5 w-3.5 text-stone-500" />
              <span>Duplicate</span>
            </button>

            <button
              type="button"
              onClick={() => onDeleteElement(selectedElement.id)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
