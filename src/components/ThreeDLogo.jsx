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

        // Add a floating cube as a logo placeholder
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x8B5CF6 })
        );

        // Add inner cube for effect
        const innerGeometry = new THREE.BoxGeometry(1, 1, 1);
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: 0x8B5CF6,
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
        })

        gsap.to(cube.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 2,
            duration: 10,
            repeat: -1,
            ease: "none"
        })

        gsap.to(cube.position, {
            y: 0.2,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        })

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
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

    return <div ref={containerRef} className={className} />;
};

export default ThreeDLogo;