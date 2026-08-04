import { useRouteError } from "react-router-dom";
import { Flex, Button } from "@/src/components/base";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function ErrorLayout() {
  const error = useRouteError();
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "An unexpected error occurred inside this view.";

  return (
    <Flex
      direction="column"
      items="center"
      justify="center"
      className="w-full h-full p-8 gap-4 text-center rounded-xl bg-dark-2/40 border border-error-1/30"
    >
      <div className="p-4 rounded-full bg-error-1/10 border border-error-1/30 text-error-1">
        <AlertTriangle size={32} />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-chalk-90">View Error</h2>
        <p className="text-sm text-chalk-50 max-w-md font-mono p-3 rounded-md bg-dark-3 border border-chalk-10">
          {errorMessage}
        </p>
      </div>
      <Button
        variant="primary"
        onClick={() => window.location.reload()}
        className="gap-2 mt-2"
      >
        <RefreshCw size={16} />
        Reload View
      </Button>
    </Flex>
  );
}
