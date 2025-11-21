'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ChartExporter = dynamic(() => import('./ChartExporter'), {
  ssr: false,
  loading: () => (
    <div className="w-[1080px] h-[1080px] bg-[#0d1117] flex items-center justify-center">
      <p className="text-[#8b949e]">Loading chart...</p>
    </div>
  )
});

export default function ChartExportPage() {
  return (
    <Suspense fallback={<div className="w-[1080px] h-[1080px] bg-[#0d1117]" />}>
      <ChartExporter />
    </Suspense>
  );
}
