"use client";

import { Terminal } from "@/components/ui/terminal";

export function HeroCodeTerminal() {
  return (
    <div className="w-full sm:w-[480px] lg:w-[420px] xl:w-[480px] shrink-0">
      <Terminal
        commands={["whoami", "cat developer.config.json"]}
        outputs={{
          0: ["➜ Imran Hasan — Full Stack Software Engineer"],
          1: [
            "{",
            '  "role": "Full Stack Developer",',
            '  "location": "Dhaka, Bangladesh",',
            '  "stack": ["Next.js 16", "React 19", "Node.js", "TypeScript"],',
            '  "status": "🟢 Available for Projects"',
            "}",
          ],
        }}
        typingSpeed={45}
        delayBetweenCommands={1000}
      />
    </div>
  );
}
