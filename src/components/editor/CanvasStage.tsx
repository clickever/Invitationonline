"use client";

import React, { useRef, useState } from "react";
import { CanvasElement, Invitation } from "@/lib/types";
import CountdownTimer from "../invitation/CountdownTimer";

interface CanvasStageProps {
  invitation: Invitation;
  selectedElementId: string | null;
  onSelectElementId: (id: string | null) => void;
  onUpdateElement: (updated: CanvasElement) => void;
  zoom: number;
}

export default function CanvasStage({
  invitation,
  selectedElementId,
  onSelectElementId,
  onUpdateElement,
  zoom,
}: CanvasStageProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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
    setDraggingId(element.id);
    setDragOffset({
      x: touchX - element.x,
      y: touchY - element.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggingId || !canvasRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const touchX = (touch.clientX - rect.left) / zoom;
    const touchY = (touch.clientY - rect.top) / zoom;
    const currentElement = (invitation.elements || []).find((el) => el.id === draggingId);
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
    setDraggingId(null);
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

  return (
    <div
      className="flex-1 bg-stone-100 flex items-center justify-center p-2 sm:p-8 overflow-auto h-[calc(100vh-4rem)] select-none touch-pan-y"
      onClick={() => onSelectElementId(null)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Visual Canvas Wrapper scaled by zoom */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
          transition: draggingId ? "none" : "transform 0.15s ease-out",
        }}
        className="relative shadow-2xl rounded-none sm:rounded-[32px] overflow-hidden"
      >
        {/* Fixed 1080 x 1920 Design Stage */}
        <div
          ref={canvasRef}
          style={{
            width: "1080px",
            height: "1920px",
            backgroundColor: invitation.background?.value || "#FDFBF7",
            backgroundImage: invitation.background?.imageUrl ? `url("${invitation.background.imageUrl}")` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="relative overflow-hidden"
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
  );
}
