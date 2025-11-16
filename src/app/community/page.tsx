'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  likes_count?: number;
  comments_count?: number;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      toast.error('Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: newPost
        });

      if (error) throw error;

      setNewPost('');
      loadPosts();
      toast.success('Post criado!');
    } catch (error) {
      console.error('Erro ao criar post:', error);
      toast.error('Erro ao criar post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      loadPosts();
      toast.success('Post deletado!');
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      toast.error('Erro ao deletar post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Comunidade</h1>

      {/* Create Post */}
      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardHeader>
          <CardTitle>Criar Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="O que você quer compartilhar?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px] bg-[#0A0A0A] border-gray-700"
          />
          <Button onClick={handleCreatePost} className="w-full bg-indigo-600 hover:bg-indigo-700">
            Publicar
          </Button>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardContent className="py-8 text-center text-gray-400">
              Nenhum post ainda. Seja o primeiro a compartilhar!
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="bg-[#1A1A1A] border-gray-800">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Avatar className="h-8 w-8 mr-3 bg-indigo-600">
                  <AvatarFallback className="bg-indigo-600">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">Usuário</p>
                  <p className="text-sm text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {post.user_id === user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    className="hover:bg-red-900/20 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center space-x-4 text-gray-400">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-red-500"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes_count || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-blue-500"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments_count || 0}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
