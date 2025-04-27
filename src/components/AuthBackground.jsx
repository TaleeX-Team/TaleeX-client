const AuthBackground = () => {
    return (
        <>
            {/* Animated Background Gradient with improved visuals */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2C] via-[#2A2F3C] to-[#1A1F2C] z-0">
                {/* Enhanced animated mesh grid with subtle pulse effect */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(120,90,240,0.8)_0,_rgba(120,90,240,0)_60%)] animate-pulse-slow"></div>
                <div className="absolute inset-0" style={{
                    backgroundImage: "linear-gradient(to right, rgba(120, 90, 240, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(120, 90, 240, 0.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px"
                }}></div>
                {/* Additional floating particles for visual depth */}
                <div className="particle-container absolute inset-0 overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-purple-400/30"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`
                            }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default AuthBackground;
