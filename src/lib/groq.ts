import { Expense, CategorySummary, AdvisorAnalysis } from '@/types';

const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';

if (!apiKey) {
  console.warn('Groq API Key is missing. Configure VITE_GROQ_API_KEY in .env');
}

export interface GeminiPromptParams {
  userName: string;
  monthlyIncome: number;
  totalExpenses: number;
  transactionCount: number;
  categoryBreakdown: CategorySummary[];
  topTransactions: Expense[];
  currentDate: string;
  daysRemainingInMonth: number;
}

export const buildGeminiPrompt = (params: GeminiPromptParams): string => {
  const ratio = params.monthlyIncome > 0
    ? Math.round((params.totalExpenses / params.monthlyIncome) * 100)
    : 0;
  const remaining = params.monthlyIncome - params.totalExpenses;

  const categoryLines = params.categoryBreakdown
    .map(cat => `- ${cat.category}: Rp ${cat.total.toLocaleString('id-ID')} (${cat.percentage}%)`)
    .join('\n');

  const transactionLines = params.topTransactions
    .map(t => `- Rp ${t.amount.toLocaleString('id-ID')} | ${t.category} | "${t.description || ''}" | ${t.date}`)
    .join('\n');

  return `Kamu adalah advisor keuangan personal untuk mahasiswa Indonesia.
Gunakan bahasa Indonesia yang santai, spesifik, dan tidak generik.

=== DATA KEUANGAN BULAN INI ===
Nama: ${params.userName}
Pendapatan bulanan: Rp ${params.monthlyIncome.toLocaleString('id-ID')}
Total pengeluaran bulan ini: Rp ${params.totalExpenses.toLocaleString('id-ID')}
Rasio pengeluaran: ${ratio}% dari pendapatan
Sisa uang: Rp ${remaining.toLocaleString('id-ID')}
Hari ini: ${params.currentDate}, sisa hari di bulan ini: ${params.daysRemainingInMonth} hari
Jumlah transaksi: ${params.transactionCount} transaksi

=== BREAKDOWN PER KATEGORI ===
${categoryLines || 'Belum ada transaksi'}

=== 5 TRANSAKSI TERBESAR BULAN INI ===
${transactionLines || 'Belum ada transaksi'}

=== ACUAN PENILAIAN ===
- Hemat: pengeluaran < 50% pendapatan
- Normal: pengeluaran 50-80% pendapatan
- Boros: pengeluaran > 80% pendapatan
- Jika pendapatan = 0, gunakan penilaian "tidak_dapat_dinilai"

Respond HANYA dalam JSON valid, tanpa markdown, tanpa backtick, tanpa teks lain:
{
  "ringkasan": "2-3 kalimat spesifik tentang pola pengeluaran, sebutkan angka nyata",
  "penilaian": "hemat" atau "normal" atau "boros" atau "tidak_dapat_dinilai",
  "alasan_penilaian": "1-2 kalimat alasan berdasarkan angka dan rasio",
  "saran": [
    "saran spesifik 1 berdasarkan kategori terbesar user",
    "saran spesifik 2 berdasarkan pola transaksi user",
    "saran spesifik 3 untuk sisa hari di bulan ini"
  ],
  "highlight": "1 insight menarik atau tidak terduga dari data, sebutkan angka"
}`;
};

const callGroq = async (prompt: string): Promise<string> => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Gagal berkomunikasi dengan AI.');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const analyzeExpenses = async (params: GeminiPromptParams): Promise<AdvisorAnalysis> => {
  if (!apiKey) {
    throw new Error('Groq API key belum dikonfigurasi. Set VITE_GROQ_API_KEY di .env');
  }

  const prompt = buildGeminiPrompt(params);
  const textResponse = await callGroq(prompt);

  const startIdx = textResponse.indexOf('{');
  const endIdx = textResponse.lastIndexOf('}');

  if (startIdx === -1 || endIdx === -1) {
    throw new Error('Format respons AI tidak mengandung objek JSON valid.');
  }

  try {
    return JSON.parse(textResponse.substring(startIdx, endIdx + 1)) as AdvisorAnalysis;
  } catch {
    throw new Error('Gagal memahami format analisis dari AI (JSON tidak valid).');
  }
};

export const chatWithAdvisor = async (
  expenses: Expense[],
  history: { role: 'user' | 'assistant'; content: string }[],
  newMessage: string,
  monthlyIncome: number = 0,
  previousAnalysis: AdvisorAnalysis | null = null
): Promise<string> => {
  if (!apiKey) {
    throw new Error('Groq API key belum dikonfigurasi.');
  }

  const formattedExpenses = expenses.map(e => ({
    tanggal: e.date,
    nominal: e.amount,
    kategori: e.category,
    deskripsi: e.description || '-',
  }));

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const ratio = monthlyIncome > 0 ? Math.round((totalExpenses / monthlyIncome) * 100) : 0;
  const remaining = monthlyIncome - totalExpenses;

  const historyText = history
    .slice(0, -1) // exclude pesan user terakhir karena udah ada di newMessage
    .map(msg => `${msg.role === 'user' ? 'Pengguna' : 'Advisor'}: ${msg.content}`)
    .join('\n');

  const analysisContext = previousAnalysis
    ? `
=== HASIL ANALISIS SEBELUMNYA ===
Penilaian: ${previousAnalysis.penilaian}
Ringkasan: ${previousAnalysis.ringkasan}
Alasan: ${previousAnalysis.alasan_penilaian}
`
    : '';

  const prompt = `Kamu adalah advisor keuangan personal untuk mahasiswa Indonesia.
Gunakan bahasa Indonesia yang santai, bersahabat, dan berbobot.
Jawab berdasarkan data nyata yang diberikan, JANGAN minta data tambahan dari user.

=== DATA KEUANGAN BULAN INI ===
Total pengeluaran: Rp ${totalExpenses.toLocaleString('id-ID')}
Pendapatan bulanan: Rp ${monthlyIncome.toLocaleString('id-ID')}
Rasio pengeluaran: ${ratio}%
Sisa uang: Rp ${remaining.toLocaleString('id-ID')}
${analysisContext}
=== DETAIL TRANSAKSI BULAN INI ===
${JSON.stringify(formattedExpenses, null, 2)}

=== RIWAYAT PERCAKAPIAN ===
${historyText}

=== PERTANYAAN USER SEKARANG ===
${newMessage}

Jawab langsung berdasarkan data di atas. Sebutkan angka spesifik kalau relevan.`;

  return await callGroq(prompt);
};