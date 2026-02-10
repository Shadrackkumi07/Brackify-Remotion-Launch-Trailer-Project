import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Img } from 'remotion';

export const Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const anim = spring({
        frame,
        fps,
        config: { styling: { mass: 2, damping: 200 } }
    });

    const scale = interpolate(anim, [0, 1], [0.9, 1]);
    const opacity = interpolate(frame, [0, 20], [0, 1]);

    const titleOpacity = interpolate(frame, [20, 50], [0, 1]);
    const buttonsOpacity = interpolate(frame, [50, 80], [0, 1]);
    const textBlur = interpolate(frame, [0, 30], [8, 0]);

    return (
        <AbsoluteFill className="bg-[#f7f5f2] flex items-center justify-center">
            {/* Milky background gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f9f6f0] to-[#f3efe8]" />
                <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-orange-200/40 to-green-200/30 rounded-full blur-[80px]" />
                <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-gradient-to-br from-amber-200/40 to-orange-200/30 rounded-full blur-[90px]" />
            </div>

            <div style={{ transform: `scale(${scale})`, opacity }} className="flex flex-col items-center relative z-10">
                {/* Logo */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-orange-400 blur-[70px] opacity-20 rounded-full" />
                    <Img 
                        src={staticFile("logo.png")} 
                        className="w-48 h-48 object-contain relative z-10 drop-shadow-2xl" 
                    />
                </div>
                
                {/* Text Reveal */}
                <h1 
                    style={{ opacity: titleOpacity, filter: `blur(${textBlur}px)` }}
                    className="text-[6rem] font-black text-slate-900 px-2 tracking-wide uppercase text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-green-600 mb-8 -mt-10 leading-tight"
                >
                    Available Now
                </h1>

                {/* Website CTA */}
                <p 
                    style={{ opacity: titleOpacity, filter: `blur(${textBlur}px)` }}
                    className="text-[3rem] font-bold text-slate-800 mb-12 tracking-wide"
                >
                    Visit brackify.gg
                </p>

                {/* Store Buttons */}
                <div 
                    style={{ 
                        opacity: buttonsOpacity,
                        filter: `blur(${textBlur}px)`
                    }}
                    className="flex items-center gap-16"
                >
                    <Img 
                        src={staticFile("ios.png")} 
                        className="h-56 w-auto object-contain"
                    />
                    <Img 
                        src={staticFile("android.png")} 
                        className="h-56 w-auto object-contain"
                    />
                </div>
            </div>
        </AbsoluteFill>
    );
};
