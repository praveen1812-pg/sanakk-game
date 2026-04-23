import React, { useState, useCallback, useEffect } from 'react';
import { useInterval } from '../hooks/useInterval';
import { Trophy, RefreshCw, Gamepad2 } from 'lucide-react';
import { motion } from 'motion/react';

const GRID_SIZE = 20;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

const getRandomFoodPosition = (snake: Point[]): Point => {
  let newFood: Point = { x: 0, y: 0 };
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const isOnSnake = snake.some(s => s.x === newFood.x && s.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
};

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 }); // default start
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Speed logic: speed increases (interval decreases) as score goes up
  const currentSpeed = Math.max(50, INITIAL_SPEED - score * 3);

  useEffect(() => {
    setFood(getRandomFoodPosition(INITIAL_SNAKE));
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !hasStarted) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(getRandomFoodPosition(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, hasStarted]);

  useInterval(moveSnake, (gameOver || isPaused || !hasStarted) ? null : currentSpeed);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted) {
        setIsPaused((p) => !p);
        return;
      }

      if (!hasStarted && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        setHasStarted(true);
      }

      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      setDirection((prev) => {
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            return prev === 'DOWN' ? prev : 'UP';
          case 'ArrowDown':
          case 's':
          case 'S':
            return prev === 'UP' ? prev : 'DOWN';
          case 'ArrowLeft':
          case 'a':
          case 'A':
            return prev === 'RIGHT' ? prev : 'LEFT';
          case 'ArrowRight':
          case 'd':
          case 'D':
            return prev === 'LEFT' ? prev : 'RIGHT';
          default:
            return prev;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setHasStarted(false);
    setFood(getRandomFoodPosition(INITIAL_SNAKE));
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-2xl">
      
      <div className="z-10 flex items-center justify-between w-full max-w-[480px] mb-8">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-neon-green" />
          <h2 className="text-xl font-display font-black tracking-widest text-neon-cyan [text-shadow:0_0_10px_rgba(0,255,255,0.7)]">SNAKE.SYS</h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase text-white/30 tracking-widest mb-1">Active Session</div>
          <div className="text-4xl font-black font-display text-white">{score.toString().padStart(5, '0')}</div>
        </div>
      </div>

      <div 
        className="z-10 relative bg-[#0a0a0a] border-2 border-neon-green shadow-[0_0_30px_rgba(0,255,0,0.15)]"
        style={{
          width: 480,
          height: 480,
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.05) 1px, transparent 1px)`,
            backgroundSize: `${480 / GRID_SIZE}px ${480 / GRID_SIZE}px`
          }}
        />

        {/* Snake rendering */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <motion.div
              key={`${segment.x}-${segment.y}-${index}`}
              className="absolute"
              style={{
                width: `${480 / GRID_SIZE}px`,
                height: `${480 / GRID_SIZE}px`,
                left: `${segment.x * (480 / GRID_SIZE)}px`,
                top: `${segment.y * (480 / GRID_SIZE)}px`,
                backgroundColor: isHead ? '#00ff00' : '#00cc00',
                boxShadow: isHead ? '0 0 15px #00ff00' : '0 0 5px #00cc00',
                borderRadius: isHead ? '2px' : '1px',
                opacity: isHead ? 1 : 0.8 - (index * 0.01),
              }}
              initial={false}
              animate={{
                left: `${segment.x * (480 / GRID_SIZE)}px`,
                top: `${segment.y * (480 / GRID_SIZE)}px`,
              }}
              transition={{ duration: 0.1, ease: 'linear' }}
            >
               {/* inner pixel gap border to match design requirement somewhat */}
               <div className="w-full h-full border border-[rgba(0,255,0,0.05)]" />
            </motion.div>
          );
        })}

        {/* Food rendering */}
        <motion.div
          className="absolute bg-neon-pink shadow-[0_0_15px_#ff00ff] rounded-full"
          style={{
            width: `${480 / GRID_SIZE - 2}px`,
            height: `${480 / GRID_SIZE - 2}px`,
            left: `${food.x * (480 / GRID_SIZE) + 1}px`,
            top: `${food.y * (480 / GRID_SIZE) + 1}px`,
          }}
          animate={{
            scale: [0.8, 1, 0.8],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center">
            <p className="text-white font-mono mb-2 animate-pulse">PRESS ANY ARROW KEY TO START</p>
            <p className="text-zinc-500 font-mono text-sm uppercase">Spacebar to pause</p>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <p className="text-neon-cyan font-mono text-xl uppercase tracking-widest">PAUSED</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-md">
            <p className="text-neon-pink text-3xl font-bold mb-2 tracking-widest font-display uppercase [text-shadow:0_0_10px_rgba(255,0,255,0.7)]">SYSTEM FAILURE</p>
            <p className="text-white/60 font-mono mb-6">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-2 bg-transparent border border-neon-green text-neon-green font-mono uppercase hover:bg-neon-green/10 transition-colors shadow-[0_0_10px_rgba(0,255,0,0.3)]"
            >
              <RefreshCw className="w-4 h-4" />
              Reboot System
            </button>
          </div>
        )}
      </div>

      <div className="z-10 w-full max-w-[480px] mt-6 flex justify-between items-center text-[10px] font-mono text-white/40 uppercase tracking-widest">
        <span>LVL {(Math.floor(score / 50) + 1).toString().padStart(2, '0')}</span>
        <span>Latency {Math.floor(currentSpeed)}ms</span>
      </div>
    </div>
  );
};
