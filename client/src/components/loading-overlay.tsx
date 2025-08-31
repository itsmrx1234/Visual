import { Card } from "@/components/ui/card";

export default function LoadingOverlay() {
  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      data-testid="overlay-loading"
    >
      <Card className="p-8 text-center space-y-4 max-w-sm w-full mx-4">
        <div className="w-12 h-12 mx-auto">
          <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
        <h4 className="font-semibold" data-testid="text-loading-title">Analyzing Image</h4>
        <p className="text-muted-foreground text-sm" data-testid="text-loading-description">
          Our AI is finding visually similar products...
        </p>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full animate-pulse-soft" 
            style={{ width: '75%' }}
            data-testid="progress-loading"
          ></div>
        </div>
      </Card>
    </div>
  );
}
