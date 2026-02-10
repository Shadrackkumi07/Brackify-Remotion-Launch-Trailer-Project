import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Img } from 'remotion';

export const LogoIntro: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// Detect mobile (portrait) mode
	const isMobile = height > width;

	const anim = spring({
		frame,
		fps,
		config: { styling: { mass: 2, damping: 200 } }
	});

	const scale = interpolate(anim, [0, 1], [0.9, 1]);
	const opacity = interpolate(frame, [0, 20], [0, 1]);
	const textBlur = interpolate(frame, [0, 20], [8, 0]);
	
	return (
		<AbsoluteFill className="bg-[#f7f5f2] flex items-center justify-center">
			{/* Milky background gradient */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute inset-0 bg-gradient-to-br from-white via-[#f9f6f0] to-[#f3efe8]" />
				<div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-orange-200/40 to-green-200/30 rounded-full blur-[80px]" />
				<div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-gradient-to-br from-amber-200/40 to-orange-200/30 rounded-full blur-[90px]" />
			</div>
			
			<div style={{ transform: `scale(${scale})`, opacity }} className="flex flex-col items-center">
				{/* Logo */}
				<div className="relative mb-8">
					<div className="absolute inset-0 bg-orange-500 blur-[80px] opacity-30 rounded-full" />
					<Img 
						src={staticFile("logo.png")} 
						className={isMobile ? "w-72 h-72 object-contain relative z-10 drop-shadow-2xl" : "w-96 h-96 object-contain relative z-10 drop-shadow-2xl"}
					/>
				</div>
				
				{/* Text Reveal - Centered properly for mobile */}
				<p 
					style={{ 
						opacity: interpolate(frame, [20, 40], [0, 1]), 
						filter: `blur(${textBlur}px)`,
						textAlign: 'center',
						padding: isMobile ? '0 24px' : '0',
						maxWidth: isMobile ? '100%' : 'none',
					}}
					className={isMobile 
						? "text-3xl text-slate-900 font-black -mt-12 tracking-wider uppercase mb-12 leading-tight"
						: "text-5xl text-slate-900 font-black -mt-20 tracking-widest uppercase mb-16"
					}
				>
					Everything Competitive.{isMobile ? <br /> : ' '}One Platform.
				</p>

				{/* Store Buttons */}
				<div 
					style={{ 
						opacity: interpolate(frame, [40, 70], [0, 1]),
						filter: `blur(${textBlur}px)`
					}}
					className={isMobile ? "flex items-center gap-8" : "flex items-center gap-16"}
				>
					<Img 
						src={staticFile("ios.png")} 
						className={isMobile ? "h-40 w-auto object-contain" : "h-56 w-auto object-contain"}
					/>
					<Img 
						src={staticFile("android.png")} 
						className={isMobile ? "h-40 w-auto object-contain" : "h-56 w-auto object-contain"}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
