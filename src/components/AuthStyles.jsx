const AuthStyles = () => {
    return (
        <style jsx>{`
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(10px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes pulse-slow {
        0% { opacity: 0.15; }
        50% { opacity: 0.25; }
        100% { opacity: 0.15; }
      }
      
      .text-gradient {
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        background-image: linear-gradient(to right, #a78bfa, #ec4899, #a78bfa);
        background-size: 200% 200%;
        animation: gradient-shift 8s ease infinite;
      }
      
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .glass-card {
        backdrop-filter: blur(12px);
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }
    `}</style>
    );
};

export default AuthStyles;