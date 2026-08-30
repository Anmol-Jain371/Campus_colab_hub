import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles } from 'lucide-react';

const EventsBoard = () => {
  const { events, activeEventTab, setActiveEventTab, toggleEventRegistration, showToast } = useApp();

  const filterTabs = [
    { id: 'All', label: 'All Events' },
    { id: 'Hackathons', label: 'Hackathons' },
    { id: 'Research Opportunities', label: 'Research Projects' },
    { id: 'Competitions', label: 'Case Study & Startup pitches' },
    { id: 'Workshops', label: 'Workshops & Seminars' }
  ];

  const filteredEvents = events.filter(ev => activeEventTab === 'All' || ev.type === activeEventTab);

  return (
    <section id="screen-events" className="screen active">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">University Events & Competitions</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Discover campus hackathons, workshops, research symposiums, and startup accelerators.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="chips-container" style={{ marginBottom: '24px' }}>
        {filterTabs.map(tab => (
          <div 
            key={tab.id}
            className={`chip ${activeEventTab === tab.id ? 'selected' : ''}`} 
            onClick={() => setActiveEventTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid-3" id="events-list-grid">
        {filteredEvents.map(ev => (
          <div key={ev.id} className="card card-hover event-card">
            <span className="event-tag">{ev.type}</span>
            <div style={{ height: '120px', backgroundColor: 'var(--primary-light)', margin: '-24px -24px 16px -24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={48} style={{ color: 'var(--primary)', opacity: 0.3 }} />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flex: 1 }}>
              <div className="event-date-box" style={{ flexShrink: 0 }}>
                <span className="month">{ev.month}</span>
                <span className="day">{ev.day}</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', lineHeight: 1.3 }}>{ev.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ev.desc}
                </p>
              </div>
            </div>
            <div className="event-card-actions">
              <button 
                className={`btn ${ev.registered ? 'btn-secondary' : 'btn-primary'} btn-sm`} 
                onClick={() => toggleEventRegistration(ev.id)}
              >
                {ev.registered ? 'Registered' : 'Register'}
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => showToast('Added to Calendar', 'success')}>
                Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventsBoard;
