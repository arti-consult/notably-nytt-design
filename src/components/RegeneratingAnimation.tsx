import { motion } from 'framer-motion';
import { Sparkles, Wand2, Stars, Zap } from 'lucide-react';

export default function RegeneratingAnimation() {
  return (
    <div className="text-center py-16 px-4">
      <div className="relative inline-block">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 -m-8"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="relative w-32 h-32">
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <motion.div
                key={angle}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                style={{
                  left: `${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`,
                  top: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: angle / 180,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Middle pulsing circle */}
        <motion.div
          className="absolute inset-0 -m-4"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-fuchsia-200" />
        </motion.div>

        {/* Center icon container with gradient */}
        <motion.div
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#2C64E3] via-[#5A8DF8] to-[#B370FF] flex items-center justify-center shadow-2xl"
          animate={{
            boxShadow: [
              '0 10px 40px rgba(44, 100, 227, 0.3)',
              '0 10px 60px rgba(179, 112, 255, 0.5)',
              '0 10px 40px rgba(44, 100, 227, 0.3)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Rotating inner sparkles */}
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>
        </motion.div>

        {/* Floating sparkle particles */}
        {[
          { icon: Sparkles, delay: 0, duration: 3, x: -40, y: -40 },
          { icon: Stars, delay: 0.5, duration: 3.5, x: 40, y: -30 },
          { icon: Zap, delay: 1, duration: 3.2, x: 45, y: 30 },
          { icon: Wand2, delay: 1.5, duration: 3.8, x: -35, y: 35 },
        ].map((particle, index) => {
          const Icon = particle.icon;
          return (
            <motion.div
              key={index}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, particle.x, 0],
                y: [0, particle.y, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0.8, 1, 0],
                scale: [0, 1, 1.2, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut"
              }}
            >
              <Icon className="h-5 w-5 text-fuchsia-400" />
            </motion.div>
          );
        })}
      </div>

      {/* Text animations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <motion.h3
          className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#2C64E3] to-[#B370FF] bg-clip-text text-transparent"
          animate={{
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Genererer nytt referat...
        </motion.h3>

        <motion.p
          className="text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          AI-en analyserer møtet og lager et skreddersydd referat
        </motion.p>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Background shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-30 pointer-events-none"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          maskImage: 'radial-gradient(circle, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, black, transparent 70%)',
        }}
      />
    </div>
  );
}
