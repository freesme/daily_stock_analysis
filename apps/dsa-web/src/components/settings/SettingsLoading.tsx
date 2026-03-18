import type React from 'react';

export const SettingsLoading: React.FC = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-xl border border-border/60 bg-elevated/45 p-4 shadow-soft-card">
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="mt-3 h-10 rounded-lg bg-white/6" />
        </div>
      ))}
    </div>
  );
};
