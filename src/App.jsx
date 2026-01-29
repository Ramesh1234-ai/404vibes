import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faTwitter, faInstagram, faEnvelope } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'lucide-react';
// Sample Data
const portfolioData = {
  hero: {
    name: "Rishit Sinha",
    title: "Full Stack Developer & Creative Technologist",
    tagline: "Crafting digital experiences that bridge innovation and elegance",
    cta: "View My Work"
  },
  about: {
    description: "I'm a passionate developer with 6+ years of experience building scalable web applications and innovative digital solutions. My approach combines technical excellence with thoughtful design, creating products that users love and businesses depend on.",
    highlights: [
      "🚀 Specialized in Backend",
      "Specialized in Making real World Problems "
    ]
  },
  skills: [
    { category: "Frontend", items: ["React","Tailwind CSS"] },
    { category: "Backend", items: ["Node.js", "Flask",]},
    { category: "Tools", items: ["Git", "Github", "Clerk", "firebase"] },
    { category: "Database", items: ["Mysql", "MongoDB",] }
  ],
  projects: [
    {
      title: "A Real Time Chat Application",
      description: "A fully-featured Real Time Chat Application,Implemented private and group chat functionality using WebSockets.",
      tech: ["HTML", "CSS", "FLASK", "SQL","JS","WebSocket"],
      link: "https://github.com/Ramesh1234-ai/bookish-spork",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80"
    },
    {
      title: "CloutLeak",
      description: "An real time live Streaming web Application With google Oauth.RealTime Management,Payment Proceesing with real Time Chatbot",
      tech: ["Node js", "OpenAI API", "React", "Vercel","LLM"],
      link: "#",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
    },
    {
      title: "AI Chatbot & Text Extractor ",
      description: "•	Built an AI-powered chatbot for real-time Q&A and OCR-based text extraction.•	Automated image-to-text processing with secure upload workflows.",
      tech: ["Flask", "OpenAI API", "Tesseract OCR"],
      link: "https://github.com/Ramesh1234-ai/Chunkz",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
    },
    {
      title: "VineChain",
      description: "Is an Blood Donation Management System ,Developed donor registration, inventory tracking, and real-time alert notifications,•	Implemented secure user login functionality using Firebase Authentication, enabling email/password sign-in.",
      tech: ["Flask","HTML","CSS","MySQL", "Firebase"],
      link: "https://github.com/Ramesh1234-ai/VeinChain",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
    }
  ],

};

