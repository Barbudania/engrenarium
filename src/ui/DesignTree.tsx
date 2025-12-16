import React from "react";
import { strings, type Lang } from "./i18n";
import { useIsMobile } from "../lib/useIsMobile";

export type TreeStage = {
  stageId: number;
  label: string;
  items: { key: string; label: string }[];
};

type DesignTreeProps = {
  lang: Lang;
  treeData: TreeStage[];
  hiddenParts: Set<string>;
  rootCollapsed: boolean;
  collapsedStages: Set<number>;
  onToggleRoot: () => void;
  onToggleStageCollapsed: (stageId: number) => void;
  onToggleVisibility: (key: string) => void;
  stageKeyForId: (stageId: number) => string;
};

export function DesignTree({
  lang,
  treeData,
  hiddenParts,
  rootCollapsed,
  collapsedStages,
  onToggleRoot,
  onToggleStageCollapsed,
  onToggleVisibility,
  stageKeyForId,
}: DesignTreeProps) {
  const isMobile = useIsMobile();
  const S = strings[lang];

  const panelStyle: React.CSSProperties = {
    position: "absolute",
    top: isMobile ? 6 : 10,
    bottom: isMobile ? 6 : 10,
    left: isMobile ? 6 : 10,
    zIndex: 5,
    minWidth: isMobile ? 180 : 230,
    maxWidth: isMobile ? "75vw" : undefined,
    overflowY: "auto",
    padding: 10,
    borderRadius: 10,
    border: "1px solid transparent",
    background: "transparent",
    boxShadow: "none",
    color: "var(--text)",
    pointerEvents: "auto",
    direction: "rtl",
  };
  const innerStyle: React.CSSProperties = { direction: "ltr" };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "2px 0",
  };

  const arrowBtn: React.CSSProperties = {
    width: isMobile ? 20 : 22,
    height: isMobile ? 20 : 22,
    borderRadius: 6,
    border: "1px solid var(--btn-border)",
    background: "var(--btn-bg)",
    color: "var(--text)",
    cursor: "pointer",
    lineHeight: 1,
  };

  const eyeBtn: React.CSSProperties = {
    width: isMobile ? 24 : 26,
    height: isMobile ? 20 : 22,
    borderRadius: 6,
    border: "1px solid var(--btn-border)",
    background: "var(--btn-bg)",
    color: "var(--text)",
    cursor: "pointer",
    lineHeight: 1.1,
  };

  const labelStyle = (dim?: boolean): React.CSSProperties => ({
    fontSize: isMobile ? 11 : 12,
    opacity: dim ? 0.55 : 1,
    whiteSpace: "nowrap",
  });

  const ICON_VISIBLE = "👁";
  const ICON_HIDDEN = "–"; // olho oculto representado por travessão curto

  return (
    <div style={panelStyle}>
      <div style={innerStyle}>
      <div style={{ ...rowStyle, marginBottom: 4 }}>
        <button
          style={arrowBtn}
          onClick={onToggleRoot}
          aria-label={S.renderedTreeRoot}
          title={S.renderedTreeRoot}
        >
          {rootCollapsed ? "▸" : "▾"}
        </button>
        <span style={{ ...labelStyle(false), fontWeight: 600 }}>
          {S.renderedTreeRoot}
        </span>
      </div>

      {!rootCollapsed && (
        <div style={{ marginLeft: 6 }}>
          {treeData.map((stage) => {
            const isCollapsed = collapsedStages.has(stage.stageId);
            const stageKey = stageKeyForId(stage.stageId);
            const isHidden = hiddenParts.has(stageKey);
            return (
              <div key={stage.stageId} style={{ marginBottom: 4 }}>
                <div style={{ ...rowStyle }}>
                  <button
                    style={arrowBtn}
                    onClick={() => onToggleStageCollapsed(stage.stageId)}
                    aria-label={`${S.planetary} ${stage.stageId}`}
                    title={stage.label}
                  >
                    {isCollapsed ? "▸" : "▾"}
                  </button>
                  <button
                    style={eyeBtn}
                    onClick={() => onToggleVisibility(stageKey)}
                    aria-label={isHidden ? S.showInView : S.hideFromView}
                    title={isHidden ? S.showInView : S.hideFromView}
                  >
                    {isHidden ? ICON_HIDDEN : ICON_VISIBLE}
                  </button>
                  <span style={{ ...labelStyle(isHidden), fontWeight: 600 }}>
                    {stage.label}
                  </span>
                </div>

                {!isCollapsed && (
                  <div style={{ marginLeft: 24, borderLeft: "1px solid var(--border)" }}>
                    {stage.items.map((item, idx) => {
                      const hidden = isHidden || hiddenParts.has(item.key);
                      const isLast = idx === stage.items.length - 1;
                      return (
                        <div
                          key={item.key}
                          style={{
                            ...rowStyle,
                            paddingLeft: 10,
                          }}
                        >
                          <span style={{ color: "var(--muted)" }}>
                            {isLast ? "└" : "├"}
                          </span>
                          <button
                            style={eyeBtn}
                            onClick={() => onToggleVisibility(item.key)}
                            aria-label={hidden ? S.showInView : S.hideFromView}
                            title={hidden ? S.showInView : S.hideFromView}
                          >
                            {hidden ? ICON_HIDDEN : ICON_VISIBLE}
                          </button>
                          <span style={labelStyle(hidden)}>{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
    </div>
  );
}
