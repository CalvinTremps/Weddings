"use client";

import { Component, ReactNode } from "react";

export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ background: "#f8f4ee" }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              fontWeight: 300,
              color: "#8b5e52",
              marginBottom: "0.5rem",
            }}
          >
            Marshall &amp; Nandi
          </p>
          <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Something went wrong loading the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#c9977a",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.6rem 1.5rem",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
