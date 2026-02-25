/**
 * Task and Topic selector with smart defaults.
 * 
 * When tasks are selected, their default topics are automatically included.
 * Topics remain expandable for additional manual selection.
 * 
 * Design principles:
 * - Carbon Design: spacing tokens, typography, interactive patterns
 * - WCAG AAA: proper labeling, keyboard navigation, focus management
 * - Nielsen #5 (Error prevention): sensible defaults reduce data entry
 * - Nielsen #6 (Recognition): default topics automatically suggested
 * 
 * @module components/TaskTopicSelector
 */
"use client";

import { useState, useMemo, useEffect } from "react";
import SearchableCheckboxGroup from "@/components/SearchableCheckboxGroup";
import type { Task, Topic, TaskDefaultTopic } from "@/types/database";

interface TaskTopicSelectorProps {
  tasks: Task[];
  topics: Topic[];
  taskDefaults?: TaskDefaultTopic[]; // Default topics for each task
  selectedTaskIds: string[];
  selectedTopicIds: string[];
  taskName: string;
  topicName: string;
}

export default function TaskTopicSelector({
  tasks,
  topics,
  taskDefaults = [],
  selectedTaskIds,
  selectedTopicIds,
  taskName,
  topicName,
}: TaskTopicSelectorProps) {
  const [showTopicDetails, setShowTopicDetails] = useState(false);
  const [currentTaskIds, setCurrentTaskIds] = useState<string[]>(selectedTaskIds);

  // Calculate default topics based on selected tasks
  const defaultTopicIds = useMemo(() => {
    const defaults = new Set<string>();
    currentTaskIds.forEach(taskId => {
      taskDefaults
        .filter(td => td.task_id === taskId)
        .forEach(td => defaults.add(td.topic_id));
    });
    return Array.from(defaults);
  }, [currentTaskIds, taskDefaults]);


  // Update current task selection when tasks change externally
  useEffect(() => {
    setCurrentTaskIds(selectedTaskIds);
  }, [selectedTaskIds]);

  const defaultTopics = useMemo(() => {
    return topics.filter(topic => defaultTopicIds.includes(topic.id));
  }, [topics, defaultTopicIds]);

  return (
    <div className="space-y-carbon-5">
      {/* Tasks Selection */}
      <SearchableCheckboxGroup
        name={taskName}
        label="Tasks"
        items={tasks}
        selectedIds={selectedTaskIds}
        placeholder="Search tasks..."
        vocabTable="tasks"
      />

      {/* Topics - Auto-selected + Manual */}
      <div className="space-y-carbon-4">
        <div className="space-y-carbon-2">
          <p className="text-carbon-sm font-medium text-foreground">Topics</p>
          
          {/* Show default topics if any tasks are selected */}
          {defaultTopics.length > 0 && (
            <div className="rounded bg-background-subtle p-carbon-3">
              <p className="text-carbon-xs font-medium text-foreground-secondary mb-carbon-2">
                Default topics (automatically included):
              </p>
              <div className="flex flex-wrap gap-carbon-2">
                {defaultTopics.map(topic => (
                  <span
                    key={topic.id}
                    className="inline-block rounded bg-carbon-blue-20/20 px-carbon-2 py-carbon-1 text-carbon-xs text-carbon-blue-60 border border-carbon-blue-30"
                  >
                    {topic.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hidden inputs for default topics */}
          {defaultTopicIds.map(topicId => (
            <input
              key={topicId}
              type="hidden"
              name={topicName}
              value={topicId}
            />
          ))}

          {/* Expandable Additional Topics */}
          <button
            type="button"
            onClick={() => setShowTopicDetails(!showTopicDetails)}
            className="flex items-center gap-carbon-2 rounded px-carbon-3 py-carbon-2 text-carbon-sm text-interactive hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-interactive focus:ring-offset-2"
            aria-expanded={showTopicDetails}
            aria-controls="topic-details"
          >
            <svg
              className={`h-4 w-4 transition-transform ${showTopicDetails ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
            </svg>
            {showTopicDetails ? "Hide" : "Show"} topics
          </button>
        </div>

        {/* Detailed Topic Selection (Expandable) */}
        {showTopicDetails && (
          <div
            id="topic-details"
            className="rounded border border-border bg-background-subtle p-carbon-4"
          >
            <SearchableCheckboxGroup
              name={topicName}
              label="Additional Topics"
              items={topics}
              selectedIds={selectedTopicIds.filter(id => !defaultTopicIds.includes(id))}
              placeholder="Search additional topics..."
              vocabTable="topics"
            />
          </div>
        )}

        <p className="text-carbon-xs text-foreground-secondary">
          Topics help categorize guidance for better filtering and discovery. Default topics are automatically included based on your selected tasks.
        </p>
      </div>
    </div>
  );
}
