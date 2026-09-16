import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { 
  Code2, 
  MapPin, 
  Smartphone, 
  Brain, 
  Gamepad2, 
  LineChart,
  Github,
  Mail,
  Menu,
  X,
  ChevronRight,
  Star,
  LogIn,
  LogOut,
  Loader2,
  User
} from 'lucide-react';
import {
  SiCplusplus,
  SiPython,
  SiJavascript,
  SiNodedotjs,
  SiAndroid,
  SiGit,
  SiGithub,
  SiLinux,
  SiDocker,
  SiSqlite
} from 'react-icons/si';

// Mock images imported directly if they exist or using relative paths 
import bluetrackImg from "@assets/generated_images/bluetrack.jpg";
import systemstarImg from "@assets/generated_images/systemstar.jpg";
import aldratharImg from "@assets/generated_images/aldrathar.jpg";

// ==========================================
// UTILS
// ==========================================

const FadeIn = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (ref.current) ref.current.classList.add('active');
          }, delay);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
};

// ==========================================
// SECTIONS
// ==========================================

const API = '/api';

function useWebsiteAuth() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setUser(data.user); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return data.error || 'Error al iniciar sesión';
    setUser(data.user);
    return null;
  };

  const logout = async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  return { user, checking, login, logout };
}

const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useWebsiteAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const err = await login(email, password);
    setLoading(false);
    if (err) { setError(err); } else { onClose(); window.location.reload(); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-[#161B22] border border-white/10 rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="font-semibold text-white">Acceso BlueStar</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">{error}</div>}
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              placeholder="tu@correo.com" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white font-medium py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Iniciando...</> : <><LogIn className="w-4 h-4" />Iniciar sesión</>}
          </button>
        </form>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, checking, logout } = useWebsiteAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: "Inicio", href: "#" },
    { name: "Servicios", href: "#servicios" },
    { name: "Productos", href: "#productos" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Tecnologías", href: "#tecnologias" },
    { name: "Proyectos", href: "#proyectos" },
    { name: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-background/80 backdrop-blur-md border-white/5 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <Star className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(0,123,255,0.8)] group-hover:rotate-45 transition-transform duration-500" />
            <span className="text-xl font-bold tracking-tight text-white">BlueStar Technology</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a key={link.name} href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                {link.name}
              </a>
            ))}
          </div>

          {/* Auth Button */}
          <div className="hidden md:flex items-center">
            {checking ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-white/40" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <User className="w-4 h-4 text-primary" />
                  <span>{user.name}</span>
                </div>
                <button onClick={logout}
                  className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 text-sm font-medium bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors px-4 py-1.5 rounded-full">
                <LogIn className="w-4 h-4" />
                Acceso
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-xl">
            {links.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setMenuOpen(false)}
                className="text-lg font-medium text-white/80 hover:text-white hover:pl-2 transition-all">
                {link.name}
              </a>
            ))}
            <div className="pt-2 border-t border-white/10">
              {user ? (
                <button onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                  <LogOut className="w-4 h-4" />{user.name} — Cerrar sesión
                </button>
              ) : (
                <button onClick={() => { setShowLogin(true); setMenuOpen(false); }}
                  className="flex items-center gap-2 text-primary text-sm font-medium">
                  <LogIn className="w-4 h-4" />Acceso al sistema
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

const HeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number, y: number, size: number, speedX: number, speedY: number, opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50 pointer-events-none" />;
};

const Hero = () => {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
      <HeroCanvas />
      
      {/* Abstract dark blue glow in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <FadeIn delay={100}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Ingeniería de software de próxima generación
          </div>
        </FadeIn>
        
        <FadeIn delay={300}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white mb-6 max-w-5xl leading-[1.1]">
            Construimos el futuro con <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">tecnología.</span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={500}>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Desarrollamos software, sistemas inteligentes, videojuegos y plataformas de próxima generación para empresas que exigen excelencia.
          </p>
        </FadeIn>
        
        <FadeIn delay={700} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <a href="#servicios" className="h-12 px-8 inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded shadow-[0_0_20px_rgba(0,123,255,0.4)] transition-all hover:shadow-[0_0_30px_rgba(0,123,255,0.6)] hover:-translate-y-0.5">
            Conocer más
          </a>
          <a href="#productos" className="h-12 px-8 inline-flex items-center justify-center bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium rounded transition-all hover:-translate-y-0.5 gap-2">
            Ver proyectos
            <ChevronRight className="w-4 h-4" />
          </a>
        </FadeIn>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs uppercase tracking-widest font-mono">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { icon: Code2, title: "Desarrollo de Software", desc: "Soluciones a medida para empresas, arquitecturas escalables y alto rendimiento." },
    { icon: MapPin, title: "Sistemas GPS", desc: "Plataformas de rastreo en tiempo real, telemetría y gestión de flotas avanzadas." },
    { icon: Smartphone, title: "Aplicaciones Móviles", desc: "Apps nativas y multiplataforma con interfaces fluidas e intuitivas." },
    { icon: Brain, title: "Inteligencia Artificial", desc: "Integración de modelos ML, automatización inteligente y análisis de datos." },
    { icon: Gamepad2, title: "Desarrollo de Videojuegos", desc: "Creación de experiencias interactivas, motores gráficos y diseño de niveles." },
    { icon: LineChart, title: "Consultoría Tecnológica", desc: "Auditorías de código, optimización de infraestructura y estrategia IT." },
  ];

  return (
    <section id="servicios" className="py-32 relative border-t border-white/5 bg-secondary/30">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Servicios Especializados</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">Soluciones de ingeniería robustas diseñadas para resolver problemas complejos y escalar a nivel global.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="group bg-card border border-card-border p-8 rounded-lg glow-on-hover h-full flex flex-col relative overflow-hidden">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svc.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{svc.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed flex-grow">{svc.desc}</p>
                
                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Products = () => {
  const products = [
    { 
      name: "BlueTrack", 
      tag: "GPS & Rastreo", 
      desc: "Sistema GPS en tiempo real de grado militar. Monitoreo de precisión con analíticas predictivas.",
      img: bluetrackImg,
      active: true
    },
    { 
      name: "systemStar", 
      tag: "Infraestructura", 
      desc: "Servidor GPS de alto rendimiento, capaz de procesar millones de tramas por segundo con latencia ultra-baja.",
      img: systemstarImg,
      active: true
    },
    { 
      name: "Aldrathar", 
      tag: "Videojuego", 
      desc: "RPG de mundo abierto en desarrollo. Un universo oscuro y expansivo impulsado por tecnología de última generación.",
      img: aldratharImg,
      active: true
    },
    { 
      name: "Próximamente...", 
      tag: "En desarrollo", 
      desc: "Investigación activa en nuevos paradigmas de interacción humano-computadora. Proyecto clasificado.",
      img: null,
      active: false
    }
  ];

  return (
    <section id="productos" className="py-32 relative bg-background">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Productos Insignia</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">Herramientas y plataformas construidas internamente que demuestran nuestra capacidad técnica.</p>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((prod, i) => (
            <FadeIn key={i} delay={i * 150}>
              <div className={`group bg-card border ${prod.active ? 'border-card-border glow-on-hover cursor-pointer' : 'border-white/5 opacity-60'} rounded-xl overflow-hidden flex flex-col h-full`}>
                <div className="h-60 w-full relative overflow-hidden bg-secondary flex items-center justify-center">
                  {prod.img ? (
                    <img 
                      src={prod.img} 
                      alt={prod.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-secondary/50 backdrop-blur-xl flex items-center justify-center">
                      <LockIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-mono px-3 py-1 bg-black/50 backdrop-blur-md rounded border ${prod.active ? 'border-primary/30 text-primary' : 'border-white/10 text-muted-foreground'}`}>
                      {prod.tag}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex-grow flex flex-col justify-start z-10 -mt-6">
                  <h3 className="text-2xl font-bold text-white mb-3">{prod.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{prod.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const LockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const About = () => {
  return (
    <section id="nosotros" className="py-32 relative border-t border-white/5 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Acerca de BlueStar Technology</h2>
            </FadeIn>
            
            <FadeIn delay={100}>
              <div className="space-y-8">
                <div className="pl-6 border-l-2 border-primary/50 relative">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />
                  <h3 className="text-xl font-bold text-white mb-2">Nuestra Misión</h3>
                  <p className="text-muted-foreground text-lg font-light leading-relaxed">
                    Crear tecnología accesible, potente y escalable para empresas y personas. No nos conformamos con lo funcional; buscamos la excelencia arquitectónica en cada línea de código.
                  </p>
                </div>
                
                <div className="pl-6 border-l-2 border-primary/20 relative">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary/50" />
                  <h3 className="text-xl font-bold text-white mb-2">Nuestra Visión</h3>
                  <p className="text-muted-foreground text-lg font-light leading-relaxed">
                    Convertirnos en una empresa tecnológica reconocida internacionalmente, estableciendo nuevos estándares en el desarrollo de software y sistemas críticos.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
          
          <div className="relative h-[400px] flex items-center justify-center lg:justify-end perspective-1000">
            <FadeIn delay={300} className="relative">
              {/* Decorative Tech Element */}
              <div className="w-64 h-64 md:w-80 md:h-80 relative transform-gpu animate-[spin_20s_linear_infinite]">
                {/* Hexagons */}
                <div className="absolute inset-0 border border-primary/30 rounded-full flex items-center justify-center rotate-45">
                  <div className="w-full h-[1px] bg-primary/20" />
                  <div className="h-full w-[1px] bg-primary/20 absolute" />
                </div>
                <div className="absolute inset-4 border border-white/10 rounded-full flex items-center justify-center">
                  <div className="w-48 h-48 border-[0.5px] border-primary/40 rotate-12 bg-primary/5 backdrop-blur-sm" />
                </div>
                <div className="absolute inset-12 bg-secondary border border-primary/40 flex items-center justify-center shadow-[0_0_50px_rgba(0,123,255,0.2)]">
                  <Star className="w-12 h-12 text-primary" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

const Technologies = () => {
  const techs = [
    { name: "C++", icon: SiCplusplus },
    { name: "Python", icon: SiPython },
    { name: "JavaScript", icon: SiJavascript },
    { name: "Node.js", icon: SiNodedotjs },
    { name: "Android", icon: SiAndroid },
    { name: "Git", icon: SiGit },
    { name: "GitHub", icon: SiGithub },
    { name: "Linux", icon: SiLinux },
    { name: "Docker", icon: SiDocker },
    { name: "SQLite", icon: SiSqlite },
  ];

  return (
    <section id="tecnologias" className="py-24 relative bg-background border-t border-white/5">
      <div className="container mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="text-sm font-mono tracking-widest uppercase text-primary mb-12">Nuestro Stack Tecnológico</h2>
        </FadeIn>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 max-w-5xl mx-auto">
          {techs.map((tech, i) => (
            <FadeIn key={tech.name} delay={i * 50}>
              <div className="group flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer w-24">
                <tech.icon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:scale-110 drop-shadow-none group-hover:drop-shadow-[0_0_8px_rgba(0,123,255,0.6)]" />
                <span className="text-xs font-medium text-muted-foreground group-hover:text-white transition-colors">{tech.name}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const AnimatedCounter = ({ end, suffix = "", prefix = "" }: { end: number, suffix?: string, prefix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const duration = 2000;
    
    const startAnimation = () => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * end));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      animationFrame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [end]);

  if (end === 0) return <span ref={ref}>{prefix}En crecimiento{suffix}</span>;

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
};

const Stats = () => {
  return (
    <section id="proyectos" className="py-24 relative overflow-hidden bg-secondary">
      {/* Dark blue gradient background band */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-secondary to-background" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          <FadeIn delay={100} className="flex flex-col gap-2">
            <div className="text-4xl md:text-6xl font-black text-primary text-glow font-mono">
              <AnimatedCounter end={12} suffix="+" />
            </div>
            <div className="text-sm md:text-base font-medium text-white/70 uppercase tracking-wider">Proyectos</div>
          </FadeIn>
          
          <FadeIn delay={200} className="flex flex-col gap-2">
            <div className="text-4xl md:text-6xl font-black text-primary text-glow font-mono">
              <AnimatedCounter end={10} suffix="+" />
            </div>
            <div className="text-sm md:text-base font-medium text-white/70 uppercase tracking-wider">Tecnologías</div>
          </FadeIn>
          
          <FadeIn delay={300} className="flex flex-col gap-2">
            <div className="text-4xl md:text-6xl font-black text-primary text-glow font-mono">
              <AnimatedCounter end={5000} suffix="+" />
            </div>
            <div className="text-sm md:text-base font-medium text-white/70 uppercase tracking-wider">Horas de desarrollo</div>
          </FadeIn>
          
          <FadeIn delay={400} className="flex flex-col gap-2">
            <div className="text-2xl md:text-4xl font-black text-primary mt-2 font-mono flex items-center justify-center h-[60px]">
              En crecimiento
            </div>
            <div className="text-sm md:text-base font-medium text-white/70 uppercase tracking-wider">Clientes</div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate network request
    setTimeout(() => {
      setStatus("success");
      // Reset form after a few seconds
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <section id="contacto" className="py-32 relative bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Iniciemos un Proyecto</h2>
            <p className="text-muted-foreground text-lg">¿Tienes un desafío técnico? Estamos listos para resolverlo.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-2 space-y-8">
            <FadeIn delay={100}>
              <h3 className="text-xl font-bold text-white mb-4">Información de Contacto</h3>
              <p className="text-muted-foreground font-light mb-8 leading-relaxed">
                Operamos globalmente, construyendo software desde nuestro hub tecnológico. Contáctanos para consultar sobre servicios de ingeniería y desarrollo.
              </p>
              
              <div className="space-y-6">
                <a href="#" className="flex items-center gap-4 text-muted-foreground hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
                    <Mail className="w-5 h-5 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-medium">contacto@bluestar.tech</span>
                </a>
                
                <a href="#" className="flex items-center gap-4 text-muted-foreground hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
                    <Github className="w-5 h-5 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-medium">github.com/bluestartech</span>
                </a>
              </div>
            </FadeIn>
          </div>

          <div className="md:col-span-3">
            <FadeIn delay={200}>
              <form onSubmit={handleSubmit} className="bg-card border border-card-border p-8 rounded-xl space-y-6 relative overflow-hidden">
                {status === "success" && (
                  <div className="absolute inset-0 bg-card z-10 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                      <Code2 className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">Mensaje Enviado</h4>
                    <p className="text-muted-foreground">Nuestro equipo técnico se pondrá en contacto pronto.</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-white/80">Nombre</label>
                    <input 
                      required
                      type="text" 
                      id="name" 
                      className="w-full bg-input/50 border border-border rounded p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white/80">Correo</label>
                    <input 
                      required
                      type="email" 
                      id="email" 
                      className="w-full bg-input/50 border border-border rounded p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="john@empresa.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-white/80">Mensaje</label>
                  <textarea 
                    required
                    id="message" 
                    rows={4}
                    className="w-full bg-input/50 border border-border rounded p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                    placeholder="Describe los requerimientos de tu proyecto..."
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded p-3 shadow-[0_0_15px_rgba(0,123,255,0.3)] hover:shadow-[0_0_25px_rgba(0,123,255,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Enviar Mensaje"
                  )}
                </button>
              </form>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-primary/20 bg-background pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold tracking-tight text-white">BlueStar Technology</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Todos los derechos reservados © {new Date().getFullYear()}
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <main className="bg-background text-foreground min-h-screen font-sans selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <Services />
      <Products />
      <About />
      <Technologies />
      <Stats />
      <Contact />
      <Footer />
    </main>
  );
}
