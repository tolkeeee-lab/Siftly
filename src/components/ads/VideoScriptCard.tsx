'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, Clock, Eye, Volume2, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { VideoScript } from '../../types/adsStudio';

interface VideoScriptCardProps {
  script: VideoScript;
}

export const VideoScriptCard: React.FC<VideoScriptCardProps> = ({ script }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopyScript = () => {
    let fullText = `🎬 ${script.title.toUpperCase()}\n`;
    fullText += `🪝 HOOK : ${script.hookHeadline}\n`;
    fullText += `----------------------------------------\n`;
    script.scenes.forEach((sc, i) => {
      fullText += `\n[Scène ${i + 1}] ${sc.timing}\n`;
      fullText += `👁️ Visuel : ${sc.visual}\n`;
      fullText += `🎙️ Voix / Audio : ${sc.audio}\n`;
      if (sc.tip) fullText += `💡 Conseil : ${sc.tip}\n`;
    });
    fullText += `\n🎯 Call To Action : ${script.callToAction}\n`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="script-card">
      {/* Header */}
      <div className="script-card-header">
        <div className="script-title-wrap">
          <span className="script-badge">{script.badge}</span>
          <h3 className="script-title">{script.title}</h3>
        </div>

        <div className="script-header-actions">
          <button type="button" className="btn-copy-script" onClick={handleCopyScript}>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier Script'}</span>
          </button>
          <button
            type="button"
            className="btn-toggle-expand"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Hook Banner */}
      <div className="script-hook-banner">
        <span className="hook-tag">🪝 Hook (Les 3 premières secondes) :</span>
        <p className="hook-text">{script.hookHeadline}</p>
      </div>

      {/* Scenes Timeline */}
      {isExpanded && (
        <div className="script-scenes-timeline">
          {script.scenes.map((scene, idx) => (
            <div key={scene.id} className="scene-row">
              <div className="scene-timing-badge">
                <Clock className="w-3 h-3 inline mr-1" />
                {scene.timing}
              </div>

              <div className="scene-content-box">
                <div className="scene-visual-line">
                  <div className="scene-lbl"><Eye className="w-3 h-3 text-sky-400" /> Ce qu'on voit (Visuel) :</div>
                  <p className="scene-text">{scene.visual}</p>
                </div>

                <div className="scene-audio-line">
                  <div className="scene-lbl"><Volume2 className="w-3 h-3 text-gold-deep" /> Ce qu'on entend (Voix off / Texte) :</div>
                  <p className="scene-text highlight">{scene.audio}</p>
                </div>

                {scene.tip && (
                  <div className="scene-tip-line">
                    <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{scene.tip}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Call to Action */}
          <div className="script-cta-banner">
            <span className="cta-lbl">🎯 Appel à l'action final (CTA) :</span>
            <span className="cta-text">{script.callToAction}</span>
          </div>
        </div>
      )}
    </div>
  );
};
