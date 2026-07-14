const NORM: Record<string, string> = {
  // Thai script → English
  "จ.ปทุมธานี": "Pathum Thani",
  "จปทุมธานี": "Pathum Thani",
  "ปทุมธานี": "Pathum Thani",
  "จ.นนทบุรี": "Nonthaburi",
  "นนทบุรี": "Nonthaburi",
  "จ.สมุทรปราการ": "Samut Prakan",
  "สมุทรปราการ": "Samut Prakan",
  "จ.ชลบุรี": "Chon Buri",
  "ชลบุรี": "Chon Buri",
  "พิษณุโลก": "Phitsanulok",
  "จ.พิษณุโลก": "Phitsanulok",
  "จังหวัดพิษณุโลก": "Phitsanulok",
  "จ.หนองคาย": "Nong Khai",
  "หนองคาย": "Nong Khai",
  "จ.ระยอง": "Rayong",
  "ระยอง": "Rayong",
  "ตาก": "Tak",
  "จ.ตาก": "Tak",
  "จ.กรุงเทพมหานคร": "Bangkok",
  "กรุงเทพมหานคร": "Bangkok",
  "จ.นครราชสีมา": "Nakhon Ratchasima",
  "นครราชสีมา": "Nakhon Ratchasima",
  "จ.สุราษฎร์ธานี": "Surat Thani",
  "สุราษฎร์ธานี": "Surat Thani",
  "จังหวัดมุกดาหาร": "Mukdahan",
  "มุกดาหาร": "Mukdahan",
  "ฉะเชิงเทรา": "Chachoengsao",
  "จ.ฉะเชิงเทรา": "Chachoengsao",
  "สระแก้ว": "Sa Kaeo",
  "นครปฐม": "Nakhon Pathom",
  "จ.นครปฐม": "Nakhon Pathom",
  "จ.สมุทรสาคร": "Samut Sakhon",
  "สมุทรสาคร": "Samut Sakhon",
  "จ.สระบุรี": "Saraburi",
  "สระบุรี": "Saraburi",
  "จังหวัด กรุงเทพมหานคร": "Bangkok",
  "ชุมพร": "Chumphon",
  "จ.ชุมพร": "Chumphon",
  // บ้านบึง (Ban Bueng) is a district within Chon Buri, not its own province —
  // collapse to the province like every other city_label in this dataset.
  "บ้านบึง": "Chon Buri",
  // Spelling variants → canonical
  "Chonburi": "Chon Buri",
  "Chon buri": "Chon Buri",
  "Pathumthani": "Pathum Thani",
  "Pathum thani": "Pathum Thani",
  "Pathumthanee": "Pathum Thani",
  "Samutsakhon": "Samut Sakhon",
  "Samutprakarn": "Samut Prakan",
  "Samut Prakarn": "Samut Prakan",
  "Nakhon Ratchasima": "Nakhon Ratchasima",
  "Srisaket": "Si Sa Ket",
  "Si Sa Ket": "Si Sa Ket",
  "Suphanburi": "Suphan Buri",
  "Suphan buri": "Suphan Buri",
  // Remove garbage values
  "City": "",
  "city": "",
  "N/A": "",
};

export function normalizeProvince(raw: string | undefined): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  return NORM[trimmed] ?? trimmed;
}
