import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, Paperclip, Folder, MoreVertical } from 'lucide-react';

const MessagesWorkspace = () => {
  const { 
    messages, 
    currentUser, 
    activeChatId, 
    selectChat, 
    sendChatMessage, 
    simulatePortfolioShare, 
    simulateFileAttachment, 
    showToast 
  } = useApp();

  const [typedMessage, setTypedMessage] = useState('');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [meetingDate, setMeetingDate] = useState('2026-07-15');
  const [meetingTime, setMeetingTime] = useState('2:00 PM');
  const messagesEndRef = useRef(null);

  const activeChat = messages.find(c => c.chatId === activeChatId);

  // Auto scroll to bottom of active chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.history]);

  // Select first chat on mount if none selected
  useEffect(() => {
    if (!activeChatId && messages.length > 0) {
      selectChat(messages[0].chatId);
    }
  }, [activeChatId, messages, selectChat]);

  if (!currentUser) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    sendChatMessage(typedMessage);
    setTypedMessage('');
  };

  const projectChannels = messages.filter(c => c.isChannel);
  const directConnections = messages.filter(c => !c.isChannel);

  return (
    <section id="screen-messages" className="screen active">
      <div className="dashboard-header" style={{ marginBottom: '16px' }}>
        <div>
          <h1 className="page-title">Collaborator Workspace Chats</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Communicate in real time with project channels and active student connections.
          </p>
        </div>
      </div>

      <div className={`chat-container ${activeChatId ? 'active-chat' : ''}`} id="chat-workspace-container">
        {/* Chat Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <input 
              type="text" 
              className="form-control" 
              style={{ padding: '8px 12px', fontSize: '0.85rem' }} 
              placeholder="Search conversations..." 
            />
          </div>
          
          <div className="chat-channels-lbl">Project Channels</div>
          <div className="chat-list" id="chat-list-channels">
            {projectChannels.map(chat => {
              const isActive = activeChatId === chat.chatId;
              const lastMsg = chat.history.length > 0 ? chat.history[chat.history.length - 1].text : 'No messages yet';
              const lastTime = chat.history.length > 0 ? chat.history[chat.history.length - 1].time : '';

              return (
                <div 
                  key={chat.chatId} 
                  className={`chat-list-item ${isActive ? 'active' : ''}`}
                  onClick={() => selectChat(chat.chatId)}
                >
                  <div className="user-avatar-container">
                    <img src={chat.avatar} alt="Avatar" className="avatar" style={{ width: '38px', height: '38px' }} />
                    <div className="status-indicator online"></div>
                  </div>
                  <div className="chat-list-details">
                    <div className="chat-title-row">
                      <span className="chat-list-name">{chat.name}</span>
                      <span className="chat-list-time">{lastTime}</span>
                    </div>
                    <p className="chat-list-msg" dangerouslySetInnerHTML={{ __html: lastMsg }}></p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="chat-channels-lbl" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            Direct Connections
          </div>
          <div className="chat-list" id="chat-list-directs">
            {directConnections.map(chat => {
              const isActive = activeChatId === chat.chatId;
              const lastMsg = chat.history.length > 0 ? chat.history[chat.history.length - 1].text : 'No messages yet';
              const lastTime = chat.history.length > 0 ? chat.history[chat.history.length - 1].time : '';

              return (
                <div 
                  key={chat.chatId} 
                  className={`chat-list-item ${isActive ? 'active' : ''}`}
                  onClick={() => selectChat(chat.chatId)}
                >
                  <div className="user-avatar-container">
                    <img src={chat.avatar} alt="Avatar" className="avatar" style={{ width: '38px', height: '38px' }} />
                    <div className="status-indicator online"></div>
                  </div>
                  <div className="chat-list-details">
                    <div className="chat-title-row">
                      <span className="chat-list-name">{chat.name}</span>
                      <span className="chat-list-time">{lastTime}</span>
                    </div>
                    <p className="chat-list-msg" dangerouslySetInnerHTML={{ __html: lastMsg }}></p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        {activeChat ? (
          <div className="chat-main">
            {/* Chat Header */}
            <div className="chat-header">
              <div className="user-avatar-container">
                <img src={activeChat.avatar} alt="Active Chat Avatar" className="avatar" />
                <div className="status-indicator online" id="chat-window-status"></div>
              </div>
              <div>
                <h3 id="chat-window-name" style={{ fontSize: '1.05rem' }}>{activeChat.name}</h3>
                <p id="chat-window-subtitle" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {activeChat.subtitle}
                </p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-secondary btn-icon btn-sm" 
                  onClick={() => showToast('Chat Workspace details: End-to-end university verified channel.', 'info')}
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="chat-body" id="chat-window-messages">
              {activeChat.history.length > 0 ? (
                activeChat.history.map((m, idx) => {
                  const isSent = m.senderId === currentUser.id;
                  return (
                    <div key={idx} className={`msg-wrapper ${isSent ? 'sent' : 'received'} ${m.senderId === 'system' ? 'system-msg-row' : ''}`} style={m.senderId === 'system' ? { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', margin: '16px 0' } : {}}>
                      <div className="msg-bubble" style={m.senderId === 'system' ? { background: '#f1f5f9', border: '1px solid var(--border)', color: 'var(--text-primary)', width: '100%', maxWidth: '520px', textAlign: 'left', borderRadius: '12px' } : {}}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '2px', color: isSent ? 'rgba(255,255,255,0.9)' : 'var(--accent)' }}>
                          {isSent ? 'You' : m.senderName}
                        </div>
                        <p dangerouslySetInnerHTML={{ __html: m.text }}></p>
                        <div className="msg-meta">{m.time}</div>

                        {/* Interactive Propose Sync Call Card for System Connections */}
                        {m.senderId === 'system' && (
                          <div style={{
                            marginTop: '12px',
                            background: 'white',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '12px',
                            boxShadow: 'var(--shadow-sm)',
                            width: '100%'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '1.1rem' }}>📅</span>
                              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Schedule Kick-off Sync</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                              Propose a calendar meeting date and time to establish synchronization milestones.
                            </p>
                            
                            {!showScheduleForm ? (
                              <button 
                                type="button"
                                className="btn btn-outline btn-sm" 
                                style={{ width: '100%', fontSize: '0.75rem', fontWeight: 700 }}
                                onClick={() => setShowScheduleForm(true)}
                              >
                                Propose Meeting Time
                              </button>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                                  <input 
                                    type="date" 
                                    className="form-control" 
                                    value={meetingDate} 
                                    onChange={(e) => setMeetingDate(e.target.value)} 
                                    style={{ padding: '6px', fontSize: '0.75rem' }} 
                                  />
                                  <select 
                                    className="form-control" 
                                    value={meetingTime} 
                                    onChange={(e) => setMeetingTime(e.target.value)} 
                                    style={{ padding: '6px', fontSize: '0.75rem' }}
                                  >
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:30 AM">11:30 AM</option>
                                    <option value="2:00 PM">2:00 PM</option>
                                    <option value="4:00 PM">4:00 PM</option>
                                    <option value="6:30 PM">6:30 PM</option>
                                  </select>
                                </div>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button 
                                    type="button" 
                                    className="btn btn-secondary btn-sm" 
                                    style={{ flex: 1, fontSize: '0.75rem', padding: '6px' }}
                                    onClick={() => setShowScheduleForm(false)}
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    type="button" 
                                    className="btn btn-primary btn-sm" 
                                    style={{ flex: 1, fontSize: '0.75rem', padding: '6px', background: 'var(--accent)', color: 'white', border: 'none' }}
                                    onClick={() => {
                                      sendChatMessage(`📅 <b>Collaboration Sync Scheduled</b>: ${meetingDate} at ${meetingTime}. <br/><b>Link</b>: <a href="https://meet.google.com/abc-defg-hij" target="_blank" style="color:var(--accent); text-decoration:underline;">meet.google.com/abc-defg-hij</a>`);
                                      setShowScheduleForm(false);
                                      showToast('Sync proposal sent in connection chat!', 'success');
                                    }}
                                  >
                                    Send Request
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                  No messages in this chat yet.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Footer Input */}
            <form onSubmit={handleSendMessage} className="chat-footer">
              <div className="chat-input-wrapper">
                <div className="chat-attachments">
                  <button 
                    type="button"
                    className="btn btn-secondary btn-icon" 
                    onClick={simulatePortfolioShare} 
                    title="Share Portfolio Asset"
                  >
                    <Folder size={18} />
                  </button>
                  <button 
                    type="button"
                    className="btn btn-secondary btn-icon" 
                    onClick={simulateFileAttachment} 
                    title="Attach File"
                  >
                    <Paperclip size={18} />
                  </button>
                </div>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Write your message here..." 
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="chat-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a connection to start chatting.
          </div>
        )}
      </div>
    </section>
  );
};

export default MessagesWorkspace;
