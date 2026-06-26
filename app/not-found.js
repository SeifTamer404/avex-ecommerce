import Button from "@/components/ui/Button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-8">
        <FileQuestion className="w-12 h-12 text-[var(--color-primary)]" strokeWidth={1.5} />
      </div>
      
      <h2 className="text-3xl font-extrabold font-display text-[var(--color-inverted-bg)] mb-3 tracking-tight">
        Page Not Found
      </h2>
      
      <p className="text-[var(--color-inverted-bg)]/60 text-base max-w-md mb-10 leading-relaxed">
        The page you are looking for doesn't exist or has been moved. 
      </p>
      
      <Button href="/" type="primary" size="md">
        Return to Homepage
      </Button>
    </div>
  );
}
