import Image from "next/image";
// import { Button } from "@/components/ui/button"

export default function Home() {
  return (
  <div>
    <Image src="/logo.svg" width={50} height={50} alt="logo"/>
    <p className="font-semibold text-xl tracking-tight">
      ZenTube 
   </p>
  </div>
  );
}
