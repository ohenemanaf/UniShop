/**
 * File: AdminLiveChat.jsx
 * Description: Auto-generated documentation for AdminLiveChat.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect, useRef } from 'react';
import api from '../../api';
import { useSocket } from '../../context/SocketContext';
import { IconMessageCircle, IconSend, IconUser, IconMessagesOff } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
export default /**
 * Function AdminLiveChat
 * @returns {any}
 */
function AdminLiveChat() {
  const {
    socket
  } = useSocket();
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch active chats
  const fetchActiveUsers = async () => {
    try {
      const res = await api.get('/crm/chat/active');
      setActiveUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchActiveUsers();
  }, []);

  // Fetch chat history for selected user
  useEffect(() => {
    if (selectedUser) {
      api.get(`/crm/chat/${selectedUser.id}`).then(res => setMessages(res.data)).catch(console.error);
    }
  }, [selectedUser]);

  // Listen for new messages globally
  useEffect(() => {
    if (!socket) return;
    /**
 * Arrow Function handleNewMsg
 * @param {any} msg
 * @returns {any}
 */
    const handleNewMsg = msg => {
      // If message belongs to currently open chat, append it
      if (selectedUser && msg.user_id === selectedUser.id) {
        setMessages(prev => [...prev, msg]);
      }
      // Refresh active users list to pop them to top
      fetchActiveUsers();
    };
    socket.on('new_chat_message', handleNewMsg);
    return () => socket.off('new_chat_message', handleNewMsg);
  }, [socket, selectedUser]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages, selectedUser]);
  /**
 * Arrow Function handleSend
 * @param {any} e
 * @returns {any}
 */
  const handleSend = e => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !socket.connected || !selectedUser) return;
    const tempMsg = {
      id: Date.now(),
      user_id: selectedUser.id,
      sender_type: 'admin',
      message: inputText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setInputText('');
    socket.emit('admin_reply', {
      targetUserId: selectedUser.id,
      message: tempMsg.message
    }, serverMsg => {
      setMessages(prev => prev.map(m => m.id === tempMsg.id ? serverMsg : m));
    });
  };
  return <div className="w-full h-[calc(100vh-140px)] flex flex-col">
      <SEO title="Live Support Chat | Admin" />
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <IconMessageCircle size={28} stroke={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-primary">Live Support Chat</h1>
      </div>

      <div className="flex-1 bg-surface border border-outline/30 rounded-[2rem] overflow-hidden shadow-sm flex h-full min-h-0">
        
        {/* Left Sidebar: Active Users */}
        <div className="w-80 border-r border-outline/30 flex flex-col bg-surface shrink-0 h-full">
          <div className="p-6 border-b border-outline/30 bg-surface-variant/30 shrink-0">
            <h3 className="text-lg font-bold text-primary">Active Conversations</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
            {activeUsers.length === 0 && <div className="p-8 text-center text-on-surface-variant flex flex-col items-center mt-10">
                <div className="w-16 h-16 rounded-full bg-surface-variant/50 flex items-center justify-center mb-4 border border-outline/30">
                  <IconMessagesOff size={24} stroke={1.5} className="opacity-50" />
                </div>
                <p className="text-sm font-semibold">No active conversations</p>
              </div>}
            
            {activeUsers.map(u => <motion.div whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} key={u.id} onClick={() => setSelectedUser(u)} className={`mb-2 p-4 rounded-2xl cursor-pointer flex items-center gap-4 transition-all ${selectedUser?.id === u.id ? 'bg-primary text-white shadow-md' : 'hover:bg-surface-variant/30 text-primary bg-surface border border-outline/10'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-inner ${selectedUser?.id === u.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                  {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : <IconUser size={24} stroke={1.5} />}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className={`text-base font-bold truncate ${selectedUser?.id === u.id ? 'text-white' : 'text-primary'}`}>{u.name}</div>
                  <div className={`text-xs font-semibold truncate ${selectedUser?.id === u.id ? 'text-white/80' : 'text-on-surface-variant'}`}>{u.email}</div>
                </div>
              </motion.div>)}
          </div>
        </div>

        {/* Right Sidebar: Chat Area */}
        <div className="flex-1 flex flex-col bg-surface min-w-0 h-full relative">
          {!selectedUser ? <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant p-8 text-center bg-surface-variant/10">
              <motion.div initial={{
            scale: 0.9,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-outline/20">
                <IconMessageCircle size={48} stroke={1} className="text-primary/50" />
              </motion.div>
              <h2 className="text-2xl font-black text-primary mb-2 tracking-tight">Select a conversation</h2>
              <p className="text-sm font-medium text-on-surface-variant">Choose a user from the left sidebar to start providing support.</p>
            </div> : <>
              {/* Chat Header */}
              <div className="px-8 py-5 bg-white border-b border-outline/20 flex items-center gap-4 shrink-0 shadow-sm z-10 relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                   <IconUser size={20} stroke={1.5} />
                </div>
                <div>
                  <div className="text-lg font-bold text-primary leading-tight">{selectedUser.name}</div>
                  <div className="text-xs font-semibold text-success flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    Active Now
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-5 bg-[#f8fafc] min-h-0 relative">
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => {
                const isAdmin = msg.sender_type === 'admin';
                const showAvatar = !isAdmin && (index === 0 || messages[index - 1].sender_type === 'admin');
                return <motion.div key={msg.id} initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.95
                }} animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }} layout className={`flex flex-col max-w-[75%] ${isAdmin ? 'self-end items-end' : 'self-start items-start'}`}>
                        <div className="flex items-end gap-3">
                          {!isAdmin && <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mb-1 border border-primary/20 shadow-sm">
                              {showAvatar ? <IconUser size={16} className="text-primary" /> : <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />}
                            </div>}
                          
                          <div className={`px-5 py-3.5 text-[15px] font-medium leading-relaxed shadow-sm ${isAdmin ? 'bg-primary text-white rounded-[1.5rem] rounded-br-sm' : 'bg-white border border-outline/10 text-primary rounded-[1.5rem] rounded-bl-sm'}`}>
                            {msg.message}
                          </div>
                        </div>
                        <span className="text-[11px] text-on-surface-variant/60 mt-1.5 px-2 font-bold tracking-wide">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                        </span>
                      </motion.div>;
              })}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-4" />
              </div>

              {/* Input */}
              <div className="p-6 bg-white border-t border-outline/20 shrink-0 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] z-10 relative">
                <form onSubmit={handleSend} className="flex gap-4 items-center">
                  <div className="flex-1 bg-surface-variant/20 rounded-2xl border border-outline/30 focus-within:border-primary focus-within:bg-white focus-within:shadow-sm transition-all flex items-center px-2">
                    <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} placeholder={`Reply to ${selectedUser.name.split(' ')[0]}...`} className="w-full bg-transparent px-4 py-4 outline-none font-semibold text-primary text-[15px]" />
                  </div>
                  <motion.button whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} type="submit" disabled={!inputText.trim()} className="h-14 px-8 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:bg-surface-variant disabled:text-on-surface-variant shadow-md disabled:shadow-none">
                    <IconSend size={20} stroke={2} className={inputText.trim() ? "translate-x-[2px] translate-y-[-2px]" : ""} /> 
                    <span className="hidden sm:inline">Send</span>
                  </motion.button>
                </form>
              </div>
            </>}
        </div>
      </div>
    </div>;
}