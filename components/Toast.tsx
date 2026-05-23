"use client";

type ToastProps = {
  message: string;
  dark: boolean;
};

export default function Toast({ message, dark }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed right-5 top-[110px] z-[999] animate-[toastIn_0.25s_ease-out]">
      <div
        className={`rounded-2xl border px-5 py-4 text-sm font-black shadow-xl ${
          dark
            ? "border-white/10 bg-[#111] text-white"
            : "border-black/10 bg-white text-zinc-950"
        }`}
      >
        {message}
      </div>
    </div>
  );
}