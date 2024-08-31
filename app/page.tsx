import Image from "next/image";
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="font-alata font-extrabold text-5xl text-fuchsia-600">StreamZone</div>
      <div>Your Stream, Your Zone</div>
      <div>
        <Image
          src="/live_image.jpg"
          alt="Description of the image"
          width={350}
          height={350}
        />
      </div>
      <div>
        <Button className="font-alata font-bold text-lg bg-fuchsia-600 mt-4">Go Live</Button>
      </div>
    </main>
  );
}
