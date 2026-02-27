# How to Export Your Spline Scene for Remotion

## Option 1: GLB Export (RECOMMENDED ✅)

1. In Spline, click **Export** (top right)
2. Select **3D Formats** → **GLB**
3. Download the `.glb` file
4. Place it in `public/scene.glb`
5. Code will automatically use the stable GLB loader

## Option 2: Simplify Spline Materials

If you want to keep using `.splinecode`:
1. In Spline, select all materials
2. Remove these expensive features:
   - Transmission
   - Clearcoat
   - Complex shaders
3. Re-export the `.splinecode` file

## Why GLB is Better

- ✅ Standard Three.js format
- ✅ No WebGL context loss
- ✅ Better performance
- ✅ Works reliably in Remotion
- ✅ Smaller file size

`.splinecode` uses custom Spline materials that are too complex for video rendering.
