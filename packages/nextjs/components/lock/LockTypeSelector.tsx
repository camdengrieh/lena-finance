import React from "react";
import { cn } from "~~/lib/utils";

interface LockTypeSelectorProps {
  selectedType: "v2" | "v3";
  onSelectType: (type: "v2" | "v3") => void;
}

export function LockTypeSelector({ selectedType, onSelectType }: LockTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-medium">Select Lock Type</h2>
      <div className="flex gap-4 p-2 bg-base-200 rounded-lg">
        <button
          className={cn(
            "py-2 px-4 rounded-md transition-all",
            selectedType === "v2" ? "bg-primary text-primary-content" : "hover:bg-base-300",
          )}
          onClick={() => onSelectType("v2")}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold">UniswapV2</span>
            <span className="text-xs">Lock LP tokens from UniswapV2 pairs</span>
          </div>
        </button>

        <button
          className={cn(
            "py-2 px-4 rounded-md transition-all",
            selectedType === "v3" ? "bg-primary text-primary-content" : "hover:bg-base-300",
          )}
          onClick={() => onSelectType("v3")}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold">UniswapV3</span>
            <span className="text-xs">Lock NFT positions from UniswapV3 pools</span>
          </div>
        </button>
      </div>
    </div>
  );
}
