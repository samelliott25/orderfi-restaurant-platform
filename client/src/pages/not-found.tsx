import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: '#ffe6b0' }}>
      <Card className="w-full max-w-md mx-4" style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8" style={{ color: '#8b795e' }} />
            <h1 className="text-2xl font-bold" style={{ color: '#654321' }}>404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm" style={{ color: '#8b795e' }}>
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
