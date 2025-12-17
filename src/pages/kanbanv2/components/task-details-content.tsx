import { useState, useEffect, useCallback } from 'react';
import { useKanban } from '../context';
import { useTaskDetails } from '../context/task-details-context';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, CheckCircle2, Circle, Link2 } from 'lucide-react';
import SubtaskItem from './subtask-item';
import type { Task } from '../types';

export function TaskDetailsContent() {
  const { selectedTask, selectedColumnId, closeTask } = useTaskDetails();
  const { updateTask, addSubtask, toggleSubtask, removeSubtask } = useKanban();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Initialize state from selectedTask
  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title || '');
      setDescription(selectedTask.description || '');
      setTags(selectedTask.tags || []);
      setIsEditingTitle(false);
      setIsEditingDescription(false);
    }
  }, [selectedTask]);

  const handleTitleBlur = useCallback(() => {
    if (!selectedTask) return;
    if (title.trim() && title !== selectedTask.title) {
      updateTask(selectedTask.id, { title: title.trim() });
    }
    setIsEditingTitle(false);
  }, [title, selectedTask, updateTask]);

  const handleDescriptionBlur = useCallback(() => {
    if (!selectedTask) return;
    if (description !== (selectedTask.description || '')) {
      updateTask(selectedTask.id, { description: description.trim() || undefined });
    }
    setIsEditingDescription(false);
  }, [description, selectedTask, updateTask]);

  const handleAddTag = useCallback(() => {
    if (!newTag.trim() || !selectedTask) return;
    const updatedTags = [...tags, newTag.trim()];
    setTags(updatedTags);
    setNewTag('');
    updateTask(selectedTask.id, { tags: updatedTags });
  }, [newTag, tags, selectedTask, updateTask]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    if (!selectedTask) return;
    const updatedTags = tags.filter(t => t !== tagToRemove);
    setTags(updatedTags);
    updateTask(selectedTask.id, { tags: updatedTags });
  }, [tags, selectedTask, updateTask]);

  const handleAddSubtask = useCallback(() => {
    if (!newSubtaskTitle.trim() || !selectedTask || !selectedColumnId) return;
    addSubtask(selectedColumnId, selectedTask.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  }, [newSubtaskTitle, selectedTask, selectedColumnId, addSubtask]);

  if (!selectedTask) return null;

  const totalSubtasks = selectedTask.subtasks?.length ?? 0;
  const doneSubtasks = selectedTask.subtasks?.filter(s => s.done).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Title - Inline Editable */}
      <div>
        {isEditingTitle ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              } else if (e.key === 'Escape') {
                setTitle(selectedTask.title || '');
                setIsEditingTitle(false);
              }
            }}
            autoFocus
            className="text-xl font-semibold"
          />
        ) : (
          <h2
            onClick={() => setIsEditingTitle(true)}
            className="text-xl font-semibold cursor-text hover:bg-accent/50 p-2 rounded-md -m-2"
          >
            {title || 'Untitled Task'}
          </h2>
        )}
      </div>

      {/* Description - Inline Editable */}
      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        {isEditingDescription ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDescription(selectedTask.description || '');
                setIsEditingDescription(false);
              }
            }}
            autoFocus
            className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            placeholder="Add a description..."
          />
        ) : (
          <div
            onClick={() => setIsEditingDescription(true)}
            className="cursor-text hover:bg-accent/50 p-2 rounded-md -m-2 min-h-[100px] text-sm text-muted-foreground"
          >
            {description || <span className="italic">Add a description...</span>}
          </div>
        )}
      </div>

      {/* Subtasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium">
              Subtasks ({doneSubtasks}/{totalSubtasks})
            </label>
          </div>
        </div>
        
        {/* Subtask List */}
        {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
          <div className="space-y-2 mb-3">
            {selectedTask.subtasks.map((subtask) => (
              <SubtaskItem
                key={subtask.id}
                node={subtask}
                columnId={selectedColumnId}
                cardId={selectedTask.id}
              />
            ))}
          </div>
        )}

        {/* Add Subtask */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleAddSubtask}
            disabled={!newSubtaskTitle.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Input
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newSubtaskTitle.trim()) {
                handleAddSubtask();
              }
            }}
            placeholder="Add subtask..."
            className="flex-1"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-medium mb-2 block">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-destructive/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTag.trim()) {
                handleAddTag();
              }
            }}
            placeholder="Add tag..."
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

