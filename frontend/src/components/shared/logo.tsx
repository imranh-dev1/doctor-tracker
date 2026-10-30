import Image from "next/image";
import LogoImage from "../../../public/assest/logo.png";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-12 w-12 items-center justify-center">
        <Image
          src={LogoImage}
          fill
          sizes="100"
          loading="eager"
          alt="Doctor Tracker"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight">
          Doctor Tracker
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Care Operations
        </span>
      </span>
    </div>
  );
}
