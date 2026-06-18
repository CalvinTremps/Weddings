import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xgeyaorqdcdupbwcaqzt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZXlhb3JxZGNkdXBid2NhcXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzc2NTIsImV4cCI6MjA5Njg1MzY1Mn0.V9vvyKchIKqbA22JmNm9H3-wB5QuC5u2fhVKmE08dUY";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GUESTS = [
  "Daisy",
  "Victor",
  "Patience Zhande",
  "Primrose Zhande",
  "Mr and Mrs Nyarambi",
  "Mr and Mrs Matanga",
  "Mr and Mrs Dube",
  "Mr and Mrs Ashborn",
  "Mr and Mrs Mandevu",
  "Mr and Mrs Jones",
  "Mr and Mrs Duma",
  "Mr and Mrs Wiesenbacher",
  "Theo Masarira",
  "Mr and Mrs Gwenure",
  "Mr and Mrs Semwayo",
  "Ton Musopero",
  "Mr and Mrs S Sibanda",
  "Mr and Mrs Shumba",
  "Nhamo Dziko",
  "Zvikomborero Shumba",
  "Mr and Mrs Muchenje",
  "Mr and Mrs Vengesai",
  "Mr and Mrs Msimanga",
  "Mr and Mrs C Makhiwa",
  "Mr and Mrs Sengweni",
  "Mutendubvure Family",
  "Mr and Mrs Munherendi",
  "Mpofu Family",
  "Mr and Mrs Joseph",
  "Mr and Mrs Mado",
  "Mr and Mrs Kwari",
  "Mr and Mrs Dlamini",
  "Mr and Mrs Chingarande",
  "Mr and Mrs Majaha",
  "Mr and Mrs Nyazika",
  "Mr and Mrs Muzvondiwa",
  "Mr and Mrs Mhlanga",
  "Keith and Lulu",
  "Mr and Mrs Sidubi",
  "Mr and Mrs Manduna",
  "Gerald and Stha",
  "Nathaniel Chitupa",
  "Mr and Mrs Davison",
  "Bongani Masanjala",
  "Philip Chaitezvi",
  "Blessing Zanza",
  "Mr and Mrs Thebe",
  "Mr and Mrs Kusano",
  "Mr and Mrs Shungu",
  "Mr and Mrs Shava",
  "Mr and Mrs Gwezuva",
  "Jabulani Mhlanga",
  "Physhette Sungai",
  "Priviledge Sungai",
  "Mr and Mrs Nyangaidenzi",
  "Bruce Masamvu",
  "Mr and Mrs Huni",
  "Mr and Mrs Mkwanazi",
  "Martha Mandishona",
  "Mr and Mrs P Ndlovu",
  "Mr and Mrs T Ndlovu",
  "Priscilla Da Silva and Partner",
  "Mr and Mrs Zhou",
  "Mr and Mrs Mushawayu",
  "Mr Tavengwa Hara",
  "Sasha Donovan",
  "Mr and Mrs Mlalazi",
  "Nqabutho Ncube",
  "Ashton Ncube",
  "Mr and Mrs Q Mpofu",
  "Beke Nyathi and Partner",
  "Nyathi Family",
  "Mr and Mrs Peter Nyathi",
  "Mr and Mrs Dlamini 2",
  "Mr and Mrs Hove",
  "Tavongaishe",
  "Talent",
  "Aisha",
  "Nicky",
  "Mr and Mrs Mathambo",
  "Christin Mathambo",
  "Mr and Mrs Murwira",
  "Mr and Mrs N Dube",
  "Mr and Mrs Gomez",
  "Rumbi",
  "Natasha",
  "Mr and Mrs Zidya",
  "Mr and Mrs V Mpofu",
  "Mr and Mrs V Moyo",
  "Mr and Mrs L Ncube",
  "Mr and Mrs Mabudachemere",
  "Mr and Mrs K Makhiwa",
  "Sithembekile Ndlovu",
  "Mr and Mrs Mawaru",
  "Thokozani Ndlovu",
  "Mr and Mrs Malunga",
  "Mr and Mrs N Muchemedzi",
  "Mr and Mrs P Muchemedzi",
  "Mr and Mrs T Muchemedzi",
  "Kudzi Muchemedzi",
  "Simba",
  "Moreblessing and Husband",
  "Resi",
  "Chiedza",
  "Fortunate",
  "Erica",
  "Thembelihle and Husband",
  "Dube Family",
  "Florence",
  "Masiza",
  "Mr and Mrs Ndlovu",
  "Mr and Mrs N Sibanda",
  "Mr and Mrs Mambara",
  "Mr and Mrs Muchenu",
  "Ivy Siwali",
  "Mr and Mrs Mutefura",
  "Heritance",
  "Gugulethu",
  "Sandile",
  "Mrs Songo",
  "Fike and Phathi",
  "Glory",
  "Mr and Mrs C Ndlovu",
  "Immie",
  "Nontokozo",
  "Mildred",
  "Nothabo",
  "Mr and Mrs Mjuweni",
  "Renie Gumpo",
  "Taurai",
  "Sazi",
  "Roy",
  "Alistair Vann",
  "Mr and Mrs P Moyo",
  "Nyashadzashe Chinyathi",
];

function generateCode(name) {
  const prefix = name.trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${suffix}`;
}

async function seed() {
  // Fetch existing codes to avoid duplicates
  const { data: existing } = await supabase.from("guests").select("code, name");
  const existingNames = new Set((existing || []).map(g => g.name.toLowerCase()));
  const usedCodes = new Set((existing || []).map(g => g.code));

  const toInsert = [];
  for (const name of GUESTS) {
    if (existingNames.has(name.toLowerCase())) {
      console.log(`SKIP (already exists): ${name}`);
      continue;
    }
    let code;
    do { code = generateCode(name); } while (usedCodes.has(code));
    usedCodes.add(code);
    toInsert.push({ name, code });
  }

  if (toInsert.length === 0) {
    console.log("All guests already exist. Nothing to insert.");
    return;
  }

  console.log(`Inserting ${toInsert.length} guests...`);
  const { error } = await supabase.from("guests").insert(toInsert);
  if (error) {
    console.error("Insert error:", error.message);
  } else {
    console.log(`Done! ${toInsert.length} guests added.`);
    toInsert.forEach(g => console.log(`  ${g.name} → ${g.code}`));
  }
}

seed();
