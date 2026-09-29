from pathlib import Path

DIR = Path(__file__).resolve().parent.parent / "assets" / "products"
DIR.mkdir(parents=True, exist_ok=True)

def svg(bg, inner):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800">
  <rect width="400" height="400" fill="{bg}"/>
  <circle cx="200" cy="210" r="120" fill="#ffffff" opacity=".45"/>
  {inner}
</svg>'''

files = {
  "nasi-goreng.svg": svg("#F8E7D4", '<ellipse cx="200" cy="258" rx="132" ry="28" fill="#E8E5E0"/><ellipse cx="200" cy="228" rx="118" ry="70" fill="#E0A050"/><ellipse cx="200" cy="210" rx="100" ry="52" fill="#C45C26"/><circle cx="168" cy="198" r="18" fill="#F4E1B5"/><circle cx="230" cy="205" r="10" fill="#2E7D32"/><circle cx="210" cy="188" r="8" fill="#E53935"/>'),
  "mie-goreng.svg": svg("#FFF3D6", '<ellipse cx="200" cy="258" rx="125" ry="26" fill="#E8E5E0"/><path d="M90 210c40-50 80 20 120-10 40-30 80 10 110-8" fill="none" stroke="#E09B2D" stroke-width="16" stroke-linecap="round"/><path d="M100 230c50-20 70 30 120 4 40-20 70 16 90-4" fill="none" stroke="#C67A12" stroke-width="14" stroke-linecap="round"/><circle cx="250" cy="200" r="16" fill="#E53935"/>'),
  "nasi-ayam.svg": svg("#F3EDE3", '<ellipse cx="200" cy="258" rx="130" ry="28" fill="#E8E5E0"/><ellipse cx="200" cy="220" rx="110" ry="70" fill="#F4E7C3"/><ellipse cx="150" cy="210" rx="40" ry="28" fill="#fff"/><path d="M210 185c40-10 70 20 62 48-18 22-70 18-78-6-6-18 4-36 16-42z" fill="#C47A3A"/>'),
  "ayam-geprek.svg": svg("#FBE3D4", '<ellipse cx="200" cy="258" rx="125" ry="26" fill="#E8E5E0"/><ellipse cx="200" cy="222" rx="100" ry="58" fill="#F4E7C3"/><path d="M140 200c20-40 90-48 120-10 18 24 8 58-22 70-48 18-90-10-98-32z" fill="#C47A3A"/>'),
  "soto-ayam.svg": svg("#FFF6E0", '<ellipse cx="200" cy="258" rx="130" ry="24" fill="#E8E5E0"/><ellipse cx="200" cy="218" rx="112" ry="68" fill="#F2C14E"/><ellipse cx="200" cy="210" rx="92" ry="48" fill="#F6D36A"/><circle cx="170" cy="205" r="16" fill="#fff"/><circle cx="220" cy="214" r="12" fill="#C47A3A"/>'),
  "nasi-uduk.svg": svg("#EEE6DA", '<ellipse cx="200" cy="258" rx="125" ry="24" fill="#E8E5E0"/><ellipse cx="200" cy="218" rx="108" ry="64" fill="#F7F1E4"/><ellipse cx="200" cy="208" rx="86" ry="44" fill="#EFE4CF"/><rect x="250" y="188" width="36" height="50" rx="8" fill="#C47A3A"/><circle cx="160" cy="210" r="14" fill="#E53935"/>'),
  "bakso.svg": svg("#F4EFE8", '<ellipse cx="200" cy="258" rx="125" ry="24" fill="#E8E5E0"/><ellipse cx="200" cy="220" rx="115" ry="62" fill="#E8C48A"/><circle cx="165" cy="210" r="28" fill="#6D4C41"/><circle cx="210" cy="200" r="24" fill="#5D4037"/><circle cx="230" cy="226" r="20" fill="#6D4C41"/>'),
  "gado-gado.svg": svg("#EAF3E4", '<ellipse cx="200" cy="258" rx="125" ry="24" fill="#E8E5E0"/><ellipse cx="200" cy="220" rx="110" ry="64" fill="#F4E7C3"/><circle cx="160" cy="205" r="18" fill="#2E7D32"/><circle cx="200" cy="198" r="16" fill="#F9A825"/><circle cx="236" cy="212" r="18" fill="#E53935"/><ellipse cx="190" cy="230" rx="40" ry="14" fill="#C45C26"/>'),
  "nasi-kuning.svg": svg("#FFF6D4", '<ellipse cx="200" cy="258" rx="125" ry="24" fill="#E8E5E0"/><ellipse cx="200" cy="218" rx="110" ry="64" fill="#F6D36A"/><ellipse cx="200" cy="208" rx="86" ry="44" fill="#FFC107"/><circle cx="250" cy="200" r="16" fill="#E53935"/><rect x="140" y="200" width="28" height="36" rx="6" fill="#C47A3A"/>'),
  "mie-ayam.svg": svg("#FFF4E5", '<ellipse cx="200" cy="258" rx="125" ry="24" fill="#E8E5E0"/><ellipse cx="200" cy="218" rx="112" ry="64" fill="#F0D5A0"/><path d="M100 210c40-30 70 20 110 0 36-18 70 12 90 0" fill="none" stroke="#E0A050" stroke-width="12" stroke-linecap="round"/><path d="M210 175c36-4 58 24 48 48-22 8-52 4-62-16z" fill="#C47A3A"/>'),
  "es-teh.svg": svg("#F6EFE4", '<rect x="145" y="90" width="110" height="180" rx="18" fill="#C48A4A"/><rect x="155" y="102" width="90" height="150" rx="12" fill="#A56B32"/><rect x="145" y="88" width="110" height="22" rx="8" fill="#E8E5E0"/>'),
  "es-jeruk.svg": svg("#FFF3E0", '<rect x="145" y="90" width="110" height="180" rx="18" fill="#FFB74D"/><rect x="155" y="102" width="90" height="150" rx="12" fill="#FB8C00"/><rect x="145" y="88" width="110" height="22" rx="8" fill="#E8E5E0"/><circle cx="200" cy="70" r="22" fill="#FFC107"/>'),
  "kopi-hitam.svg": svg("#EFEAE4", '<ellipse cx="200" cy="258" rx="90" ry="22" fill="#E8E5E0"/><path d="M130 140h120c8 50 8 90-8 120H140c-16-30-16-70-10-120z" fill="#6D4C41"/><ellipse cx="190" cy="140" rx="55" ry="14" fill="#3E2723"/>'),
  "es-kopi.svg": svg("#EDE6DC", '<rect x="148" y="92" width="104" height="176" rx="16" fill="#8D6E63"/><rect x="158" y="108" width="84" height="84" rx="8" fill="#EFEBE9"/><rect x="158" y="188" width="84" height="64" rx="8" fill="#5D4037"/>'),
  "air-mineral.svg": svg("#E8F4FC", '<path d="M175 70h50l12 28v190c0 16-14 28-37 28s-37-12-37-28V98z" fill="#BBDEFB"/><path d="M175 70h50v24h-50z" fill="#90CAF9"/><rect x="188" y="48" width="24" height="24" rx="6" fill="#64B5F6"/>'),
  "teh-hangat.svg": svg("#F6F0E6", '<ellipse cx="200" cy="258" rx="90" ry="20" fill="#E8E5E0"/><path d="M132 150h120c6 40 6 78-10 108H144c-14-30-14-68-12-108z" fill="#D7CCC8"/><ellipse cx="192" cy="150" rx="54" ry="12" fill="#8D6E63"/>'),
  "es-coklat.svg": svg("#F3E6DA", '<rect x="148" y="92" width="104" height="176" rx="16" fill="#A1887F"/><rect x="158" y="110" width="84" height="140" rx="10" fill="#6D4C41"/><ellipse cx="200" cy="128" rx="34" ry="10" fill="#EFEBE9"/>'),
  "pisang-goreng.svg": svg("#FFF6D8", '<ellipse cx="200" cy="258" rx="120" ry="22" fill="#E8E5E0"/><path d="M90 210c40-70 90-80 150-40 40 28 70 20 90 8-10 40-50 70-110 78-70 8-120-10-130-46z" fill="#F2C14E"/>'),
  "tahu-isi.svg": svg("#F4EFE4", '<ellipse cx="200" cy="258" rx="120" ry="22" fill="#E8E5E0"/><rect x="120" y="150" width="160" height="110" rx="18" fill="#F0D78C"/><rect x="138" y="168" width="124" height="74" rx="10" fill="#E6C35C"/><circle cx="200" cy="205" r="16" fill="#C45C26"/>'),
  "risoles.svg": svg("#F8ECD8", '<ellipse cx="200" cy="258" rx="120" ry="22" fill="#E8E5E0"/><ellipse cx="200" cy="205" rx="120" ry="58" fill="#E0A050"/><ellipse cx="200" cy="198" rx="96" ry="40" fill="#F2C14E"/>'),
  "tempe-mendoan.svg": svg("#F3E6D2", '<ellipse cx="200" cy="258" rx="120" ry="22" fill="#E8E5E0"/><rect x="115" y="160" width="170" height="96" rx="16" fill="#C4A574" transform="rotate(-8 200 208)"/><rect x="128" y="172" width="146" height="72" rx="10" fill="#A1887F" transform="rotate(-8 200 208)"/>'),
  "roti-bakar.svg": svg("#F8E8D0", '<ellipse cx="200" cy="258" rx="120" ry="22" fill="#E8E5E0"/><rect x="110" y="150" width="180" height="110" rx="18" fill="#E0A050"/><rect x="122" y="162" width="156" height="86" rx="12" fill="#C67A12"/><rect x="140" y="178" width="120" height="18" rx="6" fill="#6D4C41"/>'),
}

for name, content in files.items():
    (DIR / name).write_text(content, encoding="utf-8")
print("wrote", len(files))
