export default function Spinner() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="w-10 h-10 border-4 border-[#fc800a] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
