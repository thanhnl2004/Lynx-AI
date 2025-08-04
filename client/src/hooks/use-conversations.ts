import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

import { api } from "@/utils/api";

// interface Message {
//   id: string;
//   content: string;
//   role: 'user' | 'assistant';
//   createdAt: string;
// }

// interface Conversation {
//   id: string;
//   title: string;
//   userId: string;
//   messages: Message[];
//   createdAt: string;
//   updatedAt: string;
// }

export const useConversations = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return api.get('/api/conversations?userId=' + user.id);
    },
    enabled: !!user?.id,
  })
}

export const useConversation = (conversationId: string | null) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!user?.id || !conversationId) throw new Error('User not authenticated or conversation ID missing');
      return api.get(`/api/conversations/${conversationId}?userId=${user.id}`);
    },
    enabled: !!user?.id && !!conversationId,
  })
}

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationKey: ['createConversation'],
    mutationFn: async (title: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      return api.post('/api/conversations', { userId: user.id, title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  })

}