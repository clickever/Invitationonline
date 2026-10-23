"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Eye, FileText, Sparkles, Sliders } from "lucide-react";
import { CanvasElement, Invitation } from "@/lib/types";
import { 
  getInvitationById, 
  saveInvitation, 
  getCurrentUser,
  getGuestDraft,
  saveGuestDraft 
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
import PublishCheckoutModal from "@/components/payments/PublishCheckoutModal";
import PalaceInvitationRenderer from "@/components/invitation/PalaceInvitationRenderer";

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
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"canvas" | "form">("canvas");
  const [mobileSheet, setMobileSheet] = useState<"menu" | "properties" | null>(null);
  const [palaceViewMode, setPalaceViewMode] = useState<"interactive" | "canvas">("interactive");

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
        const user = getCurrentUser();
        const userId = user ? user.id : "guest";

        let invite = await getInvitationById(id);
        if (!invite) {
          invite = getGuestDraft(id);
        }

        // If this ID is a template ID or custom template, initialize an invitation from it
        if (!invite) {
          const tpl = getTemplateById(id);
          if (tpl) {
            invite = {
              id: `inv_${Date.now()}`,
              userId,
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

            if (user) {
              await saveInvitation(invite);
            } else {
              saveGuestDraft(id, invite);
              saveGuestDraft(invite.id, invite);
            }
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
  }, [id, router]);

  // Adjust zoom automatically for mobile screen width
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 640) {
          // Responsive fit scale for mobile viewports (leaving 20px margin so card spans full screen nicely)
          const fitScale = Number(((window.innerWidth - 20) / 1080).toFixed(2));
          setZoom(Math.max(0.28, Math.min(fitScale, 0.42)));
        } else if (window.innerWidth < 1024) {
          setZoom(0.38);
        } else {
          setZoom(0.44);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  // State Updates with functional updater to avoid race conditions
  const updateInvitationState = (updater: ((prev: Invitation) => Invitation) | Invitation) => {
    setInvitation((prev) => {
      if (!prev) return prev;
      const updated = typeof updater === "function" ? (updater as (p: Invitation) => Invitation)(prev) : updater;
      pushHistory(updated);

      if (getCurrentUser()) {
        saveInvitation(updated).catch(console.error);
      } else {
        saveGuestDraft(id, updated);
        saveGuestDraft(updated.id, updated);
      }
      return updated;
    });
  };

  const handleUpdateField = (field: string, value: any) => {
    updateInvitationState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateFields = (updates: Partial<Invitation>) => {
    updateInvitationState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleUpdateElement = (updatedElement: CanvasElement) => {
    updateInvitationState((prev) => ({
      ...prev,
      elements: (prev.elements || []).map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      ),
    }));
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
      if (getCurrentUser()) {
        await saveInvitation(invitation);
      } else {
        saveGuestDraft(id, invitation);
        saveGuestDraft(invitation.id, invitation);
      }
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
    setPublishModalOpen(true);
  };

  const handlePublishedSuccess = (updatedInvite: Invitation) => {
    setInvitation(updatedInvite);
    pushHistory(updatedInvite);
    showToast("🎉 Invitation successfully published!");
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
  const isPalaceTemplate = 
    invitation.templateId?.startsWith("wedding-palace") ||
    invitation.settings?.layoutStyle === "palace" ||
    invitation.title?.toLowerCase().includes("palace");

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

      {/* Mobile Switcher: Visual Canvas vs Form Edit Mode */}
      <div className="lg:hidden bg-stone-100 px-3 py-1.5 border-b border-stone-200 shrink-0">
        <div className="flex rounded-xl bg-stone-200/90 p-1">
          <button
            onClick={() => setMobileTab("canvas")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
              mobileTab === "canvas"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Eye className="h-3.5 w-3.5 text-amber-600" />
            <span>Visual Canvas</span>
          </button>
          <button
            onClick={() => setMobileTab("form")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
              mobileTab === "form"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-amber-600" />
            <span>Edit Form (All Fields)</span>
          </button>
        </div>
      </div>

      {/* Main Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Elements Panel (Desktop always, Mobile when in form mode) */}
        <div className={`${mobileTab === "form" ? "block w-full" : "hidden"} lg:block lg:w-auto`}>
          <LeftPanel
            invitation={invitation}
            onUpdateField={handleUpdateField}
            onUpdateFields={handleUpdateFields}
            onAddElement={handleAddElement}
            onSelectElementId={(elId) => {
              setSelectedElementId(elId);
              if (typeof window !== "undefined" && window.innerWidth < 1024) {
                setMobileTab("canvas");
              }
            }}
          />
        </div>

        {/* Center Interactive Canvas / Palace Stage (Desktop always, Mobile when in canvas mode) */}
        <div className={`${mobileTab === "canvas" ? "flex flex-1" : "hidden lg:flex lg:flex-1"} overflow-hidden h-full flex-col`}>
          {isPalaceTemplate ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-stone-950">
              {/* Palace Mode Top Bar */}
              <div className="bg-stone-900 border-b border-stone-800 px-4 py-2 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-stone-200">
                    {palaceViewMode === "interactive" ? "Live Interactive Palace View" : "Palace Canvas Stage"}
                  </span>
                </div>
                <div className="flex items-center bg-stone-800 p-0.5 rounded-xl border border-stone-700">
                  <button
                    type="button"
                    onClick={() => setPalaceViewMode("interactive")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                      palaceViewMode === "interactive" ? "bg-amber-600 text-white shadow-xs" : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Interactive View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPalaceViewMode("canvas")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                      palaceViewMode === "canvas" ? "bg-amber-600 text-white shadow-xs" : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Raw Canvas</span>
                  </button>
                </div>
              </div>

              {/* Palace Body */}
              {palaceViewMode === "interactive" ? (
                <div className="flex-1 overflow-y-auto flex justify-center items-start p-0 sm:p-6 bg-stone-950">
                  <div className="w-full max-w-[430px] my-0 sm:my-3 shadow-2xl rounded-none sm:rounded-[36px] overflow-hidden border-0 sm:border-4 sm:border-stone-800">
                    <PalaceInvitationRenderer invitation={invitation} />
                  </div>
                </div>
              ) : (
                <CanvasStage
                  invitation={invitation}
                  selectedElementId={selectedElementId}
                  onSelectElementId={setSelectedElementId}
                  onUpdateElement={handleUpdateElement}
                  zoom={zoom}
                  onZoomChange={setZoom}
                  onOpenProperties={() => setMobileSheet("properties")}
                />
              )}
            </div>
          ) : (
            <CanvasStage
              invitation={invitation}
              selectedElementId={selectedElementId}
              onSelectElementId={setSelectedElementId}
              onUpdateElement={handleUpdateElement}
              zoom={zoom}
              onZoomChange={setZoom}
              onOpenProperties={() => setMobileSheet("properties")}
            />
          )}
        </div>

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
        onUpdateFields={handleUpdateFields}
        onAddElement={handleAddElement}
        onUpdateElement={handleUpdateElement}
        onDeleteElement={handleDeleteElement}
        onDuplicateElement={handleDuplicateElement}
        onSelectElementId={setSelectedElementId}
        onPreview={() => setPreviewOpen(true)}
        onSave={handleSave}
        onPublish={handlePublish}
        isPublished={invitation.isPublished}
        activeSheet={mobileSheet}
        onSetActiveSheet={setMobileSheet}
        mobileTab={mobileTab}
        onSelectMobileTab={setMobileTab}
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

      {/* Dynamic UPI Payment / Auth / Publish Checkout Modal */}
      <PublishCheckoutModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        invitation={invitation}
        onPublishedSuccess={handlePublishedSuccess}
      />
    </div>
  );
}
