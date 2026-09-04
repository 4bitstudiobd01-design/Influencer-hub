import { Users } from 'lucide-react';
import { ComingSoon } from '@/components/ComingSoon';

export default function AudiencePage() {
  return (
    <ComingSoon
      icon={Users}
      title="Audience"
      description="Combined demographics, growth & churn, and a superfans list blended across all connected platforms."
    />
  );
}
