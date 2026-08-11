import React from 'react';
import { Sparkles, Calendar, Heart, Coffee, Landmark, GraduationCap, Star } from 'lucide-react';
import './TemplateGallery.css';

const TEMPLATES = [
  {
    id: 'wedding',
    title: 'Eternal Elegance',
    category: 'Wedding',
    icon: <Heart />,
    description: 'A timeless, sophisticated design for your most special celebration. Premium florals and rose gold accents.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000',
    primaryColor: '#ec4899',
    tag: 'Popular'
  },
  {
    id: 'temple',
    title: 'Spiritual Blessing',
    category: 'Religious',
    icon: <Landmark />,
    description: 'Serene Indian motifs and saffron gold architecture. Perfect for temple visits, housewarmings, or blessings.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1000',
    primaryColor: '#f59e0b',
    tag: 'Trending'
  },
  {
    id: 'birthday',
    title: 'Midnight Sparkle',
    category: 'Birthday',
    icon: <Sparkles />,
    description: 'Vibrant balloons and gold confetti on a deep midnight blue. Let the festive celebrations begin!',
    image: 'https://images.unsplash.com/photo-1530103862676-fa8c9d34da3e?auto=format&fit=crop&q=80&w=1000',
    primaryColor: '#6366f1',
  },
  {
    id: 'graduation',
    title: 'Success Story',
    category: 'Graduation',
    icon: <GraduationCap />,
    description: 'Honor the achievement with a professional black and gold commencement design.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000',
    primaryColor: '#3b82f6',
  },
  {
    id: 'dinner',
    title: 'Enchanted Evening',
    category: 'Dinner Party',
    icon: <Star />,
    description: 'Warm candlelight and cozy table settings. An intimate design for dinner and cocktails.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000',
    primaryColor: '#10b981',
  }
];

const TemplateGallery = ({ onSelect }) => {
  return (
    <div className="template-gallery animate-fade-in">
      <div className="gallery-header">
        <div className="badge-group">
          <span className="premium-badge"><Star size={12} fill="currentColor" /> Premium Templates</span>
        </div>
        <h1 className="heading-xl">Design Your <span className="text-gradient">Perfect Invite</span></h1>
        <p className="text-muted">Choose from our curated collection of luxury event themes</p>
      </div>

      <div className="templates-grid">
        {TEMPLATES.map((template) => (
          <div 
            key={template.id} 
            className="template-card glass-card"
            onClick={() => onSelect(template)}
          >
            <div className="template-image-container">
              <div 
                className="template-image" 
                style={{ backgroundImage: `url(${template.image})` }}
              >
                {template.tag && <span className="template-tag">{template.tag}</span>}
              </div>
              <div className="template-overlay-static">
                <div className="template-category">{template.category}</div>
              </div>
            </div>
            <div className="template-info">
              <div className="template-title-row">
                <h3>{template.title}</h3>
                <div className="template-mini-icon" style={{ color: template.primaryColor }}>
                  {template.icon}
                </div>
              </div>
              <p>{template.description}</p>
              <button 
                className="btn btn-primary btn-full template-btn"
                style={{ '--theme-color': template.primaryColor, background: template.primaryColor }}
              >
                Select Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateGallery;
export { TEMPLATES };
