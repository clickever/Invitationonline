"use client";

import React, { useRef, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { CanvasElement, Invitation } from "@/lib/types";
import CountdownTimer from "../invitation/CountdownTimer";

interface CanvasStageProps {
  invitation: Invitation;
  selectedElementId: string | null;
  onSelectElementId: (id: string | null) => void;
  onUpdateElement: (updated: CanvasElement) => void;
  zoom: number;
  onZoomChange?: (newZoom: number) => void;
  onOpenProperties?: () => void;
}

export default function CanvasStage({
  invitation,
  selectedElementId,
  onSelectElementId,
  onUpdateElement,
  zoom,
  onZoomChange,
  onOpenProperties,
}: CanvasStageProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [touchStartInfo, setTouchStartInfo] = useState<{
    id: string;
    clientX: number;
    clientY: number;
    hasMoved: boolean;
  } | null>(null);

  const themeColor = invitation.settings?.themeColor || "#D4AF37";

  const handleMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    onSelectElementId(element.id);

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;

    setDraggingId(element.id);
    setDragOffset({
      x: mouseX - element.x,
      y: mouseY - element.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;

    const currentElement = (invitation.elements || []).find((el) => el.id === draggingId);
    if (!currentElement) return;

    // Constrain to canvas boundaries
    const newX = Math.max(0, Math.min(1080 - currentElement.width, Math.round(mouseX - dragOffset.x)));
    const newY = Math.max(0, Math.min(1920 - currentElement.height, Math.round(mouseY - dragOffset.y)));

    onUpdateElement({
      ...currentElement,
      x: newX,
      y: newY,
    });
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const handleTouchStart = (e: React.TouchEvent, element: CanvasElement) => {
    e.stopPropagation();
    onSelectElementId(element.id);
    if (!canvasRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const touchX = (touch.clientX - rect.left) / zoom;
    const touchY = (touch.clientY - rect.top) / zoom;

    setTouchStartInfo({
      id: element.id,
      clientX: touch.clientX,
      clientY: touch.clientY,
      hasMoved: false,
    });
    setDragOffset({
      x: touchX - element.x,
      y: touchY - element.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartInfo || !canvasRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const dist = Math.hypot(touch.clientX - touchStartInfo.clientX, touch.clientY - touchStartInfo.clientY);

    // If movement is under 10px, treat as intentional tap rather than drag to prevent accidental displacement
    if (dist < 10 && !touchStartInfo.hasMoved) return;

    if (!touchStartInfo.hasMoved) {
      setTouchStartInfo((prev) => (prev ? { ...prev, hasMoved: true } : null));
      setDraggingId(touchStartInfo.id);
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const touchX = (touch.clientX - rect.left) / zoom;
    const touchY = (touch.clientY - rect.top) / zoom;
    const currentElement = (invitation.elements || []).find((el) => el.id === touchStartInfo.id);
    if (!currentElement) return;

    const newX = Math.max(0, Math.min(1080 - currentElement.width, Math.round(touchX - dragOffset.x)));
    const newY = Math.max(0, Math.min(1920 - currentElement.height, Math.round(touchY - dragOffset.y)));

    onUpdateElement({
      ...currentElement,
      x: newX,
      y: newY,
    });
  };

  const handleTouchEnd = () => {
    if (touchStartInfo && !touchStartInfo.hasMoved) {
      // Clean tap! Open quick edit drawer on mobile
      onOpenProperties?.();
    }
    setDraggingId(null);
    setTouchStartInfo(null);
  };

  const renderElement = (el: CanvasElement) => {
    const isSelected = selectedElementId === el.id;

    // Relative styling within 1080x1920 canvas
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${el.x}px`,
      top: `${el.y}px`,
      width: `${el.width}px`,
      height: `${el.height}px`,
      zIndex: el.zIndex || 2,
      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
      cursor: "move",
      userSelect: "none",
    };

    let content = null;

    if (el.type === "text") {
      content = (
        <div
          style={{
            fontFamily: el.fontFamily || "Inter",
            fontSize: `${el.fontSize || 24}px`,
            fontWeight: el.fontWeight || "400",
            fontStyle: el.fontStyle || "normal",
            color: el.color || "#2D261E",
            textAlign: el.textAlign || "center",
            letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
            lineHeight: el.lineHeight || 1.3,
            textTransform: el.textTransform || "none",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent:
              el.textAlign === "left"
                ? "flex-start"
                : el.textAlign === "right"
                ? "flex-end"
                : "center",
          }}
        >
          {el.text}
        </div>
      );
    } else if (el.type === "shape") {
      if (el.shapeType === "line") {
        content = (
          <div
            style={{
              width: "100%",
              height: `${el.strokeWidth || 2}px`,
              backgroundColor: el.strokeColor || themeColor,
            }}
          />
        );
      } else if (el.shapeType === "arch") {
        content = (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderTopLeftRadius: "500px",
              borderTopRightRadius: "500px",
              border: `${el.strokeWidth || 2}px solid ${el.strokeColor || themeColor}`,
              backgroundColor: el.fillColor || "transparent",
            }}
          />
        );
      } else {
        content = (
          <div
            style={{
              width: "100%",
              height: "100%",
              border: `${el.strokeWidth || 2}px solid ${el.strokeColor || themeColor}`,
              backgroundColor: el.fillColor || "transparent",
              borderRadius: "16px",
            }}
          />
        );
      }
    } else if (el.type === "divider") {
      content = (
        <div className="flex items-center justify-center w-full h-full gap-4">
          <div className="h-[2px] flex-1" style={{ backgroundColor: el.strokeColor || themeColor }} />
          <span className="text-xl" style={{ color: el.strokeColor || themeColor }}>✦</span>
          <div className="h-[2px] flex-1" style={{ backgroundColor: el.strokeColor || themeColor }} />
        </div>
      );
    } else if (el.type === "countdown") {
      content = (
        <div className="w-full pointer-events-none transform scale-[1.3] origin-center">
          <CountdownTimer targetDate={invitation.eventDate} themeColor={themeColor} />
        </div>
      );
    } else if (el.type === "button") {
      content = (
        <button
          type="button"
          className="w-full h-full rounded-full font-bold shadow-md flex items-center justify-center pointer-events-none"
          style={{
            backgroundColor: el.buttonBg || themeColor,
            color: el.buttonColor || "#FFFFFF",
            fontSize: "22px",
            border: el.strokeColor ? `2px solid ${el.strokeColor}` : undefined,
          }}
        >
          {el.buttonText || "ACTION BUTTON"}
        </button>
      );
    } else if (el.type === "image") {
      content = (
        <img
          src={el.src || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"}
          alt="Canvas graphic"
          className="w-full h-full object-cover pointer-events-none"
          style={{
            borderRadius: el.borderRadius !== undefined ? `${el.borderRadius}px` : "16px",
            opacity: el.opacity ?? 1,
          }}
        />
      );
    }

    return (
      <div
        key={el.id}
        style={style}
        onMouseDown={(e) => handleMouseDown(e, el)}
        onTouchStart={(e) => handleTouchStart(e, el)}
        className={`group transition-shadow touch-none ${
          isSelected
            ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-transparent shadow-lg"
            : "hover:ring-1 hover:ring-amber-400/50"
        }`}
      >
        {content}

        {/* Selection Handles */}
        {isSelected && (
          <>
            <div className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-amber-500 border border-white shadow" />
            <div className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full bg-amber-500 border border-white shadow" />
            <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full bg-amber-500 border border-white shadow" />
            <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-amber-500 border border-white shadow" />
          </>
        )}
      </div>
    );
  };

  const scaledWidth = Math.round(1080 * zoom);
  const scaledHeight = Math.round(1920 * zoom);

  return (
    <div
      className="flex-1 bg-stone-100/90 relative overflow-auto h-full sm:h-[calc(100vh-4rem)] select-none touch-pan-x touch-pan-y"
      onClick={() => onSelectElementId(null)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Centering Wrapper */}
      <div className="min-w-full min-h-full flex items-center justify-center p-2 sm:p-8">
        {/* Physical Layout Sizing Box (Tells flexbox EXACTLY how wide/high the scaled card is) */}
        <div
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            flexShrink: 0,
            position: "relative",
          }}
          className="shadow-2xl rounded-2xl sm:rounded-[32px] overflow-hidden bg-white mx-auto my-auto"
        >
          {/* Virtual 1080 x 1920 Design Stage Scaled Down */}
          <div
            ref={canvasRef}
            style={{
              width: "1080px",
              height: "1920px",
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: invitation.background?.value || "#FDFBF7",
              backgroundImage: invitation.background?.imageUrl ? `url("${invitation.background.imageUrl}")` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="overflow-hidden"
          >
            {/* Background image opacity overlay layer if image is set */}
            {invitation.background?.imageUrl && (
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  backgroundColor: invitation.background?.imageOverlay || "#FFFFFF",
                  opacity: 1 - (invitation.background?.imageOpacity ?? 0.35),
                }}
              />
            )}

            {/* Elements */}
            {(invitation.elements || []).map(renderElement)}
          </div>
        </div>
      </div>

      {/* Floating Zoom Controls for Mobile & Desktop */}
      {onZoomChange && (
        <div className="absolute bottom-20 sm:bottom-6 right-3 sm:right-6 z-20 flex items-center gap-1 bg-stone-900/90 backdrop-blur-md text-white px-2 py-1.5 rounded-2xl shadow-2xl border border-stone-700/80">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onZoomChange(Math.max(0.2, Number((zoom - 0.05).toFixed(2))));
            }}
            className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof window !== "undefined") {
                const fit = window.innerWidth < 640 
                  ? Number(((window.innerWidth - 24) / 1080).toFixed(2)) 
                  : 0.44;
                onZoomChange(Math.max(0.25, Math.min(fit, 0.45)));
              }
            }}
            className="px-2 py-1 text-[11px] font-mono font-bold text-amber-400 hover:bg-stone-800 rounded-lg transition"
            title="Fit to Screen"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onZoomChange(Math.min(1.2, Number((zoom + 0.05).toFixed(2))));
            }}
            className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Quick Focus / Detailed Mode toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (zoom < 0.5) {
                onZoomChange(0.70);
              } else {
                if (typeof window !== "undefined") {
                  const fit = window.innerWidth < 640 
                    ? Number(((window.innerWidth - 24) / 1080).toFixed(2)) 
                    : 0.44;
                  onZoomChange(Math.max(0.25, Math.min(fit, 0.45)));
                }
              }
            }}
            className="ml-1 px-2.5 py-1 text-[10px] font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-sm transition whitespace-nowrap"
          >
            {zoom >= 0.5 ? "Fit Screen" : "🔍 70% Zoom"}
          </button>
        </div>
      )}
    </div>
  );
}
