'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Trash2, Flame, Users, Lightbulb, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[oklch(0.45_0.15_265)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] bg-clip-text text-transparent">
              Sequencia
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Flame className="w-5 h-5 mr-3" />
            Meus Hábitos
          </Button>
          <Button
            onClick={() => router.push("/tips")}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Lightbulb className="w-5 h-5 mr-3" />
            Dicas Diárias
          </Button>
          <Button
            onClick={() => router.push("/community")}
            variant="ghost"
            className="w-full justify-start bg-[oklch(0.45_0.15_265)]/10 text-[oklch(0.45_0.15_265)] hover:bg-[oklch(0.45_0.15_265)]/20"
          >
            <Users className="w-5 h-5 mr-3" />
            Comunidade
          </Button>
          <Button
            onClick={() => router.push("/profile")}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <User className="w-5 h-5 mr-3" />
            Perfil
          </Button>
          <Button
            onClick={() => router.push("/settings")}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 mr-3" />
            Configurações
          </Button>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] bg-clip-text text-transparent">
                  Sequencia
                </h1>
              </div>
              <Button
                onClick={() => setSidebarOpen(false)}
                variant="ghost"
                size="icon"
                className="text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              <Button
                onClick={() => {
                  router.push("/dashboard");
                  setSidebarOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Flame className="w-5 h-5 mr-3" />
                Meus Hábitos
              </Button>
              <Button
                onClick={() => {
                  router.push("/tips");
                  setSidebarOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Lightbulb className="w-5 h-5 mr-3" />
                Dicas Diárias
              </Button>
              <Button
                onClick={() => {
                  router.push("/community");
                  setSidebarOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start bg-[oklch(0.45_0.15_265)]/10 text-[oklch(0.45_0.15_265)] hover:bg-[oklch(0.45_0.15_265)]/20"
              >
                <Users className="w-5 h-5 mr-3" />
                Comunidade
              </Button>
              <Button
                onClick={() => {
                  router.push("/profile");
                  setSidebarOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <User className="w-5 h-5 mr-3" />
                Perfil
              </Button>
              <Button
                onClick={() => {
                  router.push("/settings");
                  setSidebarOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Settings className="w-5 h-5 mr-3" />
                Configurações
              </Button>
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sair
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Mobile */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="px-4 h-16 flex items-center justify-between">
            <Button
              onClick={() => setSidebarOpen(true)}
              variant="ghost"
              size="icon"
              className="text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[oklch(0.45_0.15_265)] to-[oklch(0.40_0.18_280)] bg-clip-text text-transparent">
                Sequencia
              </h1>
            </div>
            <div className="w-10" />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Comunidade</h2>

            {/* Create Post */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Criar Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="O que você quer compartilhar?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] bg-gray-50 border-gray-300 text-gray-900 focus:border-[oklch(0.45_0.15_265)] focus:ring-[oklch(0.45_0.15_265)]"
                />
                <Button 
                  onClick={handleCreatePost} 
                  className="w-full bg-[oklch(0.45_0.15_265)] hover:bg-[oklch(0.40_0.18_280)] text-white"
                >
                  Publicar
                </Button>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardContent className="py-8 text-center text-gray-600">
                    Nenhum post ainda. Seja o primeiro a compartilhar!
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="bg-white border-gray-200 shadow-lg">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      <Avatar className="h-8 w-8 mr-3 bg-[oklch(0.45_0.15_265)]">
                        <AvatarFallback className="bg-[oklch(0.45_0.15_265)] text-white">
                          U
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Usuário</p>
                        <p className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      {post.user_id === user?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 whitespace-pre-wrap text-gray-900">{post.content}</p>
                      <div className="flex items-center space-x-4 text-gray-500">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-[oklch(0.65_0.20_145)] hover:bg-[oklch(0.65_0.20_145)]/10"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes_count || 0}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-[oklch(0.45_0.15_265)] hover:bg-[oklch(0.45_0.15_265)]/10"
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
        </main>
      </div>
    </div>
  );
}
