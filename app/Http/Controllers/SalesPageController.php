<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use App\Models\SalesPage;
use Illuminate\Support\Str;

class SalesPageController extends Controller
{
    /**
     * Show the form for creating a new sales page.
     */
    public function create()
    {
        return Inertia::render('SalesPage/Create');
    }

    /**
     * Process the form data, send it to the Gemini API, and save it.
     */
    public function store(Request $request)
    {
        // 1. Input Validation
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'price' => 'required|string|max:255',
            'description' => 'required|string',
            'features' => 'required|string',
            'target_audience' => 'required|string',
            'usp' => 'nullable|string',
            'cta_link' => 'nullable|url',
            'template' => 'required|string',
        ]);

        // 2. Make prompt for Gemini API
        $prompt = "Anda adalah seorang Copywriter kelas dunia. Buat sales page berkonversi tinggi berdasarkan data produk ini:\n";
        $prompt .= "- Nama Produk: " . $validated['product_name'] . "\n";
        $prompt .= "- Harga: " . $validated['price'] . "\n";
        $prompt .= "- Deskripsi: " . $validated['description'] . "\n";
        $prompt .= "- Fitur Utama: " . $validated['features'] . "\n";
        $prompt .= "- Target Audiens: " . $validated['target_audience'] . "\n";
        $prompt .= "- Unique Selling Point: " . ($validated['usp'] ?? 'Tidak ada') . "\n\n";
        $prompt .= "Tugas Anda: Format output HARUS murni dalam bentuk JSON yang valid dengan susunan key persis seperti ini (tanpa backtick markdown):\n";
        $prompt .= '{ "headline": "...", "subheadline": "...", "product_description": "...", "benefits": ["...", "..."], "features_breakdown": ["...", "..."], "pricing_display": "...", "call_to_action": "..." }';
        $prompt .= "PENTING: Untuk field 'call_to_action', buatlah teks yang SANGAT SINGKAT (maksimal 3-4 kata saja).\n";
        $prompt .= "Contoh: 'Order Now', 'Get Yours Now', 'Claim My Discount'.\n";

        // 3. Call API Gemini 2.5 Flash
        $apiKey = env('GEMINI_API_KEY');
        
        $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey, [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ]
        ]);

        // 4. Extract results from API response
        $aiResult = $response->json();
        
        // Check if the expected content structure exists in the response
        if (!isset($aiResult['candidates'][0]['content']['parts'][0]['text'])) {
            return response()->json([
                'message' => 'Gagal mendapatkan respons dari AI. Cek API Key Anda.',
                'error' => $aiResult
            ], 500);
        }

        $generatedText = $aiResult['candidates'][0]['content']['parts'][0]['text'];
        
        // Some models might return the JSON wrapped in markdown code blocks, so we need to clean it up before decoding
        $cleanJson = trim(str_replace(['```json', '```'], '', $generatedText));
        $generatedData = json_decode($cleanJson, true);

        // If JSON is invalid, return error with raw output for debugging
        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'message' => 'AI tidak mengembalikan format JSON yang valid.',
                'raw_output' => $generatedText
            ], 500);
        }

        // 5. Save to Database
        $salesPage = SalesPage::create([
            'user_id' => Auth::id(), // Logged in user
            'product_name' => $validated['product_name'],
            'input_data' => $validated,
            'generated_content' => $generatedData, // JSON Data from AI
        ]);

        // 6. Return response
        return response()->json([
            'message' => 'Magic Happens! Data berhasil disimpan.',
            'ai_result' => $generatedData,
            'page_id' => $salesPage->id
        ]);
    }

    /**
     * Show the history of generated sales pages for the logged-in user.
     */
    public function index()
    {
        // Fetch all data belonging to the logged-in user, sorted by the most recent (latest)
        $pages = SalesPage::where('user_id', Auth::id())->latest()->get();

        return Inertia::render('SalesPage/Index', [
            'pages' => $pages
        ]);
    }

    /**
     * Delete a specific sales page history.
     */
    public function destroy($id)
    {
        $page = SalesPage::where('user_id', Auth::id())->findOrFail($id);
        $page->delete();

        // Back to history page with success message
        return redirect()->back()->with('message', 'Sales page history deleted successfully.');
    }

    public function show($id)
    {
        $page = SalesPage::where('user_id', Auth::id())->findOrFail($id);

        return Inertia::render('SalesPage/Show', [
            'page' => $page
        ]);
    }

    public function edit($id)
    {
        $page = SalesPage::where('user_id', Auth::id())->findOrFail($id);

        return Inertia::render('SalesPage/Create', [
            'page' => $page
        ]);
    }

    public function update(Request $request, $id)
    {
        $page = SalesPage::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'price' => 'required|string|max:255',
            'description' => 'required|string',
            'features' => 'required|string',
            'target_audience' => 'required|string',
            'usp' => 'nullable|string',
            'cta_link' => 'nullable|url',
            'template' => 'required|string',
        ]);

        $prompt = "Anda adalah seorang Copywriter kelas dunia. Re-generate sales page berkonversi tinggi berdasarkan data produk yang diperbarui ini:\n";
        $prompt .= "- Nama Produk: " . $validated['product_name'] . "\n";
        $prompt .= "- Harga: " . $validated['price'] . "\n";
        $prompt .= "- Deskripsi: " . $validated['description'] . "\n";
        $prompt .= "- Fitur Utama: " . $validated['features'] . "\n";
        $prompt .= "- Target Audiens: " . $validated['target_audience'] . "\n";
        $prompt .= "- Unique Selling Point: " . ($validated['usp'] ?? 'Tidak ada') . "\n\n";
        $prompt .= "Tugas Anda: Format output HARUS murni dalam bentuk JSON yang valid dengan susunan key persis seperti ini (tanpa backtick markdown):\n";
        $prompt .= '{ "headline": "...", "subheadline": "...", "product_description": "...", "benefits": ["...", "..."], "features_breakdown": ["...", "..."], "pricing_display": "...", "call_to_action": "..." }';
        $prompt .= "PENTING: Untuk field 'call_to_action', buatlah teks yang SANGAT SINGKAT (maksimal 3-4 kata saja).\n";

        $apiKey = env('GEMINI_API_KEY');
        $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
            'contents' => [['parts' => [['text' => $prompt]]]]
        ]);

        $aiResult = $response->json();

        if (!isset($aiResult['candidates'][0]['content']['parts'][0]['text'])) {
            return response()->json([
                'message' => 'Gagal mendapatkan respons dari AI. Cek koneksi atau kuota API Anda.',
                'error' => $aiResult
            ], 500);
        }

        $generatedText = $aiResult['candidates'][0]['content']['parts'][0]['text'];
        $cleanJson = trim(str_replace(['```json', '```'], '', $generatedText));
        $generatedData = json_decode($cleanJson, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'message' => 'AI tidak mengembalikan format JSON yang valid.',
                'raw_output' => $generatedText
            ], 500);
        }

        $page->update([
            'product_name' => $validated['product_name'],
            'input_data' => $validated,
            'generated_content' => $generatedData,
        ]);

        return response()->json([
            'message' => 'Campaign successfully re-generated!',
            'ai_result' => $generatedData,
            'page_id' => $page->id
        ]);
    }

    public function export($id)
    {
        $page = SalesPage::where('user_id', Auth::id())->findOrFail($id);
        $content = $page->generated_content;
        
        $template = $page->input_data['template'] ?? 'modern';
        
        // Setup class CSS dinamis
        if ($template === 'dark') {
            $bg = 'bg-slate-950'; $card = 'bg-slate-900 text-white border-slate-800'; $text = 'text-white'; $sub = 'text-slate-400'; $accent = 'bg-indigo-500 rounded-full text-white'; $sectionBg = 'bg-slate-800';
        } elseif ($template === 'minimal') {
            $bg = 'bg-white'; $card = 'bg-white text-black border-4 border-black rounded-none shadow-none'; $text = 'text-black'; $sub = 'text-gray-600'; $accent = 'bg-black rounded-none text-white'; $sectionBg = 'bg-white border-2 border-black';
        } else {
            $bg = 'bg-gray-50'; $card = 'bg-white text-gray-900 border-gray-100 rounded-[3rem] shadow-2xl'; $text = 'text-gray-900'; $sub = 'text-gray-600'; $accent = 'bg-indigo-600 rounded-full text-white'; $sectionBg = 'bg-gray-50';
        }

        $ctaLink = $page->input_data['cta_link'] ?? '#';

        // Susun HTML untuk array Benefits
        $benefitsHtml = '';
        if (isset($content['benefits']) && is_array($content['benefits'])) {
            foreach ($content['benefits'] as $benefit) {
                $benefitsHtml .= "<li class='flex items-start text-lg {$sub}'><span class='mt-1 mr-3 text-green-500'>✔</span> {$benefit}</li>";
            }
        }

        // Susun HTML untuk array Features
        $featuresHtml = '';
        if (isset($content['features_breakdown']) && is_array($content['features_breakdown'])) {
            foreach ($content['features_breakdown'] as $feature) {
                $featuresHtml .= "<li class='flex items-center text-lg {$sub}'><span class='w-3 h-3 mr-4 bg-indigo-500 rounded-full'></span> {$feature}</li>";
            }
        }

        $html = "
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>{$page->product_name} - Sales Page</title>
            <script src='https://cdn.tailwindcss.com'></script>
            <link href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap' rel='stylesheet'>
            <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
        </head>
        <body class='{$bg} py-12'>
            <div class='max-w-4xl mx-auto overflow-hidden border {$card}'>
                
                <div class='p-8 text-center md:p-20'>
                    <h1 class='text-5xl font-black mb-6 leading-tight md:text-6xl {$text}'>{$content['headline']}</h1>
                    <p class='max-w-3xl mx-auto text-xl mb-10 {$sub}'>{$content['subheadline']}</p>
                    <a href='{$ctaLink}' target='_blank' class='px-12 py-5 font-bold text-xl inline-block shadow-xl {$accent}'>{$content['call_to_action']}</a>
                </div>

                <div class='p-8 space-y-20 border-t md:p-16 border-gray-50/10'>
                    <section class='max-w-3xl mx-auto text-center'>
                        <h2 class='text-3xl font-bold mb-6 {$text}'>About the Product</h2>
                        <p class='text-xl italic leading-relaxed {$sub}'>\"{$content['product_description']}\"</p>
                    </section>

                    <div class='grid grid-cols-1 gap-12 md:grid-cols-2'>
                        <div class='p-10 rounded-3xl {$sectionBg}'>
                            <h3 class='mb-6 text-2xl font-bold {$text}'>Why Choose Us?</h3>
                            <ul class='space-y-4'>{$benefitsHtml}</ul>
                        </div>
                        <div class='p-10 rounded-3xl {$sectionBg}'>
                            <h3 class='mb-6 text-2xl font-bold {$text}'>Key Features</h3>
                            <ul class='space-y-4'>{$featuresHtml}</ul>
                        </div>
                    </div>

                    <section class='text-center bg-gray-900 text-white p-12 md:p-20 rounded-[3rem] shadow-2xl'>
                        <h2 class='mb-4 text-5xl font-black'>{$content['pricing_display']}</h2>
                        <p class='mb-10 text-lg tracking-widest text-gray-400 uppercase'>Limited Time Offer</p>
                        <a href='{$ctaLink}' target='_blank' class='inline-block px-16 py-5 text-2xl font-black text-gray-900 transition bg-white shadow-lg rounded-2xl hover:bg-indigo-50'>
                            {$content['call_to_action']}
                        </a>
                    </section>
                </div>
            </div>
        </body>
        </html>";

        return response($html)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', 'attachment; filename="' . \Illuminate\Support\Str::slug($page->product_name) . '.html"');
    }
}