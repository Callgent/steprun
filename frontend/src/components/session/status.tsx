import { useState } from "react";
import { CheckCircle, XCircle, Clock, Trash } from "lucide-react";
import { SessionStatus } from "@/lib/types/session";

interface SessionStatusIndicatorProps {
    status: SessionStatus;
}

export function SessionStatusIndicator({ status }: SessionStatusIndicatorProps) {
    const getStatusIcon = (status: SessionStatus) => {
        switch (status) {
            case SessionStatus.STARTED:
                return (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                );
            case SessionStatus.STOPPED:
                return (
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                );
            case SessionStatus.HIBERNATED:
                return (
                    <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                );
            case SessionStatus.DESTROYED:
                return (
                    <Trash className="w-4 h-4 text-gray-500 mr-2" />
                );
            default:
                return null;
        }
    };

    const getStatusText = (status: SessionStatus) => {
        switch (status) {
            case SessionStatus.STARTED:
                return "Started";
            case SessionStatus.STOPPED:
                return "Stopped";
            case SessionStatus.HIBERNATED:
                return "Hibernated";
            case SessionStatus.DESTROYED:
                return "Destroyed";
            default:
                return "Unknown";
        }
    };

    return (
        <div className="flex items-center">
            {getStatusIcon(status)}
            <span className="text-sm font-medium">{getStatusText(status)}</span>
        </div>
    );
}