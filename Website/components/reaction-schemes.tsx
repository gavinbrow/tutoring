/** Hand-placed skeletal drawings for the worked examples. Black is the printed question; `pen` is the tutor’s working. */

const hashedBonds = [
  [190.1, 118.2, 187.1, 117.6], [189.6, 125.2, 185.4, 124.4], [189, 132.2, 183.6, 131.2],
  [188.4, 139.2, 181.8, 138], [187.7, 146.2, 180.1, 144.8], [187.1, 153.2, 178.3, 151.6],
  [472.9, 117.6, 469.9, 118.2], [474.6, 124.4, 470.4, 125.2], [476.4, 131.2, 471, 132.2],
  [478.2, 138, 471.6, 139.2], [479.9, 144.8, 472.3, 146.2], [481.7, 151.6, 472.9, 153.2],
];

export function SubstitutionScheme() {
  return (
    <svg viewBox="50 44 580 166" role="img" aria-label="Cyanide attacks (R)-2-bromobutane from the side opposite bromine, giving (S)-2-methylbutanenitrile and bromide">
      <g className="ink">
        <path d="M75 106H90M75 110H90M75 114H90" />
        <path d="M190 110H232M190 110L179.6 71.2" />
        <path d="M294 110H366" />
        <path d="M404 106H419M404 110H419M404 114H419" />
        <path d="M437 110H470M470 110L480.4 71.2" />
      </g>
      <g className="hash">
        {hashedBonds.map(([x1, y1, x2, y2]) => <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />)}
        <circle cx="113" cy="94.5" r="5" />
        <path d="M110.4 94.5H115.6" />
      </g>
      <g className="solid">
        <polygon points="190,110 156.2,138.4 151.6,131.8" />
        <polygon points="470,110 503.8,138.4 508.4,131.8" />
        <polygon points="374,110 364,106.2 364,113.8" />
        <circle cx="110" cy="106.5" r="1.5" />
        <circle cx="110" cy="113.5" r="1.5" />
      </g>
      <g fontSize="17">
        <text x="66" y="116" textAnchor="middle">N</text>
        <text x="99" y="116" textAnchor="middle">C</text>
        <text x="177.5" y="66" textAnchor="middle">H</text>
        <text x="149" y="142.5" textAnchor="end">H<tspan dy="4" fontSize="11.5">3</tspan><tspan dy="-4">C</tspan></text>
        <text x="176.5" y="171">CH<tspan dy="4" fontSize="11.5">2</tspan><tspan dy="-4">CH</tspan><tspan dy="4" fontSize="11.5">3</tspan></text>
        <text x="236" y="116">Br</text>
        <text x="395" y="116" textAnchor="middle">N</text>
        <text x="428" y="116" textAnchor="middle">C</text>
        <text x="482.5" y="66" textAnchor="middle">H</text>
        <text x="511" y="142.5">CH<tspan dy="4" fontSize="11.5">3</tspan></text>
        <text x="471" y="171">CH<tspan dy="4" fontSize="11.5">2</tspan><tspan dy="-4">CH</tspan><tspan dy="4" fontSize="11.5">3</tspan></text>
        <text x="566" y="116" textAnchor="middle">+</text>
        <text x="582" y="116">Br<tspan dy="-7" fontSize="12">−</tspan></text>
      </g>
      <g fontSize="13.5" textAnchor="middle">
        <text x="332" y="102">NaCN</text>
        <text x="332" y="127">DMSO</text>
      </g>
      <g className="pen">
        <path d="M115 109.5Q148 91 174.9 104.1" />
        <path d="M211 108Q220 82 238.5 93" />
      </g>
      <g className="pen-solid">
        <polygon points="183,108 173.4,107.2 176.4,101" />
        <polygon points="246.2,97.6 236.7,96 240.3,90" />
      </g>
      <g className="callout">
        <circle cx="146" cy="84" r="8" />
        <text x="146" y="88">1</text>
        <circle cx="224" cy="74" r="8" />
        <text x="224" y="78">2</text>
      </g>
      <text className="name" x="190" y="200">(<tspan fontStyle="italic">R</tspan>)-2-bromobutane</text>
      <text className="name pen-text" x="466" y="200">(<tspan fontStyle="italic">S</tspan>)-2-methylbutanenitrile</text>
    </svg>
  );
}

export function SynthesisScheme() {
  return (
    <svg viewBox="0 8 456 72" role="img" aria-label="trans-2-Butene is hydrated with water and sulfuric acid to 2-butanol, which is oxidized with PCC to 2-butanone">
      <g className="ink">
        <polyline points="10,69 34,55 58,69 82,55" />
        <path d="M38.6 53L57.4 64" />
        <polyline points="374,69 398,55 422,69 446,55" />
        <path d="M396.2 53.5V32M399.8 53.5V32" />
      </g>
      <g className="pen">
        <path d="M98 62H168M280 62H350" />
        <polyline points="192,69 216,55 240,69 264,55" />
        <path d="M216 55V33" />
      </g>
      <g className="pen-solid">
        <polygon points="176,62 167,58.6 167,65.4" />
        <polygon points="358,62 349,58.6 349,65.4" />
      </g>
      <g className="pen-text" fontSize="12.5" textAnchor="middle">
        <text x="137" y="52">H<tspan dy="3" fontSize="9">2</tspan><tspan dy="-3">O, H</tspan><tspan dy="3" fontSize="9">2</tspan><tspan dy="-3">SO</tspan><tspan dy="3" fontSize="9">4</tspan></text>
        <text x="319" y="52">PCC, CH<tspan dy="3" fontSize="9">2</tspan><tspan dy="-3">Cl</tspan><tspan dy="3" fontSize="9">2</tspan></text>
      </g>
      <text className="pen-text" x="210.2" y="28" fontSize="15">OH</text>
      <text x="398" y="27" fontSize="15" textAnchor="middle">O</text>
    </svg>
  );
}
