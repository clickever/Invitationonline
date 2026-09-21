"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CanvasElement, Invitation } from "@/lib/types";
import { 
  getInvitationById, 
  saveInvitation, 
  DEFAULT_DEMO_USER 
} from "@/lib/supabase/storage";
import { getTemplateById } from "@/lib/templates";
import { generateSlug } from "@/lib/utils";
import EditorHeader from "@/components/editor/EditorHeader";
import LeftPanel from "@/components/editor/LeftPanel";
import PropertiesPanel from "@/components/editor/PropertiesPanel";
import CanvasStage from "@/components/editor/CanvasStage";
import MobileToolbar from "@/components/editor/MobileToolbar";
import PreviewModal from "@/components/editor/PreviewModal";
import ShareModal from "@/components/invitation/ShareModal";

export default function VisualEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.42);
  const [isSaving, setIsSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<Invitation[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Push state to history
  const pushHistory = useCallback(
    (newInvite: Invitation) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, JSON.parse(JSON.stringify(newInvite))];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  // Load or initialize invitation
  useEffect(() => {
    if (!id) return;

    const init = async () => {
      setLoading(true);
      try {
        let invite = await getInvitationById(id);

        // If this ID is a template ID, initialize a new invitation from it
        if (!invite && id.startsWith("wedding-") || id.startsWith("birthday-") || id.startsWith("engagement-") || id.startsWith("babyshower-") || id.startsWith("housewarming-") || id.startsWith("anniversary-")) {
          const tpl = getTemplateById(id);
          if (tpl) {
            invite = {
              id: `inv_${Date.now()}`,
              userId: DEFAULT_DEMO_USER.id,
              templateId: tpl.id,
              slug: generateSlug(tpl.name),
              title: tpl.name,
              eventType: tpl.category,
              eventDate: "2026-10-24T17:00:00.000Z",
              eventTime: "5:00 PM onwards",
              venueName: "The Grand Regal Palace",
              venueAddress: "Heritage Lawns, Lake Palace Road",
              hostNames: "The Family & Friends",
              description: tpl.description,
              canvas: tpl.canvas,
              background: tpl.background,
              elements: JSON.parse(JSON.stringify(tpl.elements)),
              settings: {
                enableCountdown: true,
                enableRsvp: true,
                enableMap: true,
                enableCalendar: true,
                enableGallery: true,
                enableMusic: false,
                isWatermarkHidden: false,
                themeColor: tpl.themeColors?.primary || "#D4AF37",
              },
              isPublished: false,
              isPremium: tpl.isPremium,
              viewsCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await saveInvitation(invite);
          }
        }

        if (invite) {
          setInvitation(invite);
          setHistory([JSON.parse(JSON.stringify(invite))]);
          setHistoryIndex(0);
        }
      } catch (err) {
        console.error("Editor initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id]);

  // Adjust zoom for smaller screens
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        setZoom(0.32);
      } else if (window.innerWidth < 1280) {
        setZoom(0.38);
      } else {
        setZoom(0.44);
      }
    }
  }, []);

  // Keyboard shortcuts for Undo/Redo/Save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const targetState = JSON.parse(JSON.stringify(history[prevIndex]));
      setInvitation(targetState);
      setHistoryIndex(prevIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const targetState = JSON.parse(JSON.stringify(history[nextIndex]));
      setInvitation(targetState);
      setHistoryIndex(nextIndex);
    }
  };

  // State Updates
  const updateInvitationState = (updated: Invitation) => {
    setInvitation(updated);
    pushHistory(updated);
  };

  const handleUpdateField = (field: string, value: any) => {
    if (!invitation) return;
    const updated = {
      ...invitation,
      [field]: value,
    };
    updateInvitationState(updated);
  };

  const handleUpdateElement = (updatedElement: CanvasElement) => {
    if (!invitation) return;
    const updatedElements = (invitation.elements || []).map((el) =>
      el.id === updatedElement.id ? updatedElement : el
    );
    const updated = {
      ...invitation,
      elements: updatedElements,
    };
    updateInvitationState(updated);
  };

  const handleAddElement = (newElement: Partial<CanvasElement>) => {
    if (!invitation) return;
    const fullElement: CanvasElement = {
      id: newElement.id || `el_${Date.now()}`,
      type: newElement.type || "text",
      x: newElement.x ?? 140,
      y: newElement.y ?? 700,
      width: newElement.width ?? 800,
      height: newElement.height ?? 60,
      zIndex: 2,
      ...newElement,
    };
    const updated = {
      ...invitation,
      elements: [...(invitation.elements || []), fullElement],
    };
    updateInvitationState(updated);
    setSelectedElementId(fullElement.id);
    showToast("Added element to invitation");
  };

  const handleDeleteElement = (elementId: string) => {
    if (!invitation) return;
    const updatedElements = (invitation.elements || []).filter((el) => el.id !== elementId);
    const updated = {
      ...invitation,
      elements: updatedElements,
    };
    updateInvitationState(updated);
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
    showToast("Element removed");
  };

  const handleDuplicateElement = (element: CanvasElement) => {
    if (!invitation) return;
    const duplicated: CanvasElement = {
      ...JSON.parse(JSON.stringify(element)),
      id: `${element.type}_${Date.now()}`,
      x: Math.min(1080 - element.width, element.x + 30),
      y: Math.min(1920 - element.height, element.y + 30),
    };
    handleAddElement(duplicated);
  };

  const handleSave = async () => {
    if (!invitation) return;
    setIsSaving(true);
    try {
      await saveInvitation(invitation);
      showToast("All changes saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      showToast("Failed to save invitation.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!invitation) return;
    setIsSaving(true);
    try {
      const published = {
        ...invitation,
        isPublished: true,
      };
      await saveInvitation(published);
      setInvitation(published);
      showToast("🎉 Invitation published live!");
      setShareOpen(true);
    } catch (err) {
      console.error("Publish error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-stone-50">
        <Loader2 className="h-10 w-10 text-amber-600 animate-spin mb-3" />
        <p className="text-sm font-semibold text-stone-700">Opening visual invitation studio...</p>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-stone-50 p-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-800">Invitation not found</h2>
        <p className="text-xs text-stone-500 mt-1 mb-4">Please return to dashboard or select another template.</p>
        <button
          onClick={() => router.push("/templates")}
          className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow"
        >
          Browse Templates
        </button>
      </div>
    );
  }

  const selectedElement = (invitation.elements || []).find((el) => el.id === selectedElementId) || null;
  const publicShareUrl = typeof window !== "undefined" ? `${window.location.origin}/i/${invitation.slug}` : `/i/${invitation.slug}`;

  return (
    <div className="h-screen flex flex-col bg-stone-100 overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-stone-900 text-white px-5 py-2.5 text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-top-2 border border-stone-700">
          {toastMessage}
        </div>
      )}

      {/* Top Navigation Toolbar */}
      <EditorHeader
        title={invitation.title}
        onTitleChange={(newTitle) => handleUpdateField("title", newTitle)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoom={zoom}
        onZoomChange={setZoom}
        isPublished={invitation.isPublished}
        onSave={handleSave}
        onPublish={handlePublish}
        onPreview={() => setPreviewOpen(true)}
        onShare={() => setShareOpen(true)}
        isSaving={isSaving}
      />

      {/* Desktop 3-Column Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Elements Panel (Desktop) */}
        <div className="hidden lg:block">
          <LeftPanel
            invitation={invitation}
            onUpdateField={handleUpdateField}
            onAddElement={handleAddElement}
            onSelectElementId={setSelectedElementId}
          />
        </div>

        {/* Center Interactive Canvas Stage */}
        <CanvasStage
          invitation={invitation}
          selectedElementId={selectedElementId}
          onSelectElementId={setSelectedElementId}
          onUpdateElement={handleUpdateElement}
          zoom={zoom}
        />

        {/* Right Properties Panel (Desktop) */}
        <div className="hidden lg:block">
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onClose={() => setSelectedElementId(null)}
          />
        </div>
      </div>

      {/* Mobile Floating Toolbar & Bottom Sheets */}
      <MobileToolbar
        invitation={invitation}
        selectedElement={selectedElement}
        onUpdateField={handleUpdateField}
        onAddElement={handleAddElement}
        onUpdateElement={handleUpdateElement}
        onDeleteElement={handleDeleteElement}
        onDuplicateElement={handleDuplicateElement}
        onSelectElementId={setSelectedElementId}
        onPreview={() => setPreviewOpen(true)}
        onSave={handleSave}
      />

      {/* Fullscreen Preview Modal */}
      <PreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        invitation={invitation}
        onPublish={handlePublish}
      />

      {/* Share / QR Modal */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={invitation.title}
        shareUrl={publicShareUrl}
        themeColor={invitation.settings?.themeColor}
      />
    </div>
  );
}
