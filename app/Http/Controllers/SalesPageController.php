<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use App\Models\SalesPage;

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
}