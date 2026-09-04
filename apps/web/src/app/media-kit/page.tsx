import { FileText } from 'lucide-react';
import { ComingSoon } from '@/components/ComingSoon';

export default function MediaKitPage() {
  return (
    <ComingSoon
      icon={FileText}
      title="Media Kit"
      description="Auto-generated, shareable one-pager pulling live stats, top content, and past partnerships — exportable as PDF or a public link."
    />
  );
}
