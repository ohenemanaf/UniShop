/**
 * File: GlobalLoader.jsx
 * Description: Auto-generated documentation for GlobalLoader.jsx
 * Date: 2026-07-21
 */
import { IconSparkles } from '@tabler/icons-react';
export default /**
 * Function GlobalLoader
 * @returns {any}
 */
function GlobalLoader() {
  return <div className="flex flex-col items-center justify-center h-screen w-screen bg-background text-primary">
      <div className="mb-4 animate-spin-slow">
        <IconSparkles size={48} className="text-primary" stroke={1.5} />
      </div>
      <h2 className="text-xl font-bold">Loading UniShop...</h2>
    </div>;
}