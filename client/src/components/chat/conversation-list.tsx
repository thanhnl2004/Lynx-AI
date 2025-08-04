"use client";

import { useGetConversations} from '@/hooks/use-convo';
import { useRouter, usePathname } from 'next/navigation';
import { MessageSquare, Plus } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Conversation } from '@/types/prisma';
export function ConversationList() {
  const { data: conversations, isLoading } = useGetConversations();
  const router = useRouter();
  const pathname = usePathname();

  const handleNewChat = () => {
    router.push('/chat/new');
  };

  const handleConversationClick = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
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
          return (
            <SidebarMenuItem key={conversation.id}>
              <SidebarMenuButton 
                onClick={() => handleConversationClick(conversation.id)}
                className={isActive ? 'bg-gray-100' : ''}
              >
                <MessageSquare size={16} />
                <span className="truncate">
                  {conversation.title || 'Untitled'}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}