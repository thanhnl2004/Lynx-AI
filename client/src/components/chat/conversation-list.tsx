"use client";

import { useGetConversations, useRenameConversation, useDeleteConversation } from '@/hooks/use-convo';
import { useRouter, usePathname } from 'next/navigation';
import { MessageSquare, Plus, Check, X, EllipsisVertical, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Conversation } from '@/types/prisma';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

export function ConversationList() {
  const { data: conversations, isLoading } = useGetConversations();
  const renameConversation = useRenameConversation();
  const deleteConversation = useDeleteConversation();
  const router = useRouter();
  const pathname = usePathname();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const handleNewChat = () => {
    router.push('/');
  };

  const handleConversationClick = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  const startEditing = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditingTitle(conversation.title || 'Untitled');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const handleDelete = async (conversationId: string) => {
    try {
      await deleteConversation.mutateAsync(conversationId);
      if (pathname === `/chat/${conversationId}`) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const saveTitle = async (conversationId: string) => {
    if (editingTitle.trim()) {
      try {
        await renameConversation.mutateAsync({
          conversationId,
          newTitle: editingTitle.trim()
        });
        setEditingId(null);
        setEditingTitle('');
      } catch (error) {
        console.error('Failed to rename conversation:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, conversationId: string) => {
    if (e.key === 'Enter') {
      saveTitle(conversationId);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Conversations</SidebarGroupLabel>
        <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Conversations</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleNewChat}>
            <Plus size={16} />
            <span>New Chat</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        {conversations?.map((conversation: Conversation) => {
          const isActive = pathname === `/chat/${conversation.id}`;
          const isEditing = editingId === conversation.id;
          
          return (
            <SidebarMenuItem key={conversation.id}>
              <SidebarMenuButton
                {...(isEditing
                  ? { asChild: true }
                  : { onClick: () => handleConversationClick(conversation.id) })}
                className={`${isActive ? 'bg-gray-200' : ''} ${isEditing ? 'cursor-default' : ''}`}
              >
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full">
                    <MessageSquare size={16} />
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, conversation.id)}
                        className="h-6 text-sm"
                        autoFocus
                        onFocus={(e) => e.target.select()}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => saveTitle(conversation.id)}
                        disabled={renameConversation.isPending}
                      >
                        <Check size={12} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={cancelEditing}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <MessageSquare size={16} />
                    <span className="truncate">
                      {conversation.title || 'Untitled'}
                    </span>
                  </>
                )}
              </SidebarMenuButton>
              
              {!isEditing && (
                <Popover
                  open={openPopoverId === conversation.id}
                  onOpenChange={(open) => setOpenPopoverId(open ? conversation.id : null)}
                >
                  <SidebarMenuAction asChild showOnHover>
                    <PopoverTrigger className="flex items-center justify-center">
                      <EllipsisVertical size={12} />
                    </PopoverTrigger>
                  </SidebarMenuAction>
                  <PopoverContent className="w-56 p-2">
                    <div className="flex flex-col gap-1 text-sm">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-gray-100 focus-visible:outline focus-visible:outline-offset-2"
                        onClick={() => {
                          setOpenPopoverId(null);
                          startEditing(conversation);
                        }}
                      >
                        <Pencil size={14} className="text-gray-600" />
                        <span className="font-medium text-gray-800">Rename conversation</span>
                      </button>
                      <div className="h-px w-full bg-gray-200" />
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-200 disabled:opacity-60"
                        onClick={() => {
                          setOpenPopoverId(null);
                          handleDelete(conversation.id);
                        }}
                        disabled={deleteConversation.isPending}
                      >
                        <Trash2 size={14} />
                        <span className="font-medium">Delete conversation</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}