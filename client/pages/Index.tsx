import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { LoadingScreen } from '../components/LoadingScreen';
import { MagneticButton, ParallaxText, RevealText, CursorFollower } from '../components/InteractiveElements';
import { SmoothScrollController } from '../components/SmoothScrollController';
import { ScrollDrivenEffects } from '../components/ScrollDrivenEffects';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!isLoading && heroRef.current && nameRef.current && titleRef.current) {
      const tl = gsap.timeline();
      
      gsap.set([nameRef.current, titleRef.current], { y: 100, opacity: 0 });
      
      tl.to(nameRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
      })
      .to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      }, "-=0.8");
    }
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <SmoothScrollController>
      <ScrollDrivenEffects>
        <div className="min-h-screen overflow-x-hidden">
          <CursorFollower />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center">
        <MagneticButton className="text-lg font-medium">
          Robin Payot
        </MagneticButton>
        <div className="flex space-x-8">
          <MagneticButton href="#work" className="hover:opacity-70 transition-opacity">
            Work
          </MagneticButton>
          <MagneticButton href="#about" className="hover:opacity-70 transition-opacity">
            About
          </MagneticButton>
          <MagneticButton href="#contact" className="hover:opacity-70 transition-opacity">
            Contact
          </MagneticButton>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={heroRef} className="flex items-center justify-center min-h-screen px-6 relative">
        <div className="text-center max-w-4xl">
          <ParallaxText speed={0.2}>
            <h1
              ref={nameRef}
              className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight mb-6 leading-none select-none"
            >
              Robin Payot
            </h1>
          </ParallaxText>
          <p
            ref={titleRef}
            className="text-xl md:text-2xl font-light text-gray-600 tracking-wide"
          >
            Creative Developer
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <MagneticButton href="#work" className="flex flex-col items-center text-sm text-gray-500 hover:text-black transition-colors">
            <div className="w-px h-12 bg-gray-300 mb-2"></div>
            Scroll
          </MagneticButton>
        </div>
      </div>

      {/* Work Section */}
      <section id="work" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <RevealText className="text-4xl md:text-6xl font-light mb-16 text-center">
            Selected Work
          </RevealText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {[
              {
                title: "Interactive Portfolio",
                year: "2023",
                image: "/placeholder.svg",
                description: "A dynamic portfolio showcasing creative development"
              },
              {
                title: "Motion Design",
                year: "2023",
                image: "/placeholder.svg",
                description: "Experimental animations and interactions"
              },
              {
                title: "3D Experience",
                year: "2023",
                image: "/placeholder.svg",
                description: "WebGL and Three.js experimentation"
              },
              {
                title: "Digital Art",
                year: "2023",
                image: "/placeholder.svg",
                description: "Creative coding and generative art"
              }
            ].map((project, index) => (
              <RevealText key={index} delay={index * 0.2}>
                <div
                  className="group cursor-pointer"
                  onMouseEnter={(e) => {
                    const follower = document.querySelector('.fixed.w-16.h-16') as HTMLElement;
                    if (follower) {
                      follower.style.opacity = '1';
                    }
                    gsap.to(`.project-${index}`, {
                      scale: 1.05,
                      duration: 0.6,
                      ease: "power2.out"
                    });
                    gsap.to(`.project-${index} img`, {
                      scale: 1.1,
                      duration: 0.6,
                      ease: "power2.out"
                    });
                  }}
                  onMouseLeave={() => {
                    const follower = document.querySelector('.fixed.w-16.h-16') as HTMLElement;
                    if (follower) {
                      follower.style.opacity = '0';
                    }
                    gsap.to(`.project-${index}`, {
                      scale: 1,
                      duration: 0.6,
                      ease: "power2.out"
                    });
                    gsap.to(`.project-${index} img`, {
                      scale: 1,
                      duration: 0.6,
                      ease: "power2.out"
                    });
                  }}
                >
                  <div className={`project-${index} aspect-video bg-gray-100 mb-4 overflow-hidden rounded-lg`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium mb-1 group-hover:translate-x-2 transition-transform duration-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{project.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">{project.year}</span>
                  </div>
                </div>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <RevealText>
            <h2 className="text-4xl md:text-6xl font-light mb-12">About</h2>
          </RevealText>
          <RevealText delay={0.2}>
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 mb-8">
              I'm a creative developer passionate about crafting exceptional digital experiences
              through innovative design and cutting-edge technology. My work spans interactive
              installations, web applications, and experimental interfaces.
            </p>
          </RevealText>
          <RevealText delay={0.4}>
            <p className="text-lg md:text-xl leading-relaxed text-gray-700">
              I specialize in GSAP animations, Three.js, WebGL, and modern web technologies
              to bring ideas to life with smooth interactions and engaging visuals.
            </p>
          </RevealText>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <RevealText>
            <h2 className="text-4xl md:text-6xl font-light mb-12">Let's Work Together</h2>
          </RevealText>
          <RevealText delay={0.2}>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-lg">
              <MagneticButton
                href="mailto:hello@robinpayot.com"
                className="hover:opacity-70 transition-opacity underline"
              >
                hello@robinpayot.com
              </MagneticButton>
              <span className="hidden md:block">•</span>
              <MagneticButton
                href="https://twitter.com/robinpayot"
                className="hover:opacity-70 transition-opacity"
              >
                Twitter
              </MagneticButton>
              <span className="hidden md:block">•</span>
              <MagneticButton
                href="https://instagram.com/robinpayot"
                className="hover:opacity-70 transition-opacity"
              >
                Instagram
              </MagneticButton>
            </div>
          </RevealText>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-500">
          <p>© 2024 Robin Payot</p>
          <p>Creative Developer</p>
        </div>
      </footer>
        </div>
      </ScrollDrivenEffects>
    </SmoothScrollController>
  );
}
