"use client";

import React, { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  durationMs?: number;
  variant?: "fade-up" | "fade" | "scale-up";
  as?: React.ElementType;
}

export function Reveal({
  children,
  className = "",
  delayMs = 0,
  durationMs = 600,
  variant = "fade-up",
  as: Component = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If the browser does not support IntersectionObserver or user prefers reduced motion
    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (ref.current) {
              observer.unobserve(ref.current);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentEl = ref.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, []);

  const getTransformStyle = () => {
    if (isVisible) {
      return {
        opacity: 1,
        transform: "none",
      };
    }

    switch (variant) {
      case "fade":
        return {
          opacity: 0,
          transform: "none",
        };
      case "scale-up":
        return {
          opacity: 0,
          transform: "scale(0.96)",
        };
      case "fade-up":
      default:
        return {
          opacity: 0,
          transform: "translate3d(0, 20px, 0)",
        };
    }
  };

  const Tag = Component;

  return (
    <Tag
      ref={ref}
      style={{
        ...getTransformStyle(),
        transition: `opacity ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}
