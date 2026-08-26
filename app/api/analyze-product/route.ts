import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { produit, category, probleme, vente, achat, marge, poids, concurrent } = body;

    if (!produit) {
      return NextResponse.json({ success: false, message: 'Nom de produit requis' }, { status: 400 });
    }

    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: 'Clé API IA non configurée sur le serveur',
      }, { status: 503 });
    }

    const prompt = `Tu es le Directeur Stratégique et Média Buyer Senior #1 en E-Commerce & Cash on Delivery (COD) en Afrique de l'Ouest et Centrale (Bénin, Côte d'Ivoire, Sénégal, Togo, Cameroun).

Analyse en profondeur le produit suivant pour un vendeur e-commerce local :
- Nom du produit : "${produit}"
- Catégorie : "${category || 'Général'}"
- Problème résolu saisi : "${probleme || 'Non spécifié'}"
- Prix de vente prévu : ${vente || 15000} FCFA
- Coût d'achat brut : ${achat || 4000} FCFA
- Marge estimée : ${marge || 11000} FCFA
- Poids : ${poids || 0.5} kg
- Nombre de concurrents locaux estimés : ${concurrent || 2}

Fournis une analyse stratégique percutante, ultra-concrète et adaptée aux réalités du marché africain (logistique moto, méfiance des clients, coupures de courant, chaleur, pouvoir d'achat).

Réponds EXCLUSIVEMENT avec un objet JSON valide suivant rigoureusement cette structure :
{
  "reasonsToUse": "4 puces distinctes avec '• ' expliquant pourquoi le client africain doit utiliser ce produit immédiatement",
  "problemsSolved": "3 puces avec '• ' détaillant les douleurs quotidiennes concrètes résolues",
  "whyItsWorthIt": "3 puces avec '• ' prouvant la rentabilité, la valeur perçue et le potentiel d'offres packs duo/famille",
  "criticalAttentionPoints": "3 puces avec '• ' sur les spécifications techniques, prises 220V, qualité et fragilité colis",
  "failureRisks": "3 puces avec '• 💣 ' sur les vrais pièges qui pourraient faire échouer la vente en COD",
  "buyerPersona": {
    "targetAge": "Tranche d'âge réaliste (ex: 25 - 50 ans)",
    "genderRatio": "Ratio Hommes/Femmes (ex: Femmes 75% / Hommes 25%)",
    "professionalCategory": "Professions précises de la cible en Afrique",
    "psychologicalTrigger": "Déclencheur émotionnel et psychologique d'achat"
  },
  "topPositiveReviews": "3 puces avec '• ⭐ ' des meilleurs retours clients mondiaux réels",
  "topNegativeComplaints": "3 puces avec '• ⚠️ ' des plaintes ou points de vigilance clients",
  "commonObjections": [
    {
      "objection": "Objection client COD #1 (ex: arnaque, trop cher, panne)",
      "responseScript": "Script de réponse téléphonique / WhatsApp percutant et rassurant"
    },
    {
      "objection": "Objection client COD #2",
      "responseScript": "Script de réponse"
    }
  ],
  "recommendedAdAngle": "Angle publicitaire et hook vidéo TikTok / Facebook Ads recommandé avec scène d'ouverture",
  "viralFactorScore": 8,
  "codReturnRisk": "low",
  "seasonalityType": "all_year",
  "strategicVerdict": "🟢 FEU VERT : Court verdict stratégique avec recommandations",
  "targetCountries": [
    "Bénin (Cotonou / Calavi / Porto-Novo)",
    "Côte d'Ivoire (Abidjan / Bouaké)",
    "Sénégal (Dakar / Thiès)",
    "Togo (Lomé)",
    "Cameroun (Douala / Yaoundé)"
  ]
}`;

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.3-70b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('NVIDIA AI API error:', errorText);
      return NextResponse.json({ success: false, message: 'Erreur du serveur IA NVIDIA' }, { status: 502 });
    }

    const aiData = await response.json();
    const rawContent = aiData.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json({ success: false, message: 'Réponse IA vide' }, { status: 500 });
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawContent);
    } catch (parseErr) {
      // Clean possible markdown code fences
      const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    return NextResponse.json({
      success: true,
      analysis: parsedResult,
      productName: produit,
    });
  } catch (err: any) {
    console.error('AI Product Analysis Crash:', err);
    return NextResponse.json({ success: false, message: err?.message || 'Erreur interne' }, { status: 500 });
  }
}
