import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ProjectMembershipAlertProps {
  isFixing: boolean;
  onFix: () => void;
}

export const ProjectMembershipAlert = ({ isFixing, onFix }: ProjectMembershipAlertProps) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <AlertCircle className="w-5 h-5 text-amber-600" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-amber-800">
            Vous n&apos;apparaissez pas dans la liste des membres
          </h4>
          <p className="text-xs text-amber-700 mt-1">
            En tant que propriétaire de ce projet, vous devriez automatiquement apparaître dans la liste des membres.
          </p>
        </div>
        <Button
          onClick={onFix}
          disabled={isFixing}
          size="sm"
          variant="outline"
          className="border-amber-300 text-amber-700 hover:bg-amber-100"
        >
          {isFixing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            "Corriger"
          )}
        </Button>
      </div>
    </div>
  );
};
