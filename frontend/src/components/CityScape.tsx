/** SVG night-city silhouette rendered as a fixed background layer */
export default function CityScape() {
  return (
    <svg
      viewBox="0 0 1440 260"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax slice"
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        width: '100%', height: 'auto',
        opacity: 0.55,
        pointerEvents: 'none',
      }}
    >
      <defs>
        {/* Building gradient */}
        <linearGradient id="bldg-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0d1828" />
          <stop offset="100%" stopColor="#060c18" />
        </linearGradient>
        {/* Horizon glow */}
        <linearGradient id="horizon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#00F2FE" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#00F2FE" stopOpacity="0" />
        </linearGradient>
        {/* Ground reflection */}
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#00F2FE" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#00F2FE" stopOpacity="0" />
        </linearGradient>
        <filter id="glow-f">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Horizon atmospheric glow */}
      <rect x="0" y="180" width="1440" height="80" fill="url(#horizon)" />

      {/* ── Far background buildings (dark, small) ── */}
      <g fill="#090f1c" opacity="0.8">
        <rect x="0"   y="210" width="30"  height="50" />
        <rect x="35"  y="200" width="20"  height="60" />
        <rect x="60"  y="215" width="25"  height="45" />
        <rect x="90"  y="195" width="40"  height="65" />
        <rect x="135" y="208" width="20"  height="52" />
        <rect x="160" y="200" width="35"  height="60" />
        <rect x="200" y="212" width="22"  height="48" />
        <rect x="228" y="198" width="30"  height="62" />
        <rect x="265" y="205" width="18"  height="55" />
        <rect x="290" y="195" width="28"  height="65" />
        <rect x="325" y="210" width="20"  height="50" />
        <rect x="350" y="200" width="35"  height="60" />
        <rect x="392" y="215" width="22"  height="45" />
        <rect x="420" y="198" width="30"  height="62" />
        <rect x="456" y="206" width="18"  height="54" />
        <rect x="480" y="193" width="25"  height="67" />
        <rect x="512" y="210" width="32"  height="50" />
        <rect x="550" y="200" width="20"  height="60" />
        <rect x="576" y="208" width="28"  height="52" />
        <rect x="610" y="195" width="35"  height="65" />
        <rect x="652" y="212" width="20"  height="48" />
        <rect x="678" y="198" width="30"  height="62" />
        <rect x="715" y="205" width="22"  height="55" />
        <rect x="742" y="193" width="28"  height="67" />
        <rect x="778" y="208" width="25"  height="52" />
        <rect x="810" y="196" width="35"  height="64" />
        <rect x="852" y="211" width="20"  height="49" />
        <rect x="878" y="200" width="30"  height="60" />
        <rect x="915" y="206" width="22"  height="54" />
        <rect x="943" y="195" width="28"  height="65" />
        <rect x="978" y="210" width="32"  height="50" />
        <rect x="1016" y="199" width="20" height="61" />
        <rect x="1042" y="207" width="28" height="53" />
        <rect x="1076" y="194" width="35" height="66" />
        <rect x="1118" y="210" width="20" height="50" />
        <rect x="1144" y="200" width="30" height="60" />
        <rect x="1180" y="206" width="22" height="54" />
        <rect x="1208" y="192" width="28" height="68" />
        <rect x="1244" y="209" width="32" height="51" />
        <rect x="1282" y="198" width="20" height="62" />
        <rect x="1308" y="207" width="28" height="53" />
        <rect x="1342" y="194" width="35" height="66" />
        <rect x="1384" y="210" width="30" height="50" />
        <rect x="1420" y="200" width="20" height="60" />
      </g>

      {/* ── Mid-ground buildings (medium, more detail) ── */}
      <g fill="url(#bldg-grad)">
        {/* Skyscraper cluster left */}
        <rect x="10"  y="150" width="50"  height="110" />
        <rect x="65"  y="130" width="40"  height="130" />  {/* Tall */}
        <rect x="108" y="165" width="35"  height="95"  />
        <rect x="148" y="140" width="55"  height="120" />
        <rect x="208" y="160" width="40"  height="100" />
        <rect x="253" y="145" width="30"  height="115" />
        <rect x="288" y="170" width="45"  height="90"  />

        {/* Center cluster — tallest buildings */}
        <rect x="350" y="100" width="55"  height="160" />  {/* Tower 1 */}
        <rect x="410" y="125" width="40"  height="135" />
        <rect x="455" y="85"  width="60"  height="175" />  {/* Tower 2 — tallest */}
        <rect x="520" y="110" width="45"  height="150" />
        <rect x="570" y="130" width="35"  height="130" />
        <rect x="612" y="95"  width="55"  height="165" />  {/* Tower 3 */}
        <rect x="672" y="120" width="42"  height="140" />
        <rect x="720" y="140" width="35"  height="120" />

        {/* Right cluster */}
        <rect x="780" y="155" width="50"  height="105" />
        <rect x="835" y="130" width="40"  height="130" />
        <rect x="880" y="110" width="55"  height="150" />
        <rect x="940" y="125" width="42"  height="135" />
        <rect x="988" y="145" width="35"  height="115" />
        <rect x="1030" y="100" width="60" height="160" />
        <rect x="1095" y="120" width="45" height="140" />
        <rect x="1145" y="140" width="35" height="120" />
        <rect x="1186" y="110" width="55" height="150" />
        <rect x="1246" y="130" width="42" height="130" />
        <rect x="1294" y="150" width="35" height="110" />
        <rect x="1335" y="120" width="50" height="140" />
        <rect x="1390" y="145" width="50" height="115" />
      </g>

      {/* ── Antenna / spires on tallest buildings ── */}
      <g stroke="#00F2FE" strokeWidth="1.5" opacity="0.4">
        <line x1="484" y1="85"  x2="484" y2="55"  />
        <line x1="638" y1="95"  x2="638" y2="62"  />
        <line x1="88"  y1="130" x2="88"  y2="105" />
        <line x1="1058" y1="100" x2="1058" y2="72" />
        <line x1="1212" y1="110" x2="1212" y2="82" />
        <line x1="378"  y1="100" x2="378"  y2="76" />
      </g>

      {/* ── Rooftop red safety lights ── */}
      <g filter="url(#glow-f)">
        <circle cx="484" cy="54"  r="2.5" fill="#FF4444" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="638" cy="61"  r="2.5" fill="#FF4444" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="88"  cy="104" r="2"   fill="#FF4444" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="1058" cy="71" r="2.5" fill="#FF4444" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="1212" cy="81" r="2.5" fill="#FF4444" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.9s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* ── Building windows (lit up) ── */}
      <g fill="#F5C842" opacity="0.55">
        {/* Tower at x=455 */}
        {[100,108,116,124,132,140,148,156,164,172,180,188,196,204,212,220].map((y,i) => (
          <rect key={`w1-${i}`} x={461 + (i%2)*12} y={y} width="5" height="4" opacity={Math.random()>0.3?1:0.1} />
        ))}
        {/* Tower at x=612 */}
        {[110,118,126,134,142,150,158,166,174,182,190,198,206,214].map((y,i) => (
          <rect key={`w2-${i}`} x={618 + (i%3)*10} y={y} width="4" height="3.5" opacity={Math.random()>0.35?1:0.05} />
        ))}
        {/* Tower at x=350 */}
        {[115,123,131,139,147,155,163,171,179,187,195,203].map((y,i) => (
          <rect key={`w3-${i}`} x={357 + (i%2)*14} y={y} width="4" height="3.5" opacity={Math.random()>0.4?1:0.08} />
        ))}
        {/* Mid-right towers */}
        {[120,128,136,144,152,160,168,176,184].map((y,i) => (
          <rect key={`w4-${i}`} x={1037 + (i%3)*11} y={y} width="4" height="3.5" opacity={Math.random()>0.3?1:0.1} />
        ))}
      </g>

      {/* ── Cyan accent windows (office lights) ── */}
      <g fill="#00F2FE" opacity="0.3">
        {[160,170,180,190,200,210,220,230].map((y,i) => (
          <rect key={`cw1-${i}`} x={72 + (i%2)*16} y={y} width="5" height="4" />
        ))}
        {[140,150,160,170,180,190,200].map((y,i) => (
          <rect key={`cw2-${i}`} x={895 + (i%2)*18} y={y} width="5" height="4" />
        ))}
      </g>

      {/* ── Neon signs on a few buildings ── */}
      <g filter="url(#glow-f)">
        <text x="462" y="240" fontFamily="monospace" fontSize="7" fill="#00F2FE" opacity="0.7">NEON</text>
        <text x="360" y="230" fontFamily="monospace" fontSize="6" fill="#7B61FF" opacity="0.7">RIDE</text>
        <text x="1040" y="235" fontFamily="monospace" fontSize="6" fill="#F5C842" opacity="0.6">LUXURY</text>
      </g>

      {/* ── Ground / street ── */}
      <rect x="0" y="255" width="1440" height="5" fill="url(#ground)" />
      <rect x="0" y="258" width="1440" height="2" fill="rgba(0,242,254,0.05)" />
    </svg>
  )
}
