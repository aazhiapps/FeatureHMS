import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface Molecule {
  id: number;
  x: number;
  y: number;
  type: 'oxygen' | 'hydrogen' | 'carbon' | 'nitrogen';
  size: number;
  rotation: number;
  bonds: number[];
}

interface FloatingMoleculeAnimationProps {
  isActive?: boolean;
}

export const FloatingMoleculeAnimation: React.FC<FloatingMoleculeAnimationProps> = ({ 
  isActive = true 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const moleculeTypes = {
    oxygen: { color: '#ef4444', symbol: 'O', size: 16 },
    hydrogen: { color: '#f3f4f6', symbol: 'H', size: 12 },
    carbon: { color: '#374151', symbol: 'C', size: 14 },
    nitrogen: { color: '#3b82f6', symbol: 'N', size: 15 }
  };

  const createMoleculeStructure = (centerX: number, centerY: number) => {
    // Create a simple molecule structure (like caffeine or dopamine)
    const newMolecules: Molecule[] = [
      // Central carbon ring
      { id: 1, x: centerX, y: centerY, type: 'carbon', size: 14, rotation: 0, bonds: [2, 6] },
      { id: 2, x: centerX + 30, y: centerY - 20, type: 'carbon', size: 14, rotation: 0, bonds: [1, 3] },
      { id: 3, x: centerX + 50, y: centerY + 10, type: 'nitrogen', size: 15, rotation: 0, bonds: [2, 4] },
      { id: 4, x: centerX + 30, y: centerY + 40, type: 'carbon', size: 14, rotation: 0, bonds: [3, 5] },
      { id: 5, x: centerX - 10, y: centerY + 40, type: 'carbon', size: 14, rotation: 0, bonds: [4, 6] },
      { id: 6, x: centerX - 30, y: centerY + 10, type: 'oxygen', size: 16, rotation: 0, bonds: [5, 1] },
      // Hydrogen atoms
      { id: 7, x: centerX + 70, y: centerY - 5, type: 'hydrogen', size: 12, rotation: 0, bonds: [3] },
      { id: 8, x: centerX + 45, y: centerY + 65, type: 'hydrogen', size: 12, rotation: 0, bonds: [4] },
      { id: 9, x: centerX - 25, y: centerY + 65, type: 'hydrogen', size: 12, rotation: 0, bonds: [5] },
    ];

    return newMolecules;
  };

  const animateMolecule = (moleculeData: Molecule[], clickX: number, clickY: number) => {
    if (!containerRef.current) return;

    // Create molecule elements
    const moleculeElements = moleculeData.map((mol) => {
      const element = document.createElement('div');
      element.className = 'absolute pointer-events-none z-50 flex items-center justify-center rounded-full font-bold text-xs shadow-lg';
      element.style.width = `${mol.size * 2}px`;
      element.style.height = `${mol.size * 2}px`;
      element.style.left = `${mol.x}px`;
      element.style.top = `${mol.y}px`;
      element.style.backgroundColor = moleculeTypes[mol.type].color;
      element.style.color = mol.type === 'hydrogen' ? '#000' : '#fff';
      element.style.transform = 'translate(-50%, -50%)';
      element.textContent = moleculeTypes[mol.type].symbol;
      
      // Add glow effect
      element.style.boxShadow = `0 0 20px ${moleculeTypes[mol.type].color}80`;
      
      containerRef.current?.appendChild(element);
      return { element, data: mol };
    });

    // Create bonds between molecules
    const bonds = moleculeData.flatMap((mol) => 
      mol.bonds.map((bondId) => {
        const targetMol = moleculeData.find(m => m.id === bondId);
        if (!targetMol) return null;
        
        const bond = document.createElement('div');
        bond.className = 'absolute pointer-events-none z-40';
        bond.style.height = '2px';
        bond.style.backgroundColor = '#94a3b8';
        bond.style.transformOrigin = 'left center';
        
        const dx = targetMol.x - mol.x;
        const dy = targetMol.y - mol.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        bond.style.width = `${length}px`;
        bond.style.left = `${mol.x}px`;
        bond.style.top = `${mol.y}px`;
        bond.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        
        containerRef.current?.appendChild(bond);
        return bond;
      }).filter(Boolean)
    );

    // Animate the molecule
    const tl = gsap.timeline({
      onComplete: () => {
        // Clean up
        moleculeElements.forEach(({ element }) => element.remove());
        bonds.forEach((bond) => bond?.remove());
      }
    });

    // Initial spawn animation
    tl.fromTo(
      moleculeElements.map(({ element }) => element),
      {
        scale: 0,
        opacity: 0,
        rotation: 'random(-180, 180)'
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.3,
        ease: 'back.out(1.7)',
        stagger: 0.05
      }
    );

    // Floating animation
    tl.to(
      moleculeElements.map(({ element }) => element),
      {
        y: 'random(-100, -200)',
        x: 'random(-50, 50)',
        rotation: 'random(-360, 360)',
        duration: 2.5,
        ease: 'power2.out',
        stagger: 0.02
      },
      0.3
    );

    // Rotate the entire molecule
    tl.to(
      containerRef.current,
      {
        rotation: 'random(-180, 180)',
        duration: 3,
        ease: 'power2.inOut'
      },
      0
    );

    // Fade out
    tl.to(
      moleculeElements.map(({ element }) => element),
      {
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        ease: 'power2.in',
        stagger: 0.02
      },
      2.5
    );

    // Animate bonds
    tl.fromTo(
      bonds,
      {
        opacity: 0,
        scaleX: 0
      },
      {
        opacity: 0.6,
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.out'
      },
      0.2
    );

    tl.to(
      bonds,
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      },
      2.5
    );

    timelineRef.current = tl;
  };

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      // Create random molecule structure at click position
      const moleculeStructure = createMoleculeStructure(clickX, clickY);
      animateMolecule(moleculeStructure, clickX, clickY);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ perspective: '1000px' }}
    />
  );
};

export default FloatingMoleculeAnimation;
