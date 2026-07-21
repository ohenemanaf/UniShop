/**
 * File: LiveChat.jsx
 * Description: Auto-generated documentation for LiveChat.jsx
 * Date: 2026-07-21
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { IconMessageCircle, IconX, IconSend, IconUser, IconClock } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
const INACTIVITY_MS = 60 * 60 * 1000; // 1 hour

export default /**
 * Function LiveChat
 * @returns {any}
 */
function LiveChat() {
  const {
    user
  } = useAuth();
  const {
    socket
  } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const messagesEndRef = useRef(null);
  const inactivityTimerRef = useRef(null);

  // Reset the 1-hour inactivity countdown
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    setSessionExpired(false);
    inactivityTimerRef.current = setTimeout(() => {
      setMessages([]);
      setSessionExpired(true);
    }, INACTIVITY_MS);
  }, []);

  // Clear timer on unmount
  useEffect(() => () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
  }, []);

  // Load chat history when opened
  useEffect(() => {
    if (isOpen && user && user.role === 'customer') {
      api.get('/crm/chat').then(res => {
        setMessages(res.data);
        if (res.data.length > 0) resetInactivityTimer();
      }).catch(console.error);
    }
  }, [isOpen, user, resetInactivityTimer]);

  // Listen for new messages + server-pushed session expiry
  useEffect(() => {
    if (!socket) return;
    /**
 * Arrow Function handleNewMsg
 * @param {any} msg
 * @returns {any}
 */
    const handleNewMsg = msg => {
      setMessages(prev => [...prev, msg]);
      resetInactivityTimer();
    };
    /**
 * Arrow Function handleSessionExpired
 * @returns {any}
 */
    const handleSessionExpired = () => {
      setMessages([]);
      setSessionExpired(true);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
    socket.on('new_chat_message', handleNewMsg);
    socket.on('chat_session_expired', handleSessionExpired);
    return () => {
      socket.off('new_chat_message', handleNewMsg);
      socket.off('chat_session_expired', handleSessionExpired);
    };
  }, [socket, resetInactivityTimer]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages, isOpen]);
  /**
 * Arrow Function handleSend
 * @param {any} e
 * @returns {any}
 */
  const handleSend = e => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !socket.connected) return;
    const tempMsg = {
      id: Date.now(),
      user_id: user.id,
      sender_type: 'user',
      message: inputText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setInputText('');
    resetInactivityTimer(); // reset on send

    socket.emit('send_message', {
      message: tempMsg.message
    }, serverMsg => {
      setMessages(prev => prev.map(m => m.id === tempMsg.id ? serverMsg : m));
    });
  };

  // Only show widget for customers (Admins/sellers have the dashboard)
  if (!user || user.role !== 'customer') return null;
  return <AnimatePresence>
      {/* Floating Button */}
      {!isOpen && <motion.button initial={{
      scale: 0,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} exit={{
      scale: 0,
      opacity: 0
    }} whileHover={{
      scale: 1.05
    }} whileTap={{
      scale: 0.95
    }} className="fixed bottom-6 right-6 w-12 h-12 md:w-16 md:h-16 rounded-full bg-error text-white flex items-center justify-center shadow-level-2 z-[9999]" onClick={() => setIsOpen(true)}>
          <IconMessageCircle stroke={1.5} className="w-6 h-6 md:w-8 md:h-8" />
        </motion.button>}

      {/* Chat Window */}
      {isOpen && <motion.div initial={{
      opacity: 0,
      y: 50,
      scale: 0.9
    }} animate={{
      opacity: 1,
      y: 0,
      scale: 1
    }} exit={{
      opacity: 0,
      y: 50,
      scale: 0.9
    }} transition={{
      type: "spring",
      damping: 25,
      stiffness: 200
    }} className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-surface/90 backdrop-blur-2xl rounded-[2rem] shadow-level-3 flex flex-col z-[9999] border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="p-5 bg-primary text-white flex justify-between items-center shrink-0 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-50"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
                <IconMessageCircle size={24} stroke={1.5} />
              </div>
              <div>
                <h3 className="m-0 text-base font-bold leading-tight">Live Support</h3>
                <p className="m-0 text-xs text-white/80 font-medium">We typically reply in minutes</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="relative z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none text-white transition-colors cursor-pointer">
              <IconX size={18} stroke={2} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-surface-variant/10 relative">
            {/* Session Expired Notice */}
            {sessionExpired && <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="flex flex-col items-center justify-center h-full text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                  <IconClock size={32} stroke={1.5} />
                </div>
                <p className="font-bold text-sm text-primary">Session Expired</p>
                <p className="font-medium text-xs text-on-surface-variant px-8">
                  Your conversation was cleared after 1 hour of inactivity.
                </p>
                <button onClick={() => {
            setSessionExpired(false);
            setMessages([]);
          }} className="mt-2 text-xs font-bold text-primary border border-primary/30 px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                  Start New Chat
                </button>
              </motion.div>}

            {/* Empty State */}
            {!sessionExpired && messages.length === 0 && <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="flex flex-col items-center justify-center h-full text-center gap-3 text-on-surface-variant/60">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                  <IconMessageCircle size={32} stroke={1} />
                </div>
                <p className="font-medium text-sm px-8">
                  Send us a message! An admin will be right with you.
                </p>
              </motion.div>}

            
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => {
            const isMe = msg.sender_type === 'user';
            const showAvatar = !isMe && (index === 0 || messages[index - 1].sender_type === 'user');
            return <motion.div key={msg.id} initial={{
              opacity: 0,
              y: 10,
              scale: 0.95
            }} animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }} layout className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                    <div className="flex items-end gap-2">
                      {!isMe && <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mb-1">
                          {showAvatar ? <IconUser size={14} className="text-primary" /> : <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />}
                        </div>}
                      
                      <div className={`p-3.5 px-4 text-sm font-medium leading-relaxed shadow-sm
                        ${isMe ? 'bg-primary text-white rounded-2xl rounded-br-sm' : 'bg-white text-primary border border-outline/10 rounded-2xl rounded-bl-sm'}`}>
                        {msg.message}
                      </div>
                    </div>
                    <span className="text-[10px] text-on-surface-variant/60 mt-1 px-1 font-semibold">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                    </span>
                  </motion.div>;
          })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-outline/20 shrink-0">
            <form onSubmit={handleSend} className="flex gap-2">
              <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-3 rounded-[1.25rem] border border-outline/30 bg-surface focus:bg-white focus:border-primary/50 focus:shadow-sm outline-none transition-all font-medium text-primary text-sm" />
              <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} type="submit" disabled={!inputText.trim()} className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-full transition-all ${inputText.trim() ? 'bg-primary text-white shadow-md' : 'bg-surface-variant text-on-surface-variant opacity-50'}`}>
                <IconSend size={20} stroke={1.5} className={inputText.trim() ? "translate-x-[1px] translate-y-[-1px]" : ""} />
              </motion.button>
            </form>
          </div>
        </motion.div>}
    </AnimatePresence>;
}