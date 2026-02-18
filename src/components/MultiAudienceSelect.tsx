/**
 * MultiAudienceSelect Component
 * 
 * A WCAG AAA compliant component for selecting multiple audiences from a list.
 * Uses IBM Carbon Design System styling and follows Nielsen's usability heuristics.
 */

"use client";

import { useState, useEffect } from "react";
import { Audience } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

interface MultiAudienceSelectProps {
  selectedAudiences: string[];
  onChange: (audienceIds: string[]) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function MultiAudienceSelect({
  selectedAudiences = [],
  onChange,
  label = "Select Audiences",
  required = false,
  disabled = false,
}: MultiAudienceSelectProps) {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  
  // Group audiences by parent for hierarchical display
  const groupedAudiences = audiences.reduce((acc, audience) => {
    if (!audience.parent_id) {
      // Top-level audience
      if (!acc[audience.id]) {
        acc[audience.id] = {
          ...audience,
          children: []
        };
      }
    } else if (audience.parent_id) { // Ensure parent_id is defined
      // Child audience
      const parentId = audience.parent_id;
      
      if (!acc[parentId]) {
        // Create parent entry if it doesn't exist yet
        const parent = audiences.find(a => a.id === parentId);
        if (parent) {
          acc[parentId] = {
            ...parent,
            children: []
          };
        }
      }
      
      // Add this audience as a child to its parent
      if (acc[parentId]) {
        acc[parentId].children.push(audience);
      }
    }
    return acc;
  }, {} as Record<string, Audience & { children: Audience[] }>);
  
  // Fetch audiences from Supabase
  useEffect(() => {
    const fetchAudiences = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('audiences')
          .select('*')
          .order('label');
          
        if (error) throw new Error(error.message);
        
        setAudiences(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load audiences');
        console.error('Error loading audiences:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAudiences();
  }, [supabase]);
  
  // Handle checkbox changes
  const handleAudienceChange = (audienceId: string, checked: boolean) => {
    let newSelectedAudiences = [...selectedAudiences];
    
    if (checked) {
      // Add audience if not already selected
      if (!newSelectedAudiences.includes(audienceId)) {
        newSelectedAudiences.push(audienceId);
      }
    } else {
      // Remove audience if selected
      newSelectedAudiences = newSelectedAudiences.filter(id => id !== audienceId);
    }
    
    onChange(newSelectedAudiences);
  };
  
  // Generate a unique ID for the fieldset
  const fieldsetId = `audience-select-${Math.random().toString(36).substring(2, 9)}`;
  
  if (isLoading) {
    return <div className="p-4 text-foreground-secondary">Loading audiences...</div>;
  }
  
  if (error) {
    return (
      <div className="p-4 text-status-error" role="alert">
        Error: {error}
      </div>
    );
  }
  
  return (
    <fieldset 
      id={fieldsetId}
      className="border border-border rounded-md p-4"
      disabled={disabled}
      aria-busy={isLoading}
    >
      <legend className="text-lg font-semibold px-2">
        {label}
        {required && <span className="text-status-error ml-1" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </legend>
      
      <div className="space-y-4 mt-2">
        {/* Top-level audiences with their children */}
        {Object.values(groupedAudiences)
          .filter(audience => !audience.parent_id)
          .map(audience => (
            <div key={audience.id} className="space-y-2">
              {/* Parent audience checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`audience-${audience.id}`}
                  name="audiences"
                  value={audience.id}
                  checked={selectedAudiences.includes(audience.id)}
                  onChange={(e) => handleAudienceChange(audience.id, e.target.checked)}
                  className="h-5 w-5 text-interactive border-border-strong rounded focus:ring-2 focus:ring-interactive focus:ring-offset-2"
                />
                <label 
                  htmlFor={`audience-${audience.id}`}
                  className="ml-2 text-foreground font-medium"
                >
                  {audience.label}
                </label>
              </div>
              
              {/* Child audiences indented */}
              {audience.children && audience.children.length > 0 && (
                <div className="ml-6 space-y-2">
                  {audience.children.map(child => (
                    <div key={child.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`audience-${child.id}`}
                        name="audiences"
                        value={child.id}
                        checked={selectedAudiences.includes(child.id)}
                        onChange={(e) => handleAudienceChange(child.id, e.target.checked)}
                        className="h-5 w-5 text-interactive border-border-strong rounded focus:ring-2 focus:ring-interactive focus:ring-offset-2"
                      />
                      <label 
                        htmlFor={`audience-${child.id}`}
                        className="ml-2 text-foreground"
                      >
                        {child.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
      
      {/* Show selected count for better user feedback */}
      <div className="mt-4 text-sm text-foreground-secondary">
        {selectedAudiences.length} audience{selectedAudiences.length !== 1 ? 's' : ''} selected
      </div>
    </fieldset>
  );
}
