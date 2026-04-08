// Insurance/privacy note screen showing 4 mobile app screenshots with navigation indicators
const insuranceImages = [
  { src: "/figmaAssets/insurance.png", alt: "Insurance" },
  { src: "/figmaAssets/insurance-1.png", alt: "Insurance" },
  { src: "/figmaAssets/insurance-2.png", alt: "Insurance" },
  { src: "/figmaAssets/insurance-3.png", alt: "Insurance" },
];

// Progress indicator dots data: index 1 is active (green), rest are inactive
const progressDots = [
  { bg: "bg-neutral-300" },
  { bg: "bg-green-400" },
  { bg: "bg-neutral-300" },
  { bg: "bg-neutral-300" },
];

export const PrivacyNote = (): JSX.Element => {
  return (
    <div className="relative flex flex-col h-[1080px] w-full items-center justify-between px-[100px] py-10 bg-white overflow-hidden">
      {/* Top header bar */}
      <div className="relative self-stretch w-full h-6 flex items-center">
        <span className="absolute top-1.5 left-0 w-[137px] [font-family:'Basis_Grotesque_Pro-Regular',Helvetica] font-normal text-black text-xs tracking-[-0.12px] leading-3">
          Betterfly x Metalab
        </span>

        <span className="absolute top-1.5 left-[460px] w-[291px] [font-family:'Basis_Grotesque_Pro-Regular',Helvetica] font-normal text-black text-xs tracking-[-0.12px] leading-3">
          Work Shares
        </span>

        <span className="absolute top-1.5 left-[920px] w-[291px] [font-family:'Basis_Grotesque_Pro-Regular',Helvetica] font-normal text-black text-xs tracking-[-0.12px] leading-3">
          Jan 2026
        </span>

        <img
          className="absolute top-0 right-0 w-6 h-6"
          alt="Star symbol"
          src="/figmaAssets/star-symbol.svg"
        />
      </div>

      {/* Four mobile app screenshots */}
      <div className="inline-flex items-center gap-[52px] flex-[0_0_auto]">
        {insuranceImages.map((image, index) => (
          <img
            key={index}
            className="w-[393px] h-[852px]"
            alt={image.alt}
            src={image.src}
          />
        ))}
      </div>

      {/* Bottom bar: title + progress indicators */}
      <div className="flex items-center justify-between px-3 py-0 self-stretch w-full flex-[0_0_auto]">
        <p className="w-[364.63px] mt-[-1.00px] [font-family:'Basis_Grotesque_Pro-Regular',Helvetica] font-normal text-black text-2xl tracking-[-0.24px] leading-[30.7px]">
          Privacy Note + Benefits
        </p>

        <div className="inline-flex items-center gap-1.5 flex-[0_0_auto]">
          {progressDots.map((dot, index) => (
            <div
              key={index}
              className={`${dot.bg} w-16 h-1.5 rounded-[100px]`}
            />
          ))}
        </div>
      </div>

      {/* "Optional" badge — positioned over the first phone image */}
      <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 absolute top-[calc(50.00%_-_338px)] left-[51px] bg-yellow-400 rounded-[100px]">
        <span className="w-fit mt-[-1.00px] [font-family:'Basis_Grotesque_Pro-Regular',Helvetica] font-normal text-green-950 text-lg tracking-[0] leading-[23.0px] whitespace-nowrap">
          Optional
        </span>
      </div>
    </div>
  );
};