// Firebase Configuration (Replace with your own config)
  const firebaseConfig = {
            apiKey: "AIzaSyC-qpHsdrhqqMG8OawXDqOj5a-cVGd9Hg0",
            authDomain: "flask-backend-52f1f.firebaseapp.com",
            projectId: "flask-backend-52f1f",
            storageBucket: "flask-backend-52f1f.firebasestorage.app",
            messagingSenderId: "921295611495",
            appId: "1:921295611495:web:66171871afe5185ae456c2",
            measurementId: "G-32HL77VM9N"
        };

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 animate-slideIn ${
      type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
    } text-white font-medium`}>
      <div className="flex items-center gap-3">
        {type === 'success' ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};

// Intersection Observer Hook for Scroll Animations
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1, ...options });

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  return [elementRef, isVisible];
};

// Main Portfolio Component
export default function Portfolio() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('hero');
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Firebase
  const [db, setDb] = useState(null);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      setDb(firestore);
    } catch (error) {
      console.log('Firebase initialization skipped for demo');
    }
  }, []);

  // Theme Toggle
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Smooth Scroll
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Track Active Section on Scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects','contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (db) {
        await addDoc(collection(db, 'contacts'), {
          ...formData,
          timestamp: new Date().toISOString()
        });
        setToast({ message: 'Message sent successfully!', type: 'success' });
      } else {
        // Demo mode without Firebase
        await new Promise(resolve => setTimeout(resolve, 1000));
        setToast({ message: 'Message sent! (Demo mode - Firebase not configured)', type: 'success' });
      }
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setToast({ message: 'Failed to send message. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const themeClasses = theme === 'dark' 
    ? 'bg-zinc-950 text-zinc-100' 
    : 'bg-zinc-50 text-zinc-900';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeClasses}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Work+Sans:wght@300;400;500;600&display=swap');
        
        * {
          font-family: 'Work Sans', sans-serif;
        }
        
        h1, h2, h3 {
          font-family: 'Playfair Display', serif;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        
        .gradient-border {
          position: relative;
          background: ${theme === 'dark' ? '#18181b' : '#ffffff'};
          border-radius: 1rem;
        }
        
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 2px;
          background: linear-gradient(135deg, #6366f1, #ec4899, #f59e0b);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 backdrop-blur-lg ${
        theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800' : 'bg-zinc-50/80 border-zinc-200'
      } border-b transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              RS
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {['hero', 'about', 'skills', 'projects','contact'].map(section => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize text-sm font-medium transition-colors ${
                    activeSection === section
                      ? 'text-indigo-500'
                      : theme === 'dark' ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {section === 'hero' ? 'Home' : section}
                </button>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-200 hover:bg-zinc-300'
              }`}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection theme={theme} data={portfolioData.hero} scrollToSection={scrollToSection} />

      {/* About Section */}
      <AboutSection theme={theme} data={portfolioData.about} />

      {/* Skills Section */}
      <SkillsSection theme={theme} data={portfolioData.skills} />

      {/* Projects Section */}
      <ProjectsSection theme={theme} data={portfolioData.projects} />
      {/* Contact Section */}
      <ContactSection
        theme={theme}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Footer */}
      <footer className={`py-8 border-t ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Social Links */}
          <div className="flex justify-center gap-8 mb-6">
            <a
              href="https://github.com/Ramesh1234-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl transition-transform hover:scale-125 hover:text-indigo-500"
              title="GitHub"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <Link
              to="https://www.linkedin.com/in/rishit-sinha-6953ab363/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl transition-transform hover:scale-125 hover:text-indigo-500"
              title="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
            <Link
              to="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl transition-transform hover:scale-125 hover:text-indigo-500"
              title="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </Link>
            <Link
              to="mailto:Sinharishit04@gmail.com"
              className="text-2xl transition-transform hover:scale-125 hover:text-indigo-500"
              title="Email"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </Link>
          </div>
          
          {/* Copyright */}
          <div className="text-center">
            <p className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
              © 2026 Rishit Sinha. Built with React, Tailwind CSS & Firebase.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Hero Section Component
function HeroSection({ theme, data, scrollToSection }) {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-20 noise-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10"></div>
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="opacity-0 animate-fadeInUp">
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            {data.name}
          </h1>
        </div>
        
        <div className="opacity-0 animate-fadeInUp stagger-1">
          <p className={`text-2xl md:text-3xl mb-4 font-light ${
            theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            {data.title}
          </p>
        </div>
        
        <div className="opacity-0 animate-fadeInUp stagger-2">
          <p className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'
          }`}>
            {data.tagline}
          </p>
        </div>
        
        <div className="opacity-0 animate-fadeInUp stagger-3">
          <button
            onClick={() => scrollToSection('projects')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            {data.cta}
          </button>
        </div>

        <div className="mt-20 opacity-0 animate-fadeInUp stagger-4">
          <svg className="w-6 h-6 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// About Section Component
function AboutSection({ theme, data }) {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section id="about" ref={ref} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className={`mb-16 ${isVisible ? 'opacity-100 animate-fadeInUp' : 'opacity-0'}`}>
          <h2 className="text-5xl md:text-6xl font-black mb-6">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className={`${isVisible ? 'opacity-100 animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {data.description}
            </p>
          </div>

          <div className={`space-y-4 ${isVisible ? 'opacity-100 animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            {data.highlights.map((highlight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white shadow-md'}`}
              >
                <p className="text-base">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Skills Section Component
function SkillsSection({ theme, data }) {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section id="skills" ref={ref} className={`py-24 px-6 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
      <div className="max-w-6xl mx-auto">
        <div className={`mb-16 text-center ${isVisible ? 'opacity-100 animate-fadeInUp' : 'opacity-0'}`}>
          <h2 className="text-5xl md:text-6xl font-black mb-6">Skills & Expertise</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((skillCategory, index) => (
            <div
              key={index}
              className={`gradient-border p-6 hover-lift ${
                isVisible ? `opacity-100 animate-scaleIn stagger-${index + 1}` : 'opacity-0'
              }`}
            >
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
                {skillCategory.category}
              </h3>
              <div className="space-y-2">
                {skillCategory.items.map((skill, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'
                    }`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Projects Section Component
function ProjectsSection({ theme, data }) {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section id="projects" ref={ref} className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-16 text-center ${isVisible ? 'opacity-100 animate-fadeInUp' : 'opacity-0'}`}>
          <h2 className="text-5xl md:text-6xl font-black mb-6">Featured Projects</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {data.map((project, index) => (
            <div
              key={index}
              className={`group overflow-hidden rounded-2xl hover-lift ${
                theme === 'dark' ? 'bg-zinc-900' : 'bg-white shadow-lg'
              } ${isVisible ? `opacity-100 animate-fadeInUp stagger-${index + 1}` : 'opacity-0'}`}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                <p className={`mb-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark' ? 'bg-zinc-800 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <a
                  href={project.link}
                  className="inline-flex items-center gap-2 text-indigo-500 hover:text-pink-500 transition-colors font-medium"
                >
                  View Project
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Experience Section Component
function ExperienceSection({ theme, data }) {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section id="experience" ref={ref} className={`py-24 px-6 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
      <div className="max-w-5xl mx-auto">
        <div className={`mb-16 text-center ${isVisible ? 'opacity-100 animate-fadeInUp' : 'opacity-0'}`}>
          <h2 className="text-5xl md:text-6xl font-black mb-6">Experience</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto"></div>
        </div>

        <div className="relative">
          <div className={`absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 ${
            theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-300'
          } transform md:-translate-x-1/2`}></div>

          {data.map((exp, index) => (
            <div
              key={index}
              className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto md:text-left'} md:w-1/2 ${
                isVisible ? `opacity-100 animate-fadeInUp stagger-${index + 1}` : 'opacity-0'
              }`}
            >
              <div className={`absolute left-0 md:left-auto ${
                index % 2 === 0 ? 'md:right-0' : 'md:left-0'
              } top-6 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 transform md:translate-x-1/2 -translate-x-1/2`}></div>
              
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white shadow-md'} ml-8 md:ml-0`}>
                <div className="text-sm font-medium text-indigo-500 mb-2">{exp.period}</div>
                <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
                <div className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {exp.company}
                </div>
                <p className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}>
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section Component
function ContactSection({ theme, formData, setFormData, handleSubmit, isSubmitting }) {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section id="contact" ref={ref} className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className={`mb-16 text-center ${isVisible ? 'opacity-100 animate-fadeInUp' : 'opacity-0'}`}>
          <h2 className="text-5xl md:text-6xl font-black mb-6">Get In Touch</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto mb-6"></div>
          <p className={`text-lg ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Have a project in mind? Let's collaborate and create something amazing together.
          </p>
        </div>

        <div className={`${isVisible ? 'opacity-100 animate-scaleIn stagger-1' : 'opacity-0'}`}>
          <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white shadow-xl'}`}>
            <div onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-zinc-800 border-zinc-700 focus:border-indigo-500'
                      : 'bg-zinc-50 border-zinc-300 focus:border-indigo-500'
                  } outline-none transition-colors`}
                  placeholder="Your name"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-zinc-800 border-zinc-700 focus:border-indigo-500'
                      : 'bg-zinc-50 border-zinc-300 focus:border-indigo-500'
                  } outline-none transition-colors`}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border resize-none ${
                    theme === 'dark'
                      ? 'bg-zinc-800 border-zinc-700 focus:border-indigo-500'
                      : 'bg-zinc-50 border-zinc-300 focus:border-indigo-500'
                  } outline-none transition-colors`}
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold transition-all ${
                  isSubmitting
                    ? 'bg-zinc-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500 hover:shadow-xl hover:scale-[1.02]'
                } text-white`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}