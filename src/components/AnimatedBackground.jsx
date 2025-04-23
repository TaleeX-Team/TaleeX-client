export const AnimatedBackground = () => {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2C] via-[#2A2F3C] to-[#1A1F2C] z-0">
            {/* Animated Mesh Grid Background - Subtle lines with glow */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(120,90,240,0.8)_0,_rgba(120,90,240,0)_60%)]"></div>
            <div className="absolute inset-0" style={{
                backgroundImage: "linear-gradient(to right, rgba(120, 90, 240, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(120, 90, 240, 0.1) 1px, transparent 1px)",
                backgroundSize: "60px 60px"
            }}></div>
        </div>
    );
};