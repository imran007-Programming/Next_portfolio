import { FullPageShell } from "@/components/FullPageShell";
import { SectionNavigationProvider } from "@/context/SectionNavigation";

export default function Home() {
  return (
    <SectionNavigationProvider>
      <FullPageShell />
    </SectionNavigationProvider>
  );
}
