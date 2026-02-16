"use client";

import { useResume } from "@/context/ResumeContext";
import { useTemplate } from "@/context/TemplateContext";
import { useColorTheme } from "@/context/ColorThemeContext";
import { ResumeLayout } from "@/components/ResumeLayout";
import { TemplatePicker } from "@/components/TemplatePicker";
import { ColorPicker } from "@/components/ColorPicker";
import { ExportButtons } from "@/components/ExportButtons";
import { ATSCircularScore } from "@/components/ATSCircularScore";

export default function PreviewPage() {
  const { data } = useResume();
  const { template } = useTemplate();
  const { accentColor } = useColorTheme();

  return (
    <main className="preview-main">
      <div className="preview-header no-print">
        <div className="preview-controls">
          <ATSCircularScore />
          <TemplatePicker />
          <ColorPicker />
        </div>
        <ExportButtons />
      </div>
      <div
        className="preview-resume-wrap"
        style={{ "--resume-accent": accentColor } as React.CSSProperties}
      >
        <ResumeLayout data={data} variant="preview" template={template} />
      </div>
    </main>
  );
}
