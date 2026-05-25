import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authcontext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import {
  Search,
  ChevronDown,
  FileText,
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  FileEdit,
  RefreshCw,
  Filter,
  User,
  Send
} from 'lucide-react';
import CreatePostModal from '../components/CreatePostModal';

const EngageView = () => {
  const { user } = useAuth();
  const { dark } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityFilter, setActivityFilter] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (content, file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', content);
      formData.append('group', 'General');
      if (file) {
        formData.append('image', file);
      }

      const response = await axios.post('/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setPosts([response.data, ...posts]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleReact = async (postId, reaction) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/posts/${postId}/react`, {
        reaction
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPosts(posts.map(p => p._id === postId ? response.data : p));
    } catch (error) {
      console.error('Error reacting to post:', error);
    }
  };

  const [commentTexts, setCommentTexts] = useState({});

  const handleCommentSubmit = async (postId) => {
    const text = commentTexts[postId];
    if (!text || !text.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/posts/${postId}/comment`, {
        text
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPosts(posts.map(p => p._id === postId ? response.data : p));
      setCommentTexts({ ...commentTexts, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activityFilter === 'posts') {
      return post.author === (user?.id || user?._id) && matchesSearch;
    }
    return matchesSearch;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* LEFT SIDEBAR - FILTERS */}
      <div className="lg:w-64 shrink-0">
        <div className={`card ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-800'}`}>
            <Filter size={18} className="text-sky-500" />
            Filters
          </h2>

          <div className="mb-5">
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Activities</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActivityFilter('all')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activityFilter === 'all'
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                    : `${dark ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-600 hover:bg-gray-100'}`
                  }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 ${activityFilter === 'all' ? 'border-sky-500 bg-sky-500' : 'border-gray-300 dark:border-gray-600'}`} />
                All Activities
              </button>
              <button
                onClick={() => setActivityFilter('posts')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activityFilter === 'posts'
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                    : `${dark ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-600 hover:bg-gray-100'}`
                  }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 ${activityFilter === 'posts' ? 'border-sky-500 bg-sky-500' : 'border-gray-300 dark:border-gray-600'}`} />
                My Posts
              </button>
            </div>
          </div>

          <div className="relative">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              className={`input-field pl-9 ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
              placeholder="Search posts or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* MAIN FEED */}
      <div className="flex-1 min-w-0">
        {/* Banner */}
        <div className={`card mb-6 relative overflow-hidden ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-sky-500 to-cyan-500'}`}>
          <div className={`absolute inset-0 ${dark ? 'opacity-20' : 'opacity-10'}`}
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
            </div>
            <div className={`flex-1 ${dark ? 'text-gray-100' : 'text-white'}`}>
              <h3 className="text-xl font-bold">Hey {user?.name || 'User'},</h3>
              <p className="text-sm opacity-90">Ready to dive in?</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-sky-600 rounded-lg font-medium hover:bg-sky-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FileEdit size={18} />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Feed Header */}
        <div className={`flex items-center justify-between mb-4 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
          <h4 className="font-semibold text-sm uppercase tracking-wider">
            {activityFilter === 'all' ? 'All Activities' : 'Posts'} — All Groups
          </h4>
          <button
            onClick={fetchPosts}
            className="flex items-center gap-1.5 text-xs font-medium text-sky-500 hover:text-sky-600 transition-colors"
          >
            <RefreshCw size={14} /> Refresh Feed
          </button>
        </div>

        {/* POSTS LIST */}
        {loading ? (
          <div className={`card text-center py-12 ${dark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'text-gray-500'}`}>
            <RefreshCw size={32} className="mx-auto mb-3 animate-spin opacity-50" />
            <p>Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={`card text-center py-12 ${dark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'text-gray-500'}`}>
            <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
            <p>No activities to show.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div key={post._id} className={`card ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className={`text-sm font-semibold ${dark ? 'text-sky-400' : 'text-sky-600'}`}>WorkLogix</div>
                    <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Group: {post.group}</div>
                  </div>
                  <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Post Content */}
                <div className="flex gap-4 mb-4">
                  <div className={`w-20 h-20 rounded-xl shrink-0 flex items-center justify-center overflow-hidden ${dark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                    {post.image ? (
                      <img
                        src={`${post.image}`}
                        alt="Post"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <MessageSquare size={36} className={dark ? 'text-gray-600' : 'text-gray-300'} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium mb-2 ${dark ? 'text-gray-200' : 'text-gray-800'}`} dangerouslySetInnerHTML={{ __html: post.title }} />
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${dark ? 'bg-gray-600 text-gray-200' : 'bg-sky-100 text-sky-700'
                        }`}>
                        {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{post.authorName}</span>
                    </div>
                  </div>
                </div>

                {/* Reactions Summary */}
                <div className={`flex items-center justify-between py-2 border-t ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${dark ? 'bg-gray-700' : 'bg-sky-100'}`}>👍</div>
                    <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{post.reactor || 'No reactions yet'}</span>
                  </div>
                  <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{post.comments?.length || 0} comments</span>
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-2 py-2 border-t ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <button
                    onClick={() => handleReact(post._id, '👍')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${post.reactions?.includes('👍')
                        ? 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
                        : `${dark ? 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`
                      }`}
                  >
                    <ThumbsUp size={16} /> Reaction
                  </button>
                  <button className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${dark ? 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}>
                    <MessageCircle size={16} /> {post.comments?.length || 0} Comments
                  </button>
                </div>

                {/* Comments Section */}
                <div className={`border-t pt-3 ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
                      {post.comments.map((comment, idx) => (
                        <div key={idx} className="flex gap-2.5">
                          <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${dark ? 'bg-gray-600 text-gray-200' : 'bg-sky-50 text-sky-700'
                            }`}>
                            {comment.userName ? comment.userName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{comment.userName}</span>
                              <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {new Date(comment.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className={`text-sm mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className={`input-field flex-1 ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
                      value={commentTexts[post._id] || ''}
                      onChange={(e) => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
                    />
                    <button
                      onClick={() => handleCommentSubmit(post._id)}
                      className="btn-primary flex items-center gap-1.5 px-4"
                    >
                      <Send size={14} /> Post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default EngageView;
