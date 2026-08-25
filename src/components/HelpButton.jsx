function HelpButton() {
  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-neutral-800 transition-colors"
      aria-label="Ayuda"
    >
      <span className="text-xl font-bold">?</span>
    </button>
  )
}

export default HelpButton
