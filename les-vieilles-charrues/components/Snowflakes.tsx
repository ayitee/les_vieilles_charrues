'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  driftDirection: number; // -1 for left, 1 for right
  createdAt: number; // Timestamp when snowflake was created
}

export default function Snowflakes() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    // Spawn new snowflakes every 300ms
    const spawnInterval = setInterval(() => {
      const newSnowflake: Snowflake = {
        id: nextId,
        left: Math.random() * 100, // Random position 0-100%
        size: Math.random() * 6 + 5, // 5-11px
        duration: 10, // hard limit: die after 10s
        driftDirection: Math.random() > 0.5 ? 1 : -1, // Random left or right
        createdAt: Date.now(),
      };

      setSnowflakes((prev) => [...prev, newSnowflake]);
      setNextId((prev) => prev + 1);
    }, 300);

    return () => clearInterval(spawnInterval);
  }, [nextId]);

  useEffect(() => {
    // Clean up snowflakes that have finished their animation
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setSnowflakes((prev) =>
        prev.filter((snowflake) => {
          // Remove after 10s (plus tiny buffer for animation end)
          const ageInSeconds = (now - snowflake.createdAt) / 1000;
          return ageInSeconds < 10.2;
        })
      );
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <>
      {snowflakes.map((snowflake) => (
        <div
          key={snowflake.id}
          className="snowflake-dynamic"
          style={{
            left: `${snowflake.left}%`,
            width: `${snowflake.size}px`,
            height: `${snowflake.size}px`,
            animationDuration: `${snowflake.duration}s`,
            '--drift-direction': snowflake.driftDirection,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}
