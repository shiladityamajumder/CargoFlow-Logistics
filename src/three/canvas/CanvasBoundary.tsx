"use client";

import { Component, type ReactNode } from "react";

export class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("CARGOFLOW WebGL scene failed. Static journey fallback remains visible.", error);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
