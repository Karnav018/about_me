export default function Logo({ size = 30 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Karnav Prajapati"
      role="img"
    >
      <rect width="32" height="32" fill="#211C16" />
      <text
        x="7"
        y="23"
        fontFamily="'Newsreader', Georgia, serif"
        fontWeight="500"
        fontSize="20"
        fill="#F3EDE3"
      >K</text>
      <text
        x="18.5"
        y="23"
        fontFamily="'Newsreader', Georgia, serif"
        fontStyle="italic"
        fontWeight="400"
        fontSize="20"
        fill="#F3EDE3"
      >p</text>
      <circle cx="26.5" cy="5.5" r="2.6" fill="#ff4800" />
    </svg>
  )
}
