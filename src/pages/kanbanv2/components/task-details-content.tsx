import { useState, useEffect, useCallback } from 'react';
import { useKanban } from '../context';
import { useTaskDetails } from '../context/task-details-context';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, CheckCircle2, ChevronDown, ChevronRight, Search, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import SubtaskItem from './subtask-item';

export function TaskDetailsContent() {
  const { selectedTask, selectedColumnId } = useTaskDetails();
  const { updateTask, addSubtask, columns, moveCard } = useKanban();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [activeActivityTab, setActiveActivityTab] = useState('comments');
  const [isCommentFocused, setIsCommentFocused] = useState(false);

  // Get current column
  const currentColumn = columns.find(col => col.id === selectedColumnId);

  // Initialize state from selectedTask
  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title || '');
      setDescription(selectedTask.description || '');
      setTags(selectedTask.tags || []);
      setIsEditingTitle(false);
      setIsEditingDescription(false);
      setCommentText('');
      setIsCommentFocused(false);
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

  // Tag handlers - will be used when implementing tag editing in Details section
  // const handleAddTag = useCallback(() => {
  //   if (!newTag.trim() || !selectedTask) return;
  //   const updatedTags = [...tags, newTag.trim()];
  //   setTags(updatedTags);
  //   setNewTag('');
  //   updateTask(selectedTask.id, { tags: updatedTags });
  // }, [newTag, tags, selectedTask, updateTask]);

  // const handleRemoveTag = useCallback((tagToRemove: string) => {
  //   if (!selectedTask) return;
  //   const updatedTags = tags.filter(t => tagToRemove !== t);
  //   setTags(updatedTags);
  //   updateTask(selectedTask.id, { tags: updatedTags });
  // }, [tags, selectedTask, updateTask]);

  const handleAddSubtask = useCallback(() => {
    if (!newSubtaskTitle.trim() || !selectedTask || !selectedColumnId) return;
    addSubtask(selectedColumnId, selectedTask.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  }, [newSubtaskTitle, selectedTask, selectedColumnId, addSubtask]);

  const handleColumnChange = useCallback((newColumnId: string) => {
    if (!selectedTask || !selectedColumnId || newColumnId === selectedColumnId) return;
    
    // Find the target column to determine the position (append to end)
    const targetColumn = columns.find(col => col.id === newColumnId);
    const targetIndex = targetColumn ? targetColumn.cards.length : 0;
    
    // Move the card
    moveCard(selectedTask.id, selectedColumnId, newColumnId, targetIndex);
  }, [selectedTask, selectedColumnId, columns, moveCard]);

  const handleCommentSave = useCallback(() => {
    if (!commentText.trim()) return;
    // TODO: Implement comment API integration
    console.log('Saving comment:', commentText);
    setCommentText('');
    setIsCommentFocused(false);
  }, [commentText]);

  const handleCommentCancel = useCallback(() => {
    setCommentText('');
    setIsCommentFocused(false);
  }, []);

  // Comment suggestions
  const commentSuggestions = [
    'Looks good!',
    'Need help?',
    'This is blocked...',
    'Can you clarify...?',
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setCommentText(suggestion);
    setIsCommentFocused(true);
  };

  // Keyboard shortcut for comment (M key)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        if (!isCommentFocused && selectedTask) {
          setIsCommentFocused(true);
          e.preventDefault();
        }
      }
    };

    if (selectedTask) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedTask, isCommentFocused]);

  if (!selectedTask || !selectedColumnId) return null;

  // Get reporter (for now, use assignee or default)
  const reporter = selectedTask.assignee || 'Unknown';

  return (
    <div className="flex h-full">
      {/* Left Panel */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
              className="text-xl font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0"
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

        {/* Description Section */}
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

        {/* Subtasks Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">Subtasks</label>
            <Button variant="ghost" size="icon-sm" className="h-6 w-6">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Subtask Input */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <Input
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newSubtaskTitle.trim()) {
                    handleAddSubtask();
                  }
                }}
                placeholder="What needs to be done?"
                className="flex-1"
              />
              <Button variant="outline" size="sm" className="gap-1">
                Subtask
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs h-auto py-1 px-2">
                <Search className="w-3 h-3 mr-1" />
                Choose existing
              </Button>
              <Button variant="ghost" size="sm" onClick={handleAddSubtask} disabled={!newSubtaskTitle.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Subtask List */}
          {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
            <div className="space-y-2">
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
        </div>

        {/* Linked Work Items Section */}
        <div>
          <label className="text-sm font-medium mb-2 block">Linked work items</label>
          <Input
            placeholder="Add linked work item"
            className="w-full"
          />
        </div>

        {/* Activity Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">Activity</label>
            <Button variant="ghost" size="icon-sm" className="h-6 w-6">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Tabs value={activeActivityTab} onValueChange={setActiveActivityTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="worklog">Work log</TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="mt-4">
              {/* Comment Input */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {reporter.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onFocus={() => setIsCommentFocused(true)}
                      placeholder="Type @ to mention and notify someone."
                      className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm resize-none"
                    />
                    
                    {/* Comment Suggestions */}
                    {isCommentFocused && commentText === '' && (
                      <div className="flex flex-wrap gap-2">
                        {commentSuggestions.map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs h-auto py-1 px-2"
                          >
                            {suggestion}
                          </Button>
                        ))}
                        <Button variant="ghost" size="sm" className="text-xs h-auto py-1 px-2">
                          <CheckCircle2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    {/* Save/Cancel buttons - shown when focused or has text */}
                    {(isCommentFocused || commentText.trim()) && (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Pro tip: press M to comment
                        </p>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={handleCommentCancel}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleCommentSave} disabled={!commentText.trim()}>
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="text-sm text-muted-foreground">
                History will be displayed here
              </div>
            </TabsContent>

            <TabsContent value="worklog" className="mt-4">
              <div className="text-sm text-muted-foreground">
                Work log will be displayed here
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-4">
              <div className="text-sm text-muted-foreground">
                All activity will be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 border-l border-border overflow-y-auto p-6 space-y-4">
        {/* Column Selector */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Column</label>
          <Select value={selectedColumnId || ''} onValueChange={handleColumnChange}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {currentColumn?.title || 'Select column'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  {column.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Details Section - Collapsible */}
        <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
            <span>Details</span>
            {isDetailsOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-3">
            {/* Assignee */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Assignee</label>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">None</span>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">=</span>
                <Badge variant="secondary" className="capitalize">
                  {selectedTask.priority || 'Medium'}
                </Badge>
              </div>
            </div>

            {/* Parent */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Parent</label>
              <span className="text-sm text-muted-foreground">None</span>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Due date</label>
              <span className="text-sm text-muted-foreground">
                {selectedTask.dueDate || 'None'}
              </span>
            </div>

            {/* Labels */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Labels</label>
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">None</span>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Start date</label>
              <span className="text-sm text-muted-foreground">None</span>
            </div>

            {/* Story Point Estimate */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Story point estimate</label>
              <span className="text-sm text-muted-foreground">None</span>
            </div>

            {/* Reporter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Reporter</label>
              <div className="flex items-center gap-2 text-sm">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {reporter.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{reporter}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Automation Section - Collapsible */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              <span>Automation</span>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>⚡</span>
              <span>Rule executions</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Timestamps */}
        <div className="pt-4 border-t border-border space-y-1 text-xs text-muted-foreground">
          <div>Created {new Date().toLocaleDateString()}</div>
          <div>Updated {new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}
