import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const ThreeDLogo = ({ className }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(200, 200);
        containerRef.current.appendChild(renderer.domElement);

        // Create color that matches our theme
        const getThemeColor = () => {
            const isDark = document.documentElement.classList.contains('dark');
            // Light theme: vibrant purple | Dark theme: brighter purple
            return isDark ? 0x9D5CFF : 0x8A51FF;
        };

        // Add a floating cube as a logo placeholder
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const edges = new THREE.EdgesGeometry(geometry);
        const lineColor = getThemeColor();
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: lineColor })
        );

        // Add inner cube for effect
        const innerGeometry = new THREE.BoxGeometry(1, 1, 1);
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: lineColor,
            transparent: true,
            opacity: 0.2
        });
        const cube = new THREE.Mesh(innerGeometry, innerMaterial);

        scene.add(line);
        scene.add(cube);

        // Position camera
        camera.position.z = 5;

        // Animation with GSAP
        gsap.to(line.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 2,
            duration: 8,
            repeat: -1,
            ease: "none"
        });

        gsap.to(cube.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 2,
            duration: 10,
            repeat: -1,
            ease: "none"
        });

        gsap.to(cube.position, {
            y: 0.2,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });

        // Add subtle pulsing effect to the inner cube
        gsap.to(innerMaterial, {
            opacity: 0.4,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Theme change detection
        const handleThemeChange = () => {
            const newColor = getThemeColor();
            line.material.color.set(newColor);
            innerMaterial.color.set(newColor);
        };

        // Listen for theme changes
        const themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    handleThemeChange();
                }
            });
        });

        themeObserver.observe(document.documentElement, { attributes: true });

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            themeObserver.disconnect();
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            scene.remove(line);
            scene.remove(cube);
            geometry.dispose();
            edges.dispose();
            innerGeometry.dispose();
            innerMaterial.dispose();
        };
    }, []);

    return <div ref={containerRef} className={`${className} purple-glow`} />;
};

export default ThreeDLogo;