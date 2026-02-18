/**
 * TechnicalServiceSelect Component
 * 
 * A WCAG AAA compliant component for selecting technical services,
 * grouped by their parent service.
 * Uses IBM Carbon Design System styling and follows Nielsen's usability heuristics.
 */

"use client";

import { useState, useEffect } from "react";
import { Service, TechnicalService } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

interface TechnicalServiceSelectProps {
  selectedServices: string[];
  onChange: (serviceIds: string[]) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function TechnicalServiceSelect({
  selectedServices = [],
  onChange,
  label = "Select Technical Services",
  required = false,
  disabled = false,
}: TechnicalServiceSelectProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [technicalServices, setTechnicalServices] = useState<TechnicalService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  
  // Group technical services by their parent service
  const groupedServices = technicalServices.reduce((acc, techService) => {
    if (techService.service_id) {
      const serviceId = techService.service_id;
      
      // Initialize the service group if it doesn't exist
      if (!acc[serviceId]) {
        const parentService = services.find(s => s.id === serviceId);
        if (parentService) {
          acc[serviceId] = {
            service: parentService,
            technicalServices: []
          };
        }
      }
      
      // Add this technical service to its parent group
      if (acc[serviceId]) {
        acc[serviceId].technicalServices.push(techService);
      }
    } else {
      // Handle technical services without a parent (shouldn't happen in practice)
      if (!acc["ungrouped"]) {
        acc["ungrouped"] = {
          service: { 
            id: "ungrouped", 
            label: "Other Services", 
            slug: "other", 
            created_at: "",
            service_area_id: null,
            description: null
          },
          technicalServices: []
        };
      }
      acc["ungrouped"].technicalServices.push(techService);
    }
    return acc;
  }, {} as Record<string, { service: Service, technicalServices: TechnicalService[] }>);
  
  // Fetch services and technical services from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch services first
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('label');
          
        if (servicesError) throw new Error(servicesError.message);
        
        // Then fetch technical services
        const { data: techServicesData, error: techServicesError } = await supabase
          .from('technical_services')
          .select('*')
          .order('label');
          
        if (techServicesError) throw new Error(techServicesError.message);
        
        setServices(servicesData || []);
        setTechnicalServices(techServicesData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services data');
        console.error('Error loading services:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [supabase]);
  
  // Handle checkbox changes
  const handleServiceChange = (serviceId: string, checked: boolean) => {
    let newSelectedServices = [...selectedServices];
    
    if (checked) {
      // Add service if not already selected
      if (!newSelectedServices.includes(serviceId)) {
        newSelectedServices.push(serviceId);
      }
    } else {
      // Remove service if selected
      newSelectedServices = newSelectedServices.filter(id => id !== serviceId);
    }
    
    onChange(newSelectedServices);
  };
  
  // Generate a unique ID for the fieldset
  const fieldsetId = `tech-service-select-${Math.random().toString(36).substring(2, 9)}`;
  
  if (isLoading) {
    return <div className="p-4 text-foreground-secondary">Loading services...</div>;
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
      
      <div className="space-y-6 mt-2">
        {/* Group technical services by parent service */}
        {Object.values(groupedServices).map(group => (
          <div key={group.service.id} className="space-y-2">
            {/* Service heading */}
            <h3 className="font-medium text-foreground">{group.service.label}</h3>
            
            {/* Technical services under this service */}
            <div className="ml-4 space-y-2">
              {group.technicalServices.map(techService => (
                <div key={techService.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tech-service-${techService.id}`}
                    name="technicalServices"
                    value={techService.id}
                    checked={selectedServices.includes(techService.id)}
                    onChange={(e) => handleServiceChange(techService.id, e.target.checked)}
                    className="h-5 w-5 text-interactive border-border-strong rounded focus:ring-2 focus:ring-interactive focus:ring-offset-2"
                  />
                  <label 
                    htmlFor={`tech-service-${techService.id}`}
                    className="ml-2 text-foreground"
                  >
                    {techService.label}
                    {techService.description && (
                      <span className="block text-sm text-foreground-secondary">
                        {techService.description}
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Show selected count for better user feedback */}
      <div className="mt-4 text-sm text-foreground-secondary">
        {selectedServices.length} technical service{selectedServices.length !== 1 ? 's' : ''} selected
      </div>
    </fieldset>
  );
}
