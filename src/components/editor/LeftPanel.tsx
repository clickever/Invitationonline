"use client";

import React, { useState, useRef } from "react";
import { 
  FileText, 
  PlusSquare, 
  Palette, 
  Sliders, 
  Calendar, 
  MapPin, 
  Heart, 
  Image as ImageIcon, 
  Sparkles, 
  Type, 
  Music,
  Eye,
  Check,
  Upload,
  Trash2,
  Camera,
  Layers,
  ChevronDown,
  Crown,
  Phone
} from "lucide-react";
import { CanvasElement, Invitation, InvitationSettings } from "@/lib/types";
import { PALACE_THEMES } from "../invitation/PalaceInvitationRenderer";

interface LeftPanelProps {
  invitation: Invitation;
  onUpdateField: (field: string, value: any) => void;
  onAddElement: (element: Partial<CanvasElement>) => void;
  onSelectElementId: (id: string) => void;
}

export default function LeftPanel({
  invitation,
  onUpdateField,
  onAddElement,
  onSelectElementId,
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<"content" | "layers" | "media" | "elements" | "theme">("content");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replacingElementId, setReplacingElementId] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Quick preset backgrounds
  const backgroundPresets = [
    { label: "Ivory Silk", value: "#FDFBF7", textColor: "#2D261E" },
    { label: "Champagne Gold", value: "#FAF5EF", textColor: "#362A10" },
    { label: "Blush Rose", value: "#FFF8F7", textColor: "#3E292E" },
    { label: "Midnight Sapphire", value: "#0B132B", textColor: "#FFFFFF" },
    { label: "Royal Crimson", value: "#580A18", textColor: "#FDFBF7" },
    { label: "Emerald Jewel", value: "#0F382C", textColor: "#F8FAF9" },
    { label: "Slate Obsidian", value: "#121316", textColor: "#FFFFFF" },
  ];

  // Helper to find existing text from canvas elements
  const getFieldValue = (key: string, fallback: string = ""): string => {
    const el = (invitation.elements || []).find((e) => e.fieldKey === key || e.id === key);
    if (el && el.text) return el.text;
    if ((invitation as any)[key]) return (invitation as any)[key];
    return fallback;
  };

  const handleTextContentChange = (fieldKey: string, newValue: string) => {
    onUpdateField(fieldKey, newValue);

    // Synchronize canvas text element if exists
    const updatedElements = (invitation.elements || []).map((el) => {
      if (el.fieldKey === fieldKey || el.id === fieldKey) {
        return { ...el, text: newValue };
      }
      return el;
    });
    onUpdateField("elements", updatedElements);
  };

  const handleUpdateCanvasElementText = (id: string, text: string) => {
    const updatedElements = (invitation.elements || []).map((el) => {
      if (el.id === id) {
        return { ...el, text };
      }
      return el;
    });
    onUpdateField("elements", updatedElements);
  };

  const handleUpdateCanvasElementFontSize = (id: string, fontSize: number) => {
    const updatedElements = (invitation.elements || []).map((el) => {
      if (el.id === id) {
        return { ...el, fontSize };
      }
      return el;
    });
    onUpdateField("elements", updatedElements);
  };

  const handleUpdateCanvasElementColor = (id: string, color: string) => {
    const updatedElements = (invitation.elements || []).map((el) => {
      if (el.id === id) {
        return { ...el, color };
      }
      return el;
    });
    onUpdateField("elements", updatedElements);
  };

  const handleDeleteElement = (id: string) => {
    const updatedElements = (invitation.elements || []).filter((el) => el.id !== id);
    onUpdateField("elements", updatedElements);
  };

  const handleAddText = (type: "title" | "subtitle" | "body") => {
    const id = `text_${Date.now()}`;
    const newElement: CanvasElement = {
      id,
      type: "text",
      editable: true,
      text: type === "title" ? "Special Title" : type === "subtitle" ? "SUBTITLE DETAILS" : "Enter your celebration text here...",
      fontSize: type === "title" ? 54 : type === "subtitle" ? 24 : 20,
      fontFamily: type === "title" ? "Playfair Display" : "Inter",
      fontWeight: type === "title" ? "700" : type === "subtitle" ? "600" : "400",
      color: invitation.background?.value === "#0B132B" || invitation.background?.value === "#580A18" ? "#FFFFFF" : "#2D261E",
      textAlign: "center",
      x: 140,
      y: 700,
      width: 800,
      height: 60,
    };
    onAddElement(newElement);
    onSelectElementId(id);
  };

  // Upload or replace image from local device via FileReader DataURL
  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetElementId?: string | null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (targetElementId) {
        // Replace existing image
        const updatedElements = (invitation.elements || []).map((el) =>
          el.id === targetElementId ? { ...el, src: dataUrl } : el
        );
        onUpdateField("elements", updatedElements);
      } else {
        // Add new image element to canvas
        const newImg: CanvasElement = {
          id: `img_${Date.now()}`,
          type: "image",
          src: dataUrl,
          x: 240,
          y: 500,
          width: 600,
          height: 600,
          borderRadius: 24,
          zIndex: 3,
        };
        onAddElement(newImg);
        onSelectElementId(newImg.id);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAddImageFromUrl = () => {
    if (!newImageUrl.trim()) return;
    const newImg: CanvasElement = {
      id: `img_${Date.now()}`,
      type: "image",
      src: newImageUrl.trim(),
      x: 240,
      y: 500,
      width: 600,
      height: 600,
      borderRadius: 24,
      zIndex: 3,
    };
    onAddElement(newImg);
    onSelectElementId(newImg.id);
    setNewImageUrl("");
  };

  const handleReplaceImageUrl = (elementId: string, url: string) => {
    const updatedElements = (invitation.elements || []).map((el) =>
      el.id === elementId ? { ...el, src: url } : el
    );
    onUpdateField("elements", updatedElements);
  };

  const textElements = (invitation.elements || []).filter((el) => el.type === "text");
  const imageElements = (invitation.elements || []).filter((el) => el.type === "image");

  return (
    <aside className="w-80 border-r border-stone-200 bg-white flex flex-col shrink-0 z-20 overflow-hidden h-[calc(100vh-4rem)]">
      {/* Hidden File Input for Device Image Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleDeviceFileUpload(e, null)}
      />
      <input
        type="file"
        ref={replaceFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleDeviceFileUpload(e, replacingElementId)}
      />

      {/* Top Tab Switcher */}
      <div className="flex border-b border-stone-200 bg-stone-50/70 p-1">
        {[
          { id: "content", label: "Details", icon: FileText },
          { id: "layers", label: "Texts", icon: Type },
          { id: "media", label: "Photos", icon: ImageIcon },
          { id: "elements", label: "Add", icon: PlusSquare },
          { id: "theme", label: "Style", icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center justify-center py-2 text-[9px] font-bold uppercase tracking-wider rounded-xl transition ${
                activeTab === tab.id
                  ? "bg-white text-amber-700 shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Icon className="h-4 w-4 mb-0.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* ========================================================================= */}
        {/* TAB 1: ALL EVENT DETAILS */}
        {/* ========================================================================= */}
        {activeTab === "content" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Event Information
              </h3>
              <p className="text-[11px] text-stone-500">
                Edit any field below to immediately update all texts on the invitation.
              </p>
            </div>

            {/* Event Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Occasion / Event Title</label>
              <input
                type="text"
                value={invitation.title || ""}
                onChange={(e) => {
                  onUpdateField("title", e.target.value);
                  handleTextContentChange("title", e.target.value);
                  handleTextContentChange("event_title", e.target.value);
                }}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Celebrants / Bride & Groom */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Bride / First Name</label>
                <input
                  type="text"
                  placeholder="Bride's Name"
                  value={getFieldValue("bride_name", "")}
                  onChange={(e) => handleTextContentChange("bride_name", e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Groom / Second Name</label>
                <input
                  type="text"
                  placeholder="Groom's Name"
                  value={getFieldValue("groom_name", "")}
                  onChange={(e) => handleTextContentChange("groom_name", e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Combined Names / Celebrant Headline */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Couple / Joint Names</label>
              <input
                type="text"
                placeholder="e.g. Ananya & Arjun"
                value={getFieldValue("couple_names", "")}
                onChange={(e) => handleTextContentChange("couple_names", e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Intro / Welcome Tagline */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Welcome / Intro Tagline</label>
              <input
                type="text"
                placeholder="e.g. Together with their parents, request the pleasure of your company"
                value={getFieldValue("event_subtitle", "")}
                onChange={(e) => handleTextContentChange("event_subtitle", e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Event Date</label>
                <input
                  type="date"
                  value={invitation.eventDate ? invitation.eventDate.split("T")[0] : ""}
                  onChange={(e) => {
                    const newIso = new Date(e.target.value).toISOString();
                    onUpdateField("eventDate", newIso);
                    handleTextContentChange("event_date", e.target.value);
                  }}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Event Time</label>
                <input
                  type="text"
                  value={invitation.eventTime || getFieldValue("event_time", "")}
                  placeholder="e.g. 5:00 PM onwards"
                  onChange={(e) => {
                    onUpdateField("eventTime", e.target.value);
                    handleTextContentChange("event_time", e.target.value);
                  }}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Venue & Location */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Venue Name</label>
              <input
                type="text"
                value={invitation.venueName || getFieldValue("venue_name", "")}
                placeholder="e.g. The Grand Regal Palace"
                onChange={(e) => {
                  onUpdateField("venueName", e.target.value);
                  handleTextContentChange("venue_name", e.target.value);
                }}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Venue Address</label>
              <textarea
                rows={2}
                value={invitation.venueAddress || getFieldValue("venue_address", "")}
                placeholder="e.g. Heritage Lawns, Lake Palace Road, Udaipur"
                onChange={(e) => {
                  onUpdateField("venueAddress", e.target.value);
                  handleTextContentChange("venue_address", e.target.value);
                }}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Host & Family Note */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Host & Family Note</label>
              <input
                type="text"
                value={invitation.hostNames || getFieldValue("host_names", "")}
                placeholder="e.g. With best compliments from Sharma & Verma Families"
                onChange={(e) => {
                  onUpdateField("hostNames", e.target.value);
                  handleTextContentChange("host_names", e.target.value);
                }}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Dress Code */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Dress Code / Attire</label>
              <input
                type="text"
                placeholder="e.g. Traditional Indian Elegance / Formal Black Tie"
                value={getFieldValue("dress_code", "")}
                onChange={(e) => handleTextContentChange("dress_code", e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Quote / Special Message */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Inspirational Quote / Note</label>
              <textarea
                rows={2}
                placeholder="e.g. Two souls with but a single thought, two hearts that beat as one."
                value={getFieldValue("quote", "")}
                onChange={(e) => handleTextContentChange("quote", e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Palace Luxury Edition Specifics */}
            {(invitation.templateId?.startsWith("wedding-palace") || invitation.settings?.layoutStyle === "palace") && (
              <div className="pt-4 border-t border-amber-200/80 space-y-4">
                <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Crown className="w-3.5 h-3.5 text-amber-700" />
                    <span>Palace Royal Edition Settings</span>
                  </div>
                  <p className="text-[10px] text-amber-800/80">
                    Customise sacred ceremony, grand evening reception, dual couple options, and host hotlines.
                  </p>
                </div>

                {/* Auspicious Symbol */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Auspicious Symbol</label>
                  <div className="flex flex-wrap gap-2">
                    {["ॐ", "ੴ", "✝", "☪", "✦", "✨"].map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() =>
                          onUpdateField("settings", {
                            ...invitation.settings,
                            symbol: sym,
                          })
                        }
                        className={`w-8 h-8 rounded-lg border text-sm font-serif flex items-center justify-center transition ${
                          (invitation.settings?.symbol || "ॐ") === sym
                            ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                    <input
                      type="text"
                      placeholder="Custom"
                      value={invitation.settings?.symbol || ""}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          symbol: e.target.value,
                        })
                      }
                      className="w-16 rounded-lg border border-stone-200 px-2 text-xs text-center focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Family Host Banner */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Family Host Banner</label>
                  <input
                    type="text"
                    placeholder="e.g. Shanmughan Family"
                    value={invitation.settings?.familyHostName || ""}
                    onChange={(e) =>
                      onUpdateField("settings", {
                        ...invitation.settings,
                        familyHostName: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Sacred Ceremony Muhurtham Details */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider block">
                    Sacred Ceremony (Muhurtham)
                  </span>
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-1">Ceremony Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Thaalikettu / Muhurtham"
                      value={invitation.settings?.ceremonyName || "Thaalikettu"}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          ceremonyName: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-1">Muhurtham Time Window</label>
                    <input
                      type="text"
                      placeholder="e.g. 8:15 AM — 9:15 AM"
                      value={invitation.settings?.ceremonyTime || ""}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          ceremonyTime: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-1">Temple / Venue Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Guruvayoor Sreekrishnan Temple"
                      value={invitation.settings?.ceremonyVenue || ""}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          ceremonyVenue: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-1">Temple Google Maps URL</label>
                    <input
                      type="url"
                      placeholder="https://maps.google.com/..."
                      value={invitation.settings?.ceremonyMapUrl || ""}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          ceremonyMapUrl: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dual Wedding Toggle */}
                <div className="pt-2">
                  <label className="flex items-center justify-between rounded-xl border border-stone-200 p-2.5 hover:bg-stone-50 cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-stone-800">Dual Wedding (Two Couples)</div>
                      <div className="text-[10px] text-stone-500">Feature two couples simultaneously</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!invitation.settings?.isDualCouple}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          isDualCouple: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded accent-amber-600"
                    />
                  </label>
                </div>

                {/* Couple 2 Inputs if Dual Couple */}
                {invitation.settings?.isDualCouple && (
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider block">
                      Couple Two Details
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-stone-600 mb-1">Groom Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Akheesh"
                          value={invitation.settings?.couple2GroomName || ""}
                          onChange={(e) =>
                            onUpdateField("settings", {
                              ...invitation.settings,
                              couple2GroomName: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-stone-600 mb-1">Bride Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Aiswarya"
                          value={invitation.settings?.couple2BrideName || ""}
                          onChange={(e) =>
                            onUpdateField("settings", {
                              ...invitation.settings,
                              couple2BrideName: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-stone-600 mb-1">Couple 2 Parents</label>
                      <input
                        type="text"
                        placeholder="Daughter of Mr. Sajeev & Mrs. Neena Sajeev"
                        value={invitation.settings?.couple2Parents || ""}
                        onChange={(e) =>
                          onUpdateField("settings", {
                            ...invitation.settings,
                            couple2Parents: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-stone-600 mb-1">Couple 2 Ceremony Temple</label>
                      <input
                        type="text"
                        placeholder="Valiyalukkal Devi Temple"
                        value={invitation.settings?.couple2CeremonyVenue || ""}
                        onChange={(e) =>
                          onUpdateField("settings", {
                            ...invitation.settings,
                            couple2CeremonyVenue: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-stone-600 mb-1">Couple 2 Ceremony Time</label>
                      <input
                        type="text"
                        placeholder="9:00 AM — 9:30 AM"
                        value={invitation.settings?.couple2CeremonyTime || ""}
                        onChange={(e) =>
                          onUpdateField("settings", {
                            ...invitation.settings,
                            couple2CeremonyTime: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Grand Evening Reception */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider block">
                    Grand Evening Reception
                  </span>
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-1">Reception Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. An Evening of Joy"
                      value={invitation.settings?.receptionName || ""}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          receptionName: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-stone-600 mb-1">Reception Date</label>
                      <input
                        type="text"
                        placeholder="e.g. November 9th, 2026"
                        value={invitation.settings?.receptionDate || ""}
                        onChange={(e) =>
                          onUpdateField("settings", {
                            ...invitation.settings,
                            receptionDate: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-stone-600 mb-1">Reception Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 5:00 PM — 9:00 PM"
                        value={invitation.settings?.receptionTime || ""}
                        onChange={(e) =>
                          onUpdateField("settings", {
                            ...invitation.settings,
                            receptionTime: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-1">Auditorium / Venue Name</label>
                    <input
                      type="text"
                      placeholder="Golden Palace Auditorium"
                      value={invitation.settings?.receptionVenue || ""}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          receptionVenue: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-1">Auditorium Address</label>
                    <textarea
                      rows={2}
                      placeholder="Convention Center, Choondal, Thrissur–Kunnamkulam Road"
                      value={invitation.settings?.receptionAddress || ""}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          receptionAddress: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-1">Auditorium Google Maps URL</label>
                    <input
                      type="url"
                      placeholder="https://maps.google.com/..."
                      value={invitation.settings?.receptionMapUrl || ""}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          receptionMapUrl: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Direct Host Hotlines */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider block">
                    Host Hotline Phone Numbers
                  </span>
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-1">Host 1 (Call & WhatsApp)</label>
                    <input
                      type="tel"
                      placeholder="+91 6282 342 270"
                      value={invitation.settings?.contactPhone || ""}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          contactPhone: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-1">Host 2 (Call & WhatsApp)</label>
                    <input
                      type="tel"
                      placeholder="+91 9496 278 238"
                      value={invitation.settings?.whatsappPhone || ""}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          whatsappPhone: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: DIRECT CANVAS TEXT LAYERS INSPECTOR */}
        {/* ========================================================================= */}
        {activeTab === "layers" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                All Canvas Text Elements ({textElements.length})
              </h3>
              <p className="text-[11px] text-stone-500">
                Directly edit every line of text, font size, or color across the entire invitation.
              </p>
            </div>

            <div className="space-y-3">
              {textElements.map((el, index) => (
                <div
                  key={el.id}
                  className="rounded-2xl border border-stone-200 p-3 bg-stone-50/60 hover:bg-stone-50 transition space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onSelectElementId(el.id)}
                      className="text-left font-bold text-xs text-amber-800 hover:underline truncate max-w-[200px]"
                    >
                      {el.fieldKey ? `✦ ${el.fieldKey.replace(/_/g, " ")}` : `Text Layer #${index + 1}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteElement(el.id)}
                      className="p-1 text-stone-400 hover:text-red-600 transition"
                      title="Delete Text"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={el.text || ""}
                    onChange={(e) => handleUpdateCanvasElementText(el.id, e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                  />

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/60">
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="text-[10px] text-stone-500">Size:</span>
                      <input
                        type="range"
                        min={12}
                        max={100}
                        value={el.fontSize || 24}
                        onChange={(e) => handleUpdateCanvasElementFontSize(el.id, Number(e.target.value))}
                        className="w-full accent-amber-600 h-1.5"
                      />
                      <span className="text-[10px] font-mono text-stone-600 min-w-[24px]">
                        {el.fontSize || 24}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-stone-500">Color:</span>
                      <input
                        type="color"
                        value={el.color || "#2D261E"}
                        onChange={(e) => handleUpdateCanvasElementColor(el.id, e.target.value)}
                        className="h-6 w-6 cursor-pointer rounded-md border border-stone-200 p-0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleAddText("body")}
              className="w-full rounded-xl border border-dashed border-stone-300 py-2.5 text-xs font-semibold text-stone-600 hover:border-amber-500 hover:text-amber-700 transition flex items-center justify-center gap-1.5"
            >
              <Type className="h-4 w-4" />
              <span>+ Add New Text Element</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: IMAGES & PHOTOS (DEVICE UPLOAD & URL) */}
        {/* ========================================================================= */}
        {activeTab === "media" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Photos & Images
              </h3>
              <p className="text-[11px] text-stone-500">
                Replace template photos with couple photos, venue pictures, or custom graphics.
              </p>
            </div>

            {/* Upload Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-2xl bg-amber-600 py-3 text-xs font-bold text-white shadow hover:bg-amber-700 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Photo from Device</span>
              </button>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste Image URL (https://...)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageFromUrl}
                  className="rounded-xl bg-stone-900 px-3 py-2 text-xs font-bold text-white hover:bg-stone-800 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* List of Canvas Images */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Images on Invitation ({imageElements.length})
              </span>

              {imageElements.length === 0 ? (
                <div className="rounded-2xl border border-stone-200 p-6 text-center text-xs text-stone-500">
                  No images currently on canvas. Upload one above to enhance your invitation!
                </div>
              ) : (
                imageElements.map((el) => (
                  <div
                    key={el.id}
                    className="rounded-2xl border border-stone-200 p-3 bg-stone-50/60 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={el.src}
                        alt="Canvas visual"
                        className="h-14 w-14 rounded-xl object-cover border border-stone-300 shadow-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => onSelectElementId(el.id)}
                          className="text-left font-bold text-xs text-stone-800 hover:text-amber-700 truncate block w-full"
                        >
                          {el.fieldKey || el.id}
                        </button>
                        <span className="text-[10px] text-stone-400 block">
                          Size: {el.width} × {el.height}px
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteElement(el.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition shrink-0"
                        title="Delete Image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Replace Actions */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReplacingElementId(el.id);
                          replaceFileInputRef.current?.click();
                        }}
                        className="flex-1 rounded-xl bg-white border border-stone-200 py-1.5 text-[11px] font-semibold text-stone-700 hover:bg-stone-50 transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Camera className="h-3.5 w-3.5 text-amber-600" />
                        <span>Replace File</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt("Enter new image URL:", el.src || "");
                          if (url && url.trim()) {
                            handleReplaceImageUrl(el.id, url.trim());
                          }
                        }}
                        className="rounded-xl bg-white border border-stone-200 px-3 py-1.5 text-[11px] font-semibold text-stone-700 hover:bg-stone-50 transition shadow-2xs"
                      >
                        URL
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ADD ELEMENTS & WIDGETS */}
        {/* ========================================================================= */}
        {activeTab === "elements" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Add Elements</h3>
              <p className="text-[11px] text-stone-500">Insert new design and interactive components.</p>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Typography</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleAddText("title")}
                  className="flex flex-col items-center justify-center rounded-xl border border-stone-200 p-2.5 hover:border-amber-500 hover:bg-amber-50/50 transition"
                >
                  <Type className="h-5 w-5 text-stone-700 mb-1" />
                  <span className="text-[10px] font-bold text-stone-800">Heading</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddText("subtitle")}
                  className="flex flex-col items-center justify-center rounded-xl border border-stone-200 p-2.5 hover:border-amber-500 hover:bg-amber-50/50 transition"
                >
                  <Type className="h-4 w-4 text-stone-600 mb-1" />
                  <span className="text-[10px] font-semibold text-stone-800">Subtitle</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddText("body")}
                  className="flex flex-col items-center justify-center rounded-xl border border-stone-200 p-2.5 hover:border-amber-500 hover:bg-amber-50/50 transition"
                >
                  <FileText className="h-4 w-4 text-stone-500 mb-1" />
                  <span className="text-[10px] font-medium text-stone-800">Paragraph</span>
                </button>
              </div>
            </div>

            {/* Interactive Widgets */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Interactive Components
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const id = `rsvp_btn_${Date.now()}`;
                    onAddElement({
                      id,
                      type: "button",
                      buttonText: "RSVP NOW",
                      actionType: "rsvp",
                      buttonStyle: "solid",
                      buttonBg: invitation.settings?.themeColor || "#D4AF37",
                      buttonColor: "#FFFFFF",
                      x: 340,
                      y: 1300,
                      width: 400,
                      height: 65,
                      borderRadius: 40,
                    });
                    onSelectElementId(id);
                  }}
                  className="w-full flex items-center justify-between rounded-xl border border-stone-200 p-3 hover:border-amber-500 hover:bg-amber-50/40 text-left transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="h-4 w-4 text-amber-600" />
                    <div>
                      <div className="text-xs font-bold text-stone-800">RSVP Action Button</div>
                      <div className="text-[10px] text-stone-500">Opens guest confirmation form</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700">+ Add</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const id = `countdown_${Date.now()}`;
                    onAddElement({
                      id,
                      type: "countdown",
                      x: 190,
                      y: 1100,
                      width: 700,
                      height: 120,
                      color: invitation.settings?.themeColor || "#D4AF37",
                    });
                    onSelectElementId(id);
                  }}
                  className="w-full flex items-center justify-between rounded-xl border border-stone-200 p-3 hover:border-amber-500 hover:bg-amber-50/40 text-left transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <div>
                      <div className="text-xs font-bold text-stone-800">Countdown Clock</div>
                      <div className="text-[10px] text-stone-500">Live days, hours, mins counter</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700">+ Add</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const id = `divider_${Date.now()}`;
                    onAddElement({
                      id,
                      type: "divider",
                      shapeType: "ornament",
                      strokeColor: invitation.settings?.themeColor || "#D4AF37",
                      x: 440,
                      y: 500,
                      width: 200,
                      height: 20,
                    });
                    onSelectElementId(id);
                  }}
                  className="w-full flex items-center justify-between rounded-xl border border-stone-200 p-3 hover:border-amber-500 hover:bg-amber-50/40 text-left transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-amber-600 text-sm">✦</span>
                    <div>
                      <div className="text-xs font-bold text-stone-800">Decorative Divider</div>
                      <div className="text-[10px] text-stone-500">Gold sparkle flourish</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700">+ Add</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: STYLE & THEME */}
        {/* ========================================================================= */}
        {activeTab === "theme" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Theme & Atmosphere</h3>
              <p className="text-[11px] text-stone-500">Customize card background color and accent colors.</p>
            </div>

            {/* Palace Royal Collection Colorways */}
            <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Crown className="w-3.5 h-3.5 text-amber-700" />
                <span>Palace Royal Color Themes</span>
              </div>
              <p className="text-[10px] text-amber-800/80">
                Switch between the 4 royal luxury palace themes with 1 click.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { id: "burgundy", name: "Royal Burgundy", color: "#800020", bg: "#F5EDE6" },
                  { id: "emerald", name: "Imperial Emerald", color: "#0F382C", bg: "#F3F7F4" },
                  { id: "rosegold", name: "Ivory & Rose Gold", color: "#6A2D3C", bg: "#FAF4F3" },
                  { id: "sapphire", name: "Midnight Sapphire", color: "#0F1F44", bg: "#F2F4F9" },
                ].map((th) => {
                  const currentVariant = invitation.settings?.palaceVariant || (
                    invitation.templateId?.includes("emerald") ? "emerald" :
                    invitation.templateId?.includes("rosegold") ? "rosegold" :
                    invitation.templateId?.includes("sapphire") ? "sapphire" : "burgundy"
                  );
                  const isSelected = currentVariant === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => {
                        onUpdateField("settings", {
                          ...invitation.settings,
                          palaceVariant: th.id,
                          themeColor: th.color,
                        });
                        onUpdateField("background", {
                          type: "color",
                          value: th.bg,
                        });
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left transition ${
                        isSelected
                          ? "border-amber-600 bg-white ring-2 ring-amber-500/20 shadow-sm"
                          : "border-stone-200 bg-white hover:border-stone-300"
                      }`}
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-black/10 shrink-0 shadow-inner"
                        style={{ backgroundColor: th.color }}
                      />
                      <span className="text-[11px] font-bold text-stone-800 truncate">
                        {th.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background Color Presets */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Card Background Palette
              </label>
              <div className="grid grid-cols-2 gap-2">
                {backgroundPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => onUpdateField("background", { type: "color", value: preset.value })}
                    className={`flex items-center gap-2 rounded-xl p-2 border text-left transition ${
                      invitation.background?.value === preset.value
                        ? "border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-black/10 shrink-0 shadow-inner"
                      style={{ backgroundColor: preset.value }}
                    />
                    <span className="text-xs font-medium text-stone-800 truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Accent Color */}
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-700 mb-2">Accent Theme Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={invitation.settings?.themeColor || "#D4AF37"}
                  onChange={(e) =>
                    onUpdateField("settings", {
                      ...invitation.settings,
                      themeColor: e.target.value,
                    })
                  }
                  className="h-10 w-10 cursor-pointer rounded-xl border border-stone-200 bg-white p-1"
                />
                <input
                  type="text"
                  value={invitation.settings?.themeColor || "#D4AF37"}
                  onChange={(e) =>
                    onUpdateField("settings", {
                      ...invitation.settings,
                      themeColor: e.target.value,
                    })
                  }
                  className="w-32 rounded-xl border border-stone-200 px-3 py-2 text-xs font-mono uppercase"
                />
              </div>
            </div>

            {/* Interactive Module Toggles */}
            <div className="pt-3 border-t border-stone-100 space-y-3">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Interactive Modules
              </span>
              {[
                { key: "enableCountdown", label: "Countdown Clock", desc: "Live countdown timer", icon: Sparkles },
                { key: "enableRsvp", label: "RSVP Response Form", desc: "Allow guests to respond", icon: Heart },
                { key: "enableMap", label: "Google Maps Navigation", desc: "Directions to venue", icon: MapPin },
                { key: "enableCalendar", label: "Add to Calendar", desc: "Google / Apple / Outlook calendar", icon: Calendar },
                { key: "enableGallery", label: "Guest Photo Gallery", desc: "Photo album on public page", icon: ImageIcon },
              ].map(({ key, label, desc, icon: Icon }) => {
                const isEnabled = (invitation.settings as any)?.[key] !== false;
                return (
                  <label
                    key={key}
                    className="flex items-center justify-between rounded-xl border border-stone-200 p-3 hover:bg-stone-50 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-amber-700" />
                      <div>
                        <div className="text-xs font-bold text-stone-800">{label}</div>
                        <div className="text-[10px] text-stone-500">{desc}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          [key]: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded accent-amber-600"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
