import ThreeDLogo from "@/components/ThreeDLogo";

const BrandingPanel = ({ headingRef }) => {
    return (
        <div className="hidden lg:flex flex-col items-center space-y-6 w-1/2 pr-12 mb-8 lg:mb-0 animate-fade-in">
            <div className="logo-container w-40 h-40 relative">
                <ThreeDLogo className="absolute inset-0" />
            </div>

            <div className="text-center space-y-4 max-w-md">
                <h1
                    ref={headingRef}
                    className="text-5xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 tracking-tight"
                >
                    TalentSync
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Smarter hiring starts here.
                </p>
                <div className="py-6">
                    <blockquote className="border-l-4 border-purple-500 pl-4 italic text-muted-foreground">
                        <p>"AI-driven insights that transform how you discover and connect with talent."</p>
                    </blockquote>
                </div>
                <div className="pt-8">
                    <div className="glass-card p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
                        <p className="text-sm font-medium mb-4">Trusted by innovative teams</p>
                        <div className="flex justify-center space-x-8 opacity-80">
                            {/* Company logos with hover effect */}
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/30"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandingPanel;