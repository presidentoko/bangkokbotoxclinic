const NORM: Record<string, string> = {
  // Thai script → English
  "จ.ปทุมธานี": "Pathum Thani",
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
  // Spelling variants → canonical
  "Chonburi": "Chon Buri",
  "Chon buri": "Chon Buri",
  "Pathumthani": "Pathum Thani",
  "Pathum thani": "Pathum Thani",
  "Samutsakhon": "Samut Sakhon",
  "Samutprakarn": "Samut Prakan",
  "Samut Prakarn": "Samut Prakan",
  "Nakhon Ratchasima": "Nakhon Ratchasima",
  "Srisaket": "Si Sa Ket",
  "Si Sa Ket": "Si Sa Ket",
  // Remove garbage values
  "City": "",
  "N/A": "",
};

export function normalizeProvince(raw: string | undefined): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  return NORM[trimmed] ?? trimmed;
}
