// BackButton.tsx
import { useRouter } from "next/router";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    // If user is not on home page, go back to home
    if (router.pathname !== "/") {
      router.push("/"); // replace "/" with your first page route
    } else {
      router.back(); // optional: fallback to browser back if already on home
    }
  };

  return (
    <button
      onClick={handleBack}
      className="mt-0 w-34 h-12 rounded-2xl  bg-gray-500 text-white shadow-lg flex items-center justify-center  transition-colors"
      title="Go back"
    >
      🔙 Go back
    </button>
  );
}
