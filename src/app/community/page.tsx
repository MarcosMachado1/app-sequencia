'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Trash2, Flame, Users, Lightbulb, User, Settings, LogOut, Menu, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Imagem muito grande. Máximo 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload da imagem');
      return null;
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    setUploading(true);
    try {
      let imageUrl = null;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) {
          setUploading(false);
          return;
        }
      }

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: newPost,
          image_url: imageUrl
        });

      if (error) throw error;

      setNewPost('');
      setImageFile(null);
      setImagePreview(null);
      loadPosts();
      toast.success('Post criado!');
    } catch (error) {
      console.error('Erro ao criar post:', error);
      toast.error('Erro ao criar post');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePost = async (postId: string, imageUrl?: string) => {
    if (!user) return;

    try {
      // Deletar imagem do storage se existir
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('post-images')
            .remove([fileName]);
        }
      }

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sequencia
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            <Flame className="w-5 h-5 mr-3" />
            Meus Hábitos
          </Button>
          <Button
            onClick={() => router.push("/tips")}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            <Lightbulb className="w-5 h-5 mr-3" />
            Dicas Diárias
          </Button>
          <Button
            onClick={() => router.push("/community")}
            variant="ghost"
            className="w-full justify-start bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200"
          >
            <Users className="w-5 h-5 mr-3" />
            Comunidade
          </Button>
          <Button
            onClick={() => router.push("/profile")}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            <User className="w-5 h-5 mr-3" />
            Perfil
          </Button>
          <Button
            onClick={() => router.push("/settings")}
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
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
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
                className="w-full justify-start bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600"
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
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
            <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-gray-900">Criar Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="O que você quer compartilhar?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
                
                {imagePreview && (
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Adicionar Imagem
                  </Button>
                  <Button 
                    onClick={handleCreatePost} 
                    disabled={uploading || !newPost.trim()}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Publicar'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardContent className="py-8 text-center text-gray-500">
                    Nenhum post ainda. Seja o primeiro a compartilhar!
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      <Avatar className="h-8 w-8 mr-3 bg-gradient-to-br from-indigo-600 to-purple-600">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
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
                          onClick={() => handleDeletePost(post.id, post.image_url)}
                          className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 whitespace-pre-wrap text-gray-800">{post.content}</p>
                      
                      {post.image_url && (
                        <img 
                          src={post.image_url} 
                          alt="Post" 
                          className="w-full rounded-lg mb-4 shadow-md"
                        />
                      )}

                      <div className="flex items-center space-x-4 text-gray-600">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes_count || 0}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
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
