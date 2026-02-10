The Remotion Code-Gen Prompt
Role: You are a Senior Creative Developer specializing in Remotion, React, and Tailwind CSS. Goal: Build a high-energy, 1080x1920 (or 1920x1080) esports promo video in Remotion that mimics the "start.gg" aesthetic.

1. Visual Identity & Styling
Color Palette: Background is a textured Dark Grey (#0a0a0a). Primary accents are Electric Blue (#0070f3) and Neon Magenta (#ff0080).

The "Frame": Create a BorderFrame component. It should be a persistent overlay with L-shaped brackets in the corners. The top-left/bottom-right are Blue; the top-right/bottom-left are Magenta. Use spring animations to make them "pulse" or slightly expand.

UI Elements: Use Tailwind to create "Glassmorphism" cards. High corner radius (12px), subtle borders, and 3D transforms. Use transform: perspective(1000px) rotateY(-15deg) for a sleek isometric look.

2. Scene Architecture (The Timeline)
Divide the composition into the following sequenced Series.Sequence blocks:

Intro (0-1s): Centered "start.gg" logo with a "glitch" and "scale-up" entrance using spring.

The "Livestream" UI (1-3s): A dashboard view featuring a grid of video thumbnails. Include a "Live" badge with a red pulsing dot.

The "Kinetic Typography" (3-4s): A full-screen flash of the word "COMPETE" in massive bold sans-serif. The text should "mask-reveal" from the center.

The "Tournament Bracket" (4-6s): A complex SVG-based tournament tree. Use interpolate to animate the "path" lines connecting the winners.

The "Organize" UI (6-8s): A split-screen showing a code editor (Markdown) on the right and a rendered preview on the left.

Outro (8-10s): The logo returns with the corner brackets closing in to "lock" the frame.

3. Motion Requirements (The "Math")
Interpolation: Use interpolate with Extrapolate.clamp for all transitions.

Camera Movement: Implement a "Pseudo-3D Camera." Instead of flat cuts, use a Spring driven scale and translateY to create a "zoom-through" effect between sequences.

Smoothness: Use spring(frame, fps, { stiffness: 100, damping: 10 }) for all UI movements to ensure they feel organic, not linear.

4. Technical Implementation Details
Project Structure: Create separate components for Bracket, DashboardCard, NeonFrame, and KineticText.

Assets: Use placeholders like staticFile("gameplay.mp4") for video backgrounds and Img for thumbnails.

Composition: Set the durationInFrames to 300 (10 seconds at 30fps).

Task: Please write the complete Composition.tsx and the core sub-components. Ensure the code is clean, typed with TypeScript, and uses Tailwind CSS for all styling.

Pro-Tips for using this with the AI:
Run in Iterations: Don't ask for the whole 10 seconds at once if the AI has a token limit. Ask for the "Base Setup and Neon Frame" first, then the "Kinetic Typography Engine," then the "UI Dashboard."

The "Spring" Factor: Remotion looks "cheap" if you use linear motion. Explicitly tell the AI: "Use the spring function for every entrance animation, never use a simple linear frame / duration calculation."

Video Backgrounds: In Remotion, you'll need the <OffthreadVideo /> tag for those gameplay clips. Make sure the AI includes that, or the preview will be very laggy.
 I like the fact that they will be a button gesture doing the clicing and zooming and interacting effects