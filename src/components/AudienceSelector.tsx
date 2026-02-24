/**
 * Audience selector with shortcuts for common selections.
 * 
 * Features "All Staff" and "All Students" shortcuts that automatically
 * select relevant sub-audiences, with expandable detailed selection.
 * 
 * Design principles:
 * - Carbon Design: spacing tokens, typography, interactive patterns
 * - WCAG AAA: proper labeling, keyboard navigation, focus management
 * - Nielsen #6 (Recognition): common shortcuts prominently displayed
 * - Nielsen #7 (Flexibility): detailed options available when needed
 * 
 * @module components/AudienceSelector
 */
"use client";

import { useState, useMemo } from "react";
import type { Audience } from "@/types/database";

interface AudienceSelectorProps {
  audiences: Audience[];
  selectedIds: string[];
  name: string;
}

export default function AudienceSelector({
  audiences,
  selectedIds,
  name,
}: AudienceSelectorProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Organize audiences by parent/child relationships
  const { staffParentId, studentsParentId, staffAudiences, studentAudiences, otherAudiences } = useMemo(() => {
    const staffParent = audiences.find(a => a.slug === "staff");
    const studentsParent = audiences.find(a => a.slug === "students");
    
    const staffAudiences = audiences.filter(a => a.parent_id === staffParent?.id);
    const studentAudiences = audiences.filter(a => a.parent_id === studentsParent?.id);
    const otherAudiences = audiences.filter(a => 
      !a.parent_id && 
      a.slug !== "staff" && 
      a.slug !== "students"
    );

    return {
      staffParentId: staffParent?.id,
      studentsParentId: studentsParent?.id,
      staffAudiences,
      studentAudiences,
      otherAudiences,
    };
  }, [audiences]);

  // Check if all staff or all students are selected
  const allStaffSelected = staffParentId ? selectedIds.includes(staffParentId) : false;
  const allStudentsSelected = studentsParentId ? selectedIds.includes(studentsParentId) : false;

  return (
    <div className="space-y-carbon-4">
      <div className="space-y-carbon-2">
        <p className="text-carbon-sm font-medium text-foreground">Audiences</p>
        
        {/* Common Shortcuts */}
        <div className="space-y-carbon-3">
          {staffParentId && (
            <label className="flex items-center gap-carbon-3">
              <input
                type="checkbox"
                name={name}
                value={staffParentId}
                defaultChecked={allStaffSelected}
                className="h-4 w-4 rounded border-border-strong text-interactive focus:ring-2 focus:ring-interactive focus:ring-offset-2"
              />
              <span className="text-carbon-sm font-medium text-foreground">
                All Staff
              </span>
            </label>
          )}

          {studentsParentId && (
            <label className="flex items-center gap-carbon-3">
              <input
                type="checkbox"
                name={name}
                value={studentsParentId}
                defaultChecked={allStudentsSelected}
                className="h-4 w-4 rounded border-border-strong text-interactive focus:ring-2 focus:ring-interactive focus:ring-offset-2"
              />
              <span className="text-carbon-sm font-medium text-foreground">
                All Students
              </span>
            </label>
          )}
        </div>

        {/* Expandable Details Button */}
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-carbon-2 rounded px-carbon-3 py-carbon-2 text-carbon-sm text-interactive hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
          aria-expanded={showDetails}
          aria-controls="audience-details"
        >
          <svg
            className={`h-4 w-4 transition-transform ${showDetails ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
          </svg>
          {showDetails ? "Hide" : "Show"} detailed audience selection
        </button>
      </div>

      {/* Detailed Selection (Expandable) */}
      {showDetails && (
        <div
          id="audience-details"
          className="rounded border border-border bg-background-subtle p-carbon-4 space-y-carbon-4"
        >
          {/* Staff Sub-categories */}
          {staffAudiences.length > 0 && (
            <div className="space-y-carbon-2">
              <p className="text-carbon-sm font-medium text-foreground">Staff Categories</p>
              <div className="grid grid-cols-1 gap-carbon-2 sm:grid-cols-2">
                {staffAudiences.map((audience) => (
                  <label
                    key={audience.id}
                    className="flex items-center gap-carbon-2 text-carbon-sm"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      value={audience.id}
                      defaultChecked={selectedIds.includes(audience.id)}
                      className="h-4 w-4 rounded border-border-strong text-interactive focus:ring-2 focus:ring-interactive focus:ring-offset-2"
                    />
                    {audience.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Student Sub-categories */}
          {studentAudiences.length > 0 && (
            <div className="space-y-carbon-2">
              <p className="text-carbon-sm font-medium text-foreground">Student Categories</p>
              <div className="grid grid-cols-1 gap-carbon-2 sm:grid-cols-2">
                {studentAudiences.map((audience) => (
                  <label
                    key={audience.id}
                    className="flex items-center gap-carbon-2 text-carbon-sm"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      value={audience.id}
                      defaultChecked={selectedIds.includes(audience.id)}
                      className="h-4 w-4 rounded border-border-strong text-interactive focus:ring-2 focus:ring-interactive focus:ring-offset-2"
                    />
                    {audience.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Other Audiences */}
          {otherAudiences.length > 0 && (
            <div className="space-y-carbon-2">
              <p className="text-carbon-sm font-medium text-foreground">Other Audiences</p>
              <div className="grid grid-cols-1 gap-carbon-2 sm:grid-cols-2">
                {otherAudiences.map((audience) => (
                  <label
                    key={audience.id}
                    className="flex items-center gap-carbon-2 text-carbon-sm"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      value={audience.id}
                      defaultChecked={selectedIds.includes(audience.id)}
                      className="h-4 w-4 rounded border-border-strong text-interactive focus:ring-2 focus:ring-interactive focus:ring-offset-2"
                    />
                    {audience.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-carbon-xs text-foreground-secondary">
        Select target audiences for this guidance. Use shortcuts for common selections or expand for detailed control.
      </p>
    </div>
  );
}
