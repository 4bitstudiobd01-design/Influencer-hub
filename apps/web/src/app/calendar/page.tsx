import { CalendarDays } from 'lucide-react';
import { ComingSoon } from '@/components/ComingSoon';

export default function CalendarPage() {
  return (
    <ComingSoon
      icon={CalendarDays}
      title="Content Calendar"
      description="Month/week grid with drag-and-drop scheduling, an idea backlog, and cross-post indicators."
    />
  );
}
