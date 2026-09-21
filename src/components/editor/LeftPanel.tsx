"use client";

import React, { useState } from "react";
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
  Check
} from "lucide-react";
import { CanvasElement, Invitation, InvitationSettings } from "@/lib/types";

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
  const [activeTab, setActiveTab] = useState<"content" | "elements" | "theme" | "settings">("content");

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

  return (
    <aside className="w-80 border-r border-stone-200 bg-white flex flex-col shrink-0 z-20 overflow-hidden h-[calc(100vh-4rem)]">
      {/* Top Tab Switcher */}
      <div className="flex border-b border-stone-200 bg-stone-50/70 p-1">
        {[
          { id: "content", label: "Content", icon: FileText },
          { id: "elements", label: "Add", icon: PlusSquare },
          { id: "theme", label: "Style", icon: Palette },
          { id: "settings", label: "Widgets", icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center justify-center py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition ${
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
        {/* TAB 1: PREDEFINED EVENT CONTENT */}
        {activeTab === "content" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Invitation Details
              </h3>
              <p className="text-[11px] text-stone-500">
                Edit core content to update canvas components directly.
              </p>
            </div>

            {/* Event Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Event Title</label>
              <input
                type="text"
                value={invitation.title || ""}
                onChange={(e) => handleTextContentChange("title", e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Couple / Names */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Bride / Primary</label>
                <input
                  type="text"
                  placeholder="Bride's Name"
                  defaultValue="Ananya"
                  onChange={(e) => handleTextContentChange("bride_name", e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Groom / Secondary</label>
                <input
                  type="text"
                  placeholder="Groom's Name"
                  defaultValue="Arjun"
                  onChange={(e) => handleTextContentChange("groom_name", e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Event Date</label>
                <input
                  type="date"
                  value={invitation.eventDate ? invitation.eventDate.split("T")[0] : ""}
                  onChange={(e) => onUpdateField("eventDate", new Date(e.target.value).toISOString())}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Event Time</label>
                <input
                  type="text"
                  value={invitation.eventTime || ""}
                  placeholder="5:00 PM onwards"
                  onChange={(e) => handleTextContentChange("event_time", e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Venue & Location */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Venue Name</label>
              <input
                type="text"
                value={invitation.venueName || ""}
                placeholder="The Grand Palace"
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
                value={invitation.venueAddress || ""}
                placeholder="Street address, City, State"
                onChange={(e) => {
                  onUpdateField("venueAddress", e.target.value);
                  handleTextContentChange("venue_address", e.target.value);
                }}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Host / Family Note */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Host & Family Note</label>
              <input
                type="text"
                value={invitation.hostNames || ""}
                placeholder="With best compliments from the Family"
                onChange={(e) => {
                  onUpdateField("hostNames", e.target.value);
                  handleTextContentChange("host_names", e.target.value);
                }}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 2: ADD ELEMENTS */}
        {activeTab === "elements" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Add Elements</h3>
              <p className="text-[11px] text-stone-500">Insert new design and interactive components.</p>
            </div>

            {/* Text Types */}
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
                Special Widgets
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
                      <div className="text-[10px] text-stone-500">Opens guest response form</div>
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
                      <div className="text-[10px] text-stone-500">Gold sparkle divider flourish</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700">+ Add</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STYLE & THEME */}
        {activeTab === "theme" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Theme & Colors</h3>
              <p className="text-[11px] text-stone-500">Customize background atmosphere and accents.</p>
            </div>

            {/* Background Color Presets */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Card Background
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
              <label className="block text-xs font-semibold text-stone-700 mb-2">Accent Color</label>
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
          </div>
        )}

        {/* TAB 4: WIDGETS & SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Interactive Modules
              </h3>
              <p className="text-[11px] text-stone-500">Toggle special components on the public page.</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: "enableCountdown",
                  label: "Countdown Clock",
                  desc: "Live countdown until event starts",
                  icon: Sparkles,
                },
                {
                  key: "enableRsvp",
                  label: "RSVP Response Form",
                  desc: "Allow guests to confirm attendance",
                  icon: Heart,
                },
                {
                  key: "enableMap",
                  label: "Google Maps Navigation",
                  desc: "Direct link to venue location",
                  icon: MapPin,
                },
                {
                  key: "enableCalendar",
                  label: "Add to Calendar",
                  desc: "Google & Apple calendar sync",
                  icon: Calendar,
                },
                {
                  key: "enableGallery",
                  label: "Photo Memories Gallery",
                  desc: "Showcase event photos with lightbox",
                  icon: ImageIcon,
                },
                {
                  key: "enableMusic",
                  label: "Ambient Music Player",
                  desc: "Gentle celebration audio playback",
                  icon: Music,
                },
              ].map((item) => {
                const Icon = item.icon;
                const isChecked = (invitation.settings as any)?.[item.key] ?? false;
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3 rounded-2xl border border-stone-200 bg-stone-50/50"
                  >
                    <div className="flex items-start gap-2.5 pr-2">
                      <Icon className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-stone-800">{item.label}</div>
                        <div className="text-[10px] text-stone-500">{item.desc}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateField("settings", {
                          ...invitation.settings,
                          [item.key]: !isChecked,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isChecked ? "bg-amber-600" : "bg-stone-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isChecked ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
