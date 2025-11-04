

import { useState } from "react";
type ThemeType = "white" | "dark" | "default";

interface SettingsPanelProps {
  
   onThemeChange: (theme: ThemeType) => void;
}

  const SettingsPanel: React.FC<SettingsPanelProps> = ({ onThemeChange }) => {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<"none" | "theme">("none");

  const handleThemeChange = (newTheme: ThemeType) => {
    
    onThemeChange(newTheme);
  };

  return (
    <div style={{ position: "fixed", bottom: 150, left: 25, zIndex: 1000 }}>
      {/* Settings Button */}
      <button
        onClick={() => { setOpen(!open); setSubmenu("none"); }}
        style={{
          width: "130px", height: "50px", borderRadius: "12px",
          border: "none", backgroundColor: "#4caf50", color: "#fff",
          cursor: "pointer", fontSize: "19px", fontWeight: 500,
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        ⚙ Settings
      </button>

      {/* Main Panel */}
      {open && submenu === "none" && (
        <div style={{ marginTop: 10, padding: 10, width: 180, backgroundColor: "#f0f0f0", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          <button style={{ display: "block", marginBottom: 8, width: "100%", cursor: "pointer" }} onClick={() => setSubmenu("theme")}>Theme</button>
          <button style={{ display: "block", marginBottom: 8, width: "100%", cursor: "pointer" }}>Profile</button>
          <button style={{ display: "block", width: "100%", cursor: "pointer" }}>More</button>
        </div>
      )}

      {/* Theme Submenu */}
      {submenu === "theme" && (
        <div style={{ marginTop: 10, padding: 10, width: 180, backgroundColor: "#f0f0f0", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          <h4 style={{ marginBottom: 10 }}>Select Theme</h4>
          <button style={{ display: "block", marginBottom: 8, width: "100%", cursor: "pointer" }} onClick={() => handleThemeChange("white")}>White</button>
          <button style={{ display: "block", marginBottom: 8, width: "100%", cursor: "pointer" }} onClick={() => handleThemeChange("dark")}>Dark</button>
          <button style={{ display: "block", width: "100%", cursor: "pointer" }} onClick={() => handleThemeChange("default")}>Default</button>
          <button style={{ marginTop: 10, width: "100%", cursor: "pointer" }} onClick={() => setSubmenu("none")}>← Back</button>
        </div>
      )}
    </div>
  );
};
export default SettingsPanel;