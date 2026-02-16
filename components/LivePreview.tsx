"use client";

import { useResume } from "@/context/ResumeContext";
import { useTemplate } from "@/context/TemplateContext";
import { useColorTheme } from "@/context/ColorThemeContext";
import { ResumeLayout } from "@/components/ResumeLayout";
import { ATSScore } from "@/components/ATSScore";
import { TemplatePicker } from "@/components/TemplatePicker";
import { ColorPicker } from "@/components/ColorPicker";

export function LivePreview() {
  const { data } = useResume();
  const { template } = useTemplate();
  const { accentColor } = useColorTheme();

  return (
    <div className="live-preview-wrap">
      <ATSScore />
      <TemplatePicker />
      <ColorPicker />
      <h3 className="preview-label">Live Preview</h3>
      <div
        className="live-preview-paper"
        style={{ "--resume-accent": accentColor } as React.CSSProperties}
      >
        <ResumeLayout data={data} variant="live" template={template} />
      </div>
    </div>
  );
}
