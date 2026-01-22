import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "./main-section";
import { PersonalSection } from "./personal-section";
import { Separator } from "@/components/ui/separator";

export const HomeSidebar = () => {
  return (
    <Sidebar className="pt-16 border-none z-40" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        <Separator />
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  );
};
