import { ThemeToggle } from "@/components/ThemeToggle";

export default function FormAndInterviewHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200">
      <div className="flex items-center justify-between w-full px-4 md:px-6">
        {/* Project Name */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-foreground">Talee</span>
            <span className="text-primary">X</span>
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
