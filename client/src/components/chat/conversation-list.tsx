"use client";

import { useGetConversations, useRenameConversation } from '@/hooks/use-convo';
import { useRouter, usePathname } from 'next/navigation';
import { MessageSquare, Plus, Edit2, Check, X } from 'lucide-react';
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

export function ConversationList() {
  const { data: conversations, isLoading } = useGetConversations();
  const renameConversation = useRenameConversation();
  const router = useRouter();
  const pathname = usePathname();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleNewChat = () => {
    router.push('/chat/new');
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
                onClick={() => !isEditing && handleConversationClick(conversation.id)}
                className={`${isActive ? 'bg-gray-200' : ''} ${isEditing ? 'cursor-default' : ''}`}
              >
                <MessageSquare size={16} />
                {isEditing ? (
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
                ) : (
                  <span className="truncate">
                    {conversation.title || 'Untitled'}
                  </span>
                )}
              </SidebarMenuButton>
              
              {!isEditing && (
                <SidebarMenuAction 
                  onClick={() => startEditing(conversation)}
                  showOnHover
                >
                  <Edit2 size={12} />
                </SidebarMenuAction>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}