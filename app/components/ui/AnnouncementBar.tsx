const MESSAGES = [
  'Easy Return',
  '24/7 Support',
  'Worldwide Shipping',
  'Free Returns Over $50',
  'Easy Return',
  '24/7 Support',
  'Worldwide Shipping',
  'Free Returns Over $50',
]

export function AnnouncementBar(): React.JSX.Element {
  const text = MESSAGES.join('  +  ')

  return (
    <div
      id="announcement-bar"
      className="bg-[#0D0D0D] text-[#C6FF3D] h-8 flex items-center overflow-hidden"
      aria-label="Store announcements"
    >
      <div className="marquee-track whitespace-nowrap">
        <span className="inline-block pr-24 text-[11px] font-[500] uppercase tracking-[0.5px]">
          {text}
        </span>
        <span
          className="inline-block pr-24 text-[11px] font-[500] uppercase tracking-[0.5px]"
          aria-hidden="true"
        >
          {text}
        </span>
      </div>
    </div>
  )
}
