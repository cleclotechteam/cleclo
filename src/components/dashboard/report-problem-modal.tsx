"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  UserX,
  Package,
  MapPinOff,
  Clock,
  HelpCircle,
  Send,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportProblemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

const issueTypes = [
  {
    id: "no-show",
    label: "Customer No-Show",
    icon: UserX,
    description: "Customer not available at pickup/delivery",
  },
  {
    id: "damaged",
    label: "Item Damaged",
    icon: Package,
    description: "Item was damaged before/during processing",
  },
  {
    id: "wrong-address",
    label: "Wrong Address",
    icon: MapPinOff,
    description: "Unable to locate the given address",
  },
  {
    id: "delay",
    label: "Processing Delay",
    icon: Clock,
    description: "Cannot complete within expected time",
  },
  {
    id: "other",
    label: "Other Issue",
    icon: HelpCircle,
    description: "Describe your issue in detail",
  },
];

export function ReportProblemModal({
  open,
  onOpenChange,
  orderId,
}: ReportProblemModalProps) {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedIssue) return;
    // In real app, send to backend
    setIsSubmitted(true);
    setTimeout(() => {
      onOpenChange(false);
      setIsSubmitted(false);
      setSelectedIssue(null);
      setDescription("");
    }, 2000);
  };

  const handleClose = () => {
    onOpenChange(false);
    setIsSubmitted(false);
    setSelectedIssue(null);
    setDescription("");
  };

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[400px] p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-black">
              Issue Reported
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Your issue has been sent to Admin. They will review and respond
              shortly.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 p-5 border-b border-red-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-red-900">
              Report Problem
            </DialogTitle>
            <DialogDescription className="text-sm text-red-700">
              Order #{orderId}
            </DialogDescription>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">
              Select Issue Type
            </p>
            <div className="space-y-2">
              {issueTypes.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue.id)}
                  className={cn(
                    "w-full p-3 rounded-xl border transition-all flex items-center gap-3 text-left",
                    selectedIssue === issue.id
                      ? "border-[#3E8940] bg-[#3E8940]/5"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      selectedIssue === issue.id
                        ? "bg-[#3E8940]/10"
                        : "bg-slate-100"
                    )}
                  >
                    <issue.icon
                      className={cn(
                        "h-5 w-5",
                        selectedIssue === issue.id
                          ? "text-[#3E8940]"
                          : "text-slate-500"
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        "font-medium",
                        selectedIssue === issue.id
                          ? "text-[#3E8940]"
                          : "text-slate-900"
                      )}
                    >
                      {issue.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      {issue.description}
                    </p>
                  </div>
                  {selectedIssue === issue.id && (
                    <div className="h-5 w-5 rounded-full bg-[#3E8940] flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Additional Details (Optional)
            </p>
            <Textarea
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none h-24"
            />
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              <strong>Note:</strong> You cannot cancel orders unilaterally after
              acceptance. Use this form to report issues and Admin will assist.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 pt-2 border-t bg-slate-50 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2"
            disabled={!selectedIssue}
            onClick={handleSubmit}
          >
            <Send className="h-4 w-4" />
            Submit Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
