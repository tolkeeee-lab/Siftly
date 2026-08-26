import {
  ProductData,
  MarketAnalysisData,
  BuyerPersonaData,
  MarketProjectionsData,
  AdBenchmarksData,
  CustomerObjectionItem,
  ReviewsAndObjectionsData,
  SpyShortcutsData,
} from '../types/product';
import { calculateNoteFinale, calculateMargin, calculateCOGS } from './calculations';
import { formatFCFA } from './formatters';

interface ProductNicheProfile {
  reasonsToUse: string;
  problemsSolved: string;
  whyItsWorthIt: string;
  criticalAttentionPoints: string;
  failureRisks: string;
  buyerPersona: BuyerPersonaData;
  topPositiveReviews: string;
  topNegativeComplaints: string;
  commonObjections: CustomerObjectionItem[];
  adAngle: string;
  audienceSizeMillion: number;
  seasonalityType: 'all_year' | 'rainy' | 'festive' | 'hot_season';
  returnRisk: 'low' | 'medium' | 'high';
  viralScoreBonus: number;
}

function detectNicheProfile(name: string, category: string, weight: number, sellingPrice: number, margin: number): ProductNicheProfile {
  const n = name.toLowerCase();

  // 1. MOUSTIQUES & INSECTES
  if (n.includes('moustique') || n.includes('insecte') || n.includes('piege') || n.includes('repulsif') || n.includes('lampe uv')) {
    return {
      reasonsToUse: `• Éradique silencieusement et immédiatement les moustiques vecteurs du paludisme dans les chambres à coucher.
• Zéro produit chimique toxique, zéro fumée ni odeur étouffante de spirale insecticide (idéal avec nourrissons et enfants).
• Alimentation USB / Secteur 220V économique avec lumière UV bionique attirant les moustiques à 360°.
• Prise en main instantanée : il suffit de brancher l'appareil le soir pour dormir en toute sérénité.`,
      problemsSolved: `• Nuits blanches et bourdonnements incessants qui gâchent le sommeil réparateur de toute la famille.
• Risques sanitaires et coûts médicaux élevés liés aux crises de paludisme répétées.
• Dépenses récurrentes et inutiles dans les bombes insecticides chimiques toxiques pour les poumons.`,
      whyItsWorthIt: `• Argument de santé familiale imparable : En Afrique de l'Ouest, la protection contre le paludisme déclenche un achat immédiat.
• Marge nette solide de ${formatFCFA(margin)} permettant d'investir sereinement en TikTok & Facebook Ads.
• Fort taux de conversion sur les offres Duo/Trio (1 pour la chambre parentale + 1 pour les enfants).`,
      criticalAttentionPoints: `• Grille de protection : Vérifier que la grille extérieure empêche tout contact des doigts d'enfants avec la haute tension interne.
• Efficacité lumineuse : Préciser dans la pub que l'appareil doit être placé dans une pièce sombre 1h avant de dormir.
• Câble & Adaptateur : Fournir un câble USB solide de longueur suffisante (au moins 1 mètre).`,
      failureRisks: `• 💣 Lumière UV sous-dimensionnée ne capturant pas assez de moustiques en zone très dense.
• 💣 Clients déçus s'ils l'utilisent en plein jour ou avec la lumière de la pièce allumée.
• 💣 Concurrence locale avec des modèles bas de gamme vendus au grand marché à prix bradé.`,
      buyerPersona: {
        targetAge: '25 - 55 ans',
        genderRatio: 'Mixte (55% Femmes / 45% Hommes)',
        professionalCategory: 'Mères de famille, Pères soucieux de la santé des enfants, Salariés',
        psychologicalTrigger: 'Protection de la santé familiale, Sommeil paisible & Économie de médicaments',
      },
      topPositiveReviews: `• ⭐ "Depuis qu'on l'a mis dans la chambre des enfants, plus aucune piqûre de moustique la nuit !"
• ⭐ "Silencieux et sans odeur de fumée, indispensable pendant la saison des pluies."
• ⭐ "Facile à nettoyer le matin en ouvrant le réceptacle inférieur."`,
      topNegativeComplaints: `• ⚠️ "Il faut éteindre les autres lumières de la chambre pour qu'il soit efficace à 100%."
• ⚠️ "Câble USB un peu court, j'ai dû utiliser une rallonge."
• ⚠️ "Le bruit du petit ventilateur peut s'entendre si la pièce est dans un silence absolu."`,
      commonObjections: [
        {
          objection: 'Est-ce que ça tue vraiment les gros moustiques locaux d\'Afrique ?',
          responseScript: '« Absolument ! La fréquence UV bionique attire spécifiquement les anophèles et moustiques tropicaux avant de les neutraliser sur la grille haute tension. Vous pouvez tester avec notre livreur à la réception. »',
        },
        {
          objection: 'Est-ce que c\'est dangereux si mon enfant touche l\'appareil ?',
          responseScript: '« Non, l\'appareil est équipé d\'une double grille de sécurité externe isolée impossible à traverser avec les doigts, garantissant une sécurité totale pour toute la maison. »',
        },
      ],
      adAngle: 'Démonstration TikTok / Reels : Chambre plongée dans le noir montrant le réceptacle plein le lendemain matin + Témoignage d\'une maman soulagée.',
      audienceSizeMillion: 9.2,
      seasonalityType: 'rainy',
      returnRisk: 'low',
      viralScoreBonus: 2,
    };
  }

  // 2. AUTO & MOTO
  if (n.includes('auto') || n.includes('voiture') || n.includes('batterie') || n.includes('demarreur') || n.includes('pneu') || n.includes('gonfleur') || n.includes('jump starter') || category === 'Auto & Moto') {
    return {
      reasonsToUse: `• Démarrage autonome d'un véhicule (voiture, 4x4, taxi) en panne de batterie en 30 secondes chrono.
• Évite de supplier des automobilistes de passage ou de chercher des câbles de démarrage au milieu de la nuit.
• Powerbank haute capacité intégré pour recharger smartphones et lampes en situation d'urgence sur la route.
• Lampe torche LED multifonction avec mode SOS pour les réparations nocturnes en bord de voie.`,
      problemsSolved: `• Stress intense d'être bloqué tard le soir ou lors d'un voyage interurbain avec une batterie déchargée.
• Perte de temps colossale et frais de remorquage/garage imprévus très coûteux.
• Pression des pneus insuffisante entraînant surconsommation de carburant et usure prématurée.`,
      whyItsWorthIt: `• Valeur perçue extrêmement forte (> 40 000 FCFA) : Les automobilistes considèrent cet outil comme une assurance vitale.
• Marge brute unitaire généreuse (${formatFCFA(margin)}) idéale pour rentabiliser des campagnes publicitaires ciblées.
• Taux d'annulation COD faible car l'acheteur est généralement un adulte solvable propriétaire de véhicule.`,
      criticalAttentionPoints: `• Ampérage de pointe (Peak Current) : Vérifier que le booster délivre au moins 600A pour démarrer les moteurs diesel 2.0L+.
• Pinces intelligentes : Exiger des pinces crocodiles avec protection anti-inversion de polarité et anti-étincelles.
• Poids & Sécurité de transport (${weight} kg) : Batterie lithium certifiée avec circuit de régulation thermique.`,
      failureRisks: `• 💣 Booster incapable de démarrer un gros SUV ou pick-up 4x4 si le modèle commandé est trop faible.
• 💣 Décharge complète de la batterie interne si l'automobiliste ne la recharge pas tous les 3 mois.
• 💣 Câbles crocodiles d'entrée de gamme qui fondent si l'utilisateur insiste trop longtemps sur le démarreur.`,
      buyerPersona: {
        targetAge: '28 - 60 ans',
        genderRatio: 'Hommes (85%) / Femmes (15%)',
        professionalCategory: 'Propriétaires de véhicules, Chauffeurs VTC/Taxis, Cadres nomades, Commerçants',
        psychologicalTrigger: 'Autonomie totale, Sécurité sur la route & Économie de frais de dépannage',
      },
      topPositiveReviews: `• ⭐ "M'a sauvé un dimanche soir à 23h sur l'axe Cotonou-Calavi, ma voiture a démarré au quart de tour !"
• ⭐ "Très compact, tient parfaitement dans la boîte à gants. La lampe LED est super puissante."
• ⭐ "Permet aussi de gonfler les pneus et de charger 2 téléphones en voyage."`,
      topNegativeComplaints: `• ⚠️ "Bien penser à le recharger à 100% avant le premier long trajet."
• ⚠️ "Notice un peu sommaire, il faut bien lire le sens des couleurs des pinces (rouge sur +, noir sur -)."
• ⚠️ "Les câbles sont un peu rigides mais très solides."`,
      commonObjections: [
        {
          objection: 'Est-ce que ça peut démarrer un gros moteur diesel ou seulement les petites citadines ?',
          responseScript: '« Notre modèle Pro est calibré pour démarrer tous les moteurs essence jusqu\'à 4.0L et diesel jusqu\'à 2.5L (Toyota, Hyundai, Mercedes, Peugeot...). Notre livreur peut vous assister lors de la livraison. »',
        },
        {
          objection: 'Combien de temps la batterie du boîtier reste chargée dans la boîte à gants ?',
          responseScript: '« Grâce à ses cellules lithium haute densité, le boîtier conserve 85% de sa charge pendant plus de 6 mois sans utilisation. »',
        },
      ],
      adAngle: 'Vidéo preuve choc Facebook Ads : Scène réelle nocturne avec une voiture qui refuse de démarrer -> Branchement du boîtier -> Démarrage instantané au premier coup de clé.',
      audienceSizeMillion: 4.8,
      seasonalityType: 'all_year',
      returnRisk: 'low',
      viralScoreBonus: 2,
    };
  }

  // 3. SANTÉ, CORPS & BIEN-ÊTRE
  if (n.includes('posture') || n.includes('dos') || n.includes('lombaire') || n.includes('masseur') || n.includes('genou') || n.includes('douleur') || n.includes('santé') || category === 'Santé & Bien-être') {
    return {
      reasonsToUse: `• Soulage immédiatement les tensions musculaires, douleurs lombaires et courbatures accumulées au bureau ou en voiture.
• Corrige la posture et réaligne la colonne vertébrale sans effort pour une silhouette plus droite et élégante.
• Confort respirant et discret : se porte invisiblement sous une chemise, robe ou vêtement de travail.
• Réglable et adaptable à toutes les morphologies avec sangles élastiques ergonomiques renforcées.`,
      problemsSolved: `• Mal de dos chronique et fatigue intense après de longues heures assis ou debout.
• Déformation progressive de la posture (épaules voûtées, cou penché sur l'écran du smartphone).
• Dépenses répétitives en séances de massage ou anti-inflammatoires médicamenteux temporaires.`,
      whyItsWorthIt: `• Marché de masse gigantesque : Plus de 70% des adultes urbains souffrent de maux de dos ou de fatigue lombaire.
• Fort taux d'upsell : Proposition naturelle du Pack 2x (1 pour le bureau + 1 pour le conjoint) avec panier moyen élevé.
• Poids plume (${weight} kg) permettant une expédition économique et une marge brute de ${formatFCFA(margin)}.`,
      criticalAttentionPoints: `• Guide des tailles : Préciser clairement les dimensions ou privilégier les modèles à taille universelle ajustable.
• Tissu hypoallergénique : Vérifier que le tissu ne provoque pas d'irritation sous le climat tropical chaud et humide.
• Coutures renforcées : Exiger des coutures doubles au niveau des points de traction des sangles.`,
      failureRisks: `• 💣 Taille non adaptée si le client choisit mal sa taille (privilégier les modèles ajustables Free Size).
• 💣 Tissu synthétique trop rigide provoquant des frottements sous les aisselles.
• 💣 Promesses médicales excessives dans la pub pouvant entraîner des déceptions clients.`,
      buyerPersona: {
        targetAge: '28 - 60 ans',
        genderRatio: 'Mixte (50% Hommes / 50% Femmes)',
        professionalCategory: 'Employés de bureau, Fonctionnaires, Chauffeurs, Commerçants, Personnes âgées',
        psychologicalTrigger: 'Soulagement physique immédiat, Vitalité retrouvée & Confort de vie quotidien',
      },
      topPositiveReviews: `• ⭐ "Dès le premier jour, j'ai senti mes épaules se redresser et le mal de bas du dos a diminué !"
• ⭐ "Très discret sous ma chemise de travail, personne ne remarque que je le porte."
• ⭐ "Matière élastique de très bonne qualité qui ne frotte pas la peau."`,
      topNegativeComplaints: `• ⚠️ "Prendre 2 à 3 jours pour s'habituer au maintien dorsal au début."
• ⚠️ "Bien ajuster les sangles pour ne pas trop serrer sous les bras."
• ⚠️ "Laver à la main pour préserver l'élasticité sur le long terme."`,
      commonObjections: [
        {
          objection: 'Est-ce que c\'est inconfortable ou trop serré sous les vêtements ?',
          responseScript: '« Pas du tout ! Le système est conçu en néoprène respirant ultra-fin avec sangles rembourrées ajustables à votre convenance pour un confort parfait toute la journée. »',
        },
        {
          objection: 'Combien d\'heures par jour dois-je le porter pour voir des résultats ?',
          responseScript: '« Seulement 1 à 2 heures par jour suffisent pour réentraîner votre mémoire musculaire et soulager définitivement vos douleurs dorsales. »',
        },
      ],
      adAngle: 'Vidéo TikTok / Facebook : Animation 3D de la colonne vertébrale courbée qui se redresse instantanément + Démonstration portée sous un vêtement.',
      audienceSizeMillion: 7.8,
      seasonalityType: 'all_year',
      returnRisk: 'low',
      viralScoreBonus: 1,
    };
  }

  // 4. CUISINE & ÉLECTROMÉNAGER
  if (n.includes('hachoir') || n.includes('mixeur') || n.includes('eplucheur') || n.includes('cuisine') || n.includes('friteuse') || n.includes('decoupe') || category === 'Cuisine & Électroménager') {
    return {
      reasonsToUse: `• Découpe, hache et mixe viandes, légumes, piments et condiments durs en moins de 10 secondes sans aucun effort.
• Fini les larmes en coupant les oignons et les brûlures de piment sur les doigts.
• Lames tranchantes en acier inoxydable multi-niveaux et bol en verre ou inox alimentaire renforcé.
• Nettoyage ultra-rapide sous l'eau en quelques secondes.`,
      problemsSolved: `• Préparations culinaires longues et éreintantes au mortier ou au couteau traditionnel après une journée de travail.
• Risques de coupures aux mains avec les couteaux émoussés.
• Appareils volumineux et compliqués qui encombrent le plan de travail.`,
      whyItsWorthIt: `• Effet Waouh instantané en vidéo : Voir de la viande ou des oignons réduits en purée en 5 secondes déclenche un achat impulsif.
• Cadeau idéal pour les épouses, mamans et passionnées de bonne cuisine locale.
• Marge nette confortable de ${formatFCFA(margin)} pour un prix de vente attractif de ${formatFCFA(sellingPrice)}.`,
      criticalAttentionPoints: `• Puissance moteur : Exiger un moteur cuivre pur (minimum 300W) capable de mixer de la viande sans caler.
• Protection surchauffe : Vérifier la présence d'un disjoncteur thermique automatique pour protéger le moteur.
• Bol incassable : Préférer l'acier inoxydable ou le verre trempé épais résistant aux chocs.`,
      failureRisks: `• 💣 Moteur sous-puissant qui grille si le client tente de broyer des os ou des ingrédients trop durs.
• 💣 Engrenage en plastique fragile qui s'use si les pièces ne s'emboîtent pas parfaitement.
• 💣 Mauvaise utilisation par le client qui maintient le bouton enfoncé en continu au lieu de mixer par impulsions.`,
      buyerPersona: {
        targetAge: '24 - 55 ans',
        genderRatio: 'Femmes (80%) / Hommes (20%)',
        professionalCategory: 'Mères de famille, Travailleuses actives, Cuisinières passionnées, Restauratrices',
        psychologicalTrigger: 'Gain de temps précieux en cuisine, Repas savoureux sans corvée & Fierté culinaire',
      },
      topPositiveReviews: `• ⭐ "Un vrai gain de temps pour préparer la sauce tomate et le piment en rentrant du boulot !"
• ⭐ "Le bol en inox est super solide et ne garde pas les odeurs d'oignon."
• ⭐ "Moteur puissant, hache même la viande de bœuf sans problème."`,
      topNegativeComplaints: `• ⚠️ "Les lames sont extrêmement tranchantes, faire très attention lors du lavage."
• ⚠️ "Mixer par petites impulsions de 5 secondes pour ne pas forcer sur le moteur."
• ⚠️ "Bien positionner le couvercle pour que le contact de sécurité s'enclenche."`,
      commonObjections: [
        {
          objection: 'Est-ce que ça peut hacher de la viande dure ou seulement des légumes ?',
          responseScript: '« Notre modèle Pro est équipé de 4 lames en inox chirurgical et d\'un moteur renforcé capable de hacher viande, poisson, noix et légumes durs en quelques secondes. »',
        },
        {
          objection: 'Est-ce que le moteur ne risque pas de griller rapidement ?',
          responseScript: '« Le moteur dispose d\'une double protection thermique automatique anti-surchauffe avec une garantie SAV d\'échange express en cas de défaut. »',
        },
      ],
      adAngle: 'Vidéo TikTok ultra-rythmée : Découpe d\'un tas d\'oignons et de viande en 3 secondes chrono sans verser une larme.',
      audienceSizeMillion: 6.5,
      seasonalityType: 'all_year',
      returnRisk: 'low',
      viralScoreBonus: 3,
    };
  }

  // 5. BRICOLAGE, RÉPARATION & ÉTANCHÉITÉ
  if (n.includes('colle') || n.includes('soudure') || n.includes('reparation') || n.includes('etanche') || n.includes('bricolage') || n.includes('outil') || category === 'Bricolage & Outillage') {
    return {
      reasonsToUse: `• Répare, soude et scelle instantanément métal, plastique, bois, céramique et tuyaux d'eau haute pression.
• Résiste à des températures extrêmes (-40°C à +150°C), aux vibrations mécaniques et à l'immersion dans l'eau.
• Formule industrielle haute densité polymérisant en quelques minutes sans matériel de soudure complexe.
• Économise des centaines de milliers de FCFA en réparant soi-même cuves, pots d'échappement, radiateurs et canalisations.`,
      problemsSolved: `• Fuites d'eau dévastatrices dans les tuyaux et réservoirs de maison impossibles à souder facilement.
• Pièces métalliques ou plastiques cassées introuvables sur le marché local.
• Coûts de main-d'œuvre exorbitants pour de simples interventions de réparation.`,
      whyItsWorthIt: `• Démonstration "Effet Magique" surpuissante : Montrer un tuyau sous pression qui fuit puis colmaté instantanément cartonne en publicité.
• Poids ultra-léger (${weight} kg) : Coûts de fret aérien presque nuls, permettant une marge nette record (${formatFCFA(margin)}).
• Vente en pack multi-tubes (Pack 3 ou 5 tubes) augmentant le panier moyen.`,
      criticalAttentionPoints: `• Date de péremption : S'assurer auprès de l'usine d'une durée de conservation garantie d'au moins 24 mois.
• Mode d'emploi clair : Fournir une notice vidéo en français expliquant le dégraissage préalable de la surface.
• Emballage hermétique : Tubes métalliques bien scellés pour éviter tout durcissement de la colle durant le transit.`,
      failureRisks: `• 💣 Client appliquant la colle sur une surface sale, grasse ou rouillée sans poncer au préalable.
• 💣 Délais de séchage complet (24h) non respectés avant mise sous haute pression.
• 💣 Tubes percés ou écrasés durant le transport si l'emballage carton n'est pas rigide.`,
      buyerPersona: {
        targetAge: '25 - 65 ans',
        genderRatio: 'Hommes (80%) / Femmes (20%)',
        professionalCategory: 'Bricoleurs, Propriétaires de maison, Plombiers, Mécaniciens, Chauffeurs',
        psychologicalTrigger: 'Économie d\'argent massive, Satisfaction de réparer soi-même & Dépannage d\'urgence',
      },
      topPositiveReviews: `• ⭐ "A colmaté une fuite sous mon évier en 10 minutes alors que le plombier me demandait 25 000 FCFA !"
• ⭐ "Incroyable sur le radiateur de ma voiture, la colle est devenue aussi dure que du métal après séchage."
• ⭐ "Facile à mélanger et à appliquer, tient même sous l'eau."`,
      topNegativeComplaints: `• ⚠️ "Bien poncer la zone à réparer pour une adhérence maximale."
• ⚠️ "Odeur forte lors de l'application, bien aérer la pièce."
• ⚠️ "Attendre 12h avant de remettre sous forte pression d'eau."`,
      commonObjections: [
        {
          objection: 'Est-ce que ça résiste vraiment à la pression d\'eau et à la chaleur d\'un moteur ?',
          responseScript: '« Oui, notre formule industrielle polymérise en une résine ultra-résistante supportant jusqu\'à 150°C et 15 bars de pression hydraulique. »',
        },
        {
          objection: 'Est-ce que le tube ne va pas sécher après la première ouverture ?',
          responseScript: '« Le système à double seringue/bouchon hermétique empêche le contact avec l\'air et permet de réutiliser le produit pendant plus de 2 ans. »',
        },
      ],
      adAngle: 'Vidéo TikTok Hook : Un seau d\'eau percé qui fuit en direct -> Application de la colle -> Étanchéité parfaite immédiate.',
      audienceSizeMillion: 5.5,
      seasonalityType: 'all_year',
      returnRisk: 'low',
      viralScoreBonus: 3,
    };
  }

  // 6. BEAUTÉ & COSMÉTIQUE
  if (n.includes('brosse') || n.includes('lissante') || n.includes('visage') || n.includes('peau') || n.includes('cheveux') || n.includes('epilateur') || category === 'Beauté & Cosmétique') {
    return {
      reasonsToUse: `• Coiffage et lissage professionnel digne d'un salon de coiffure en moins de 10 minutes chez soi.
• Protège la fibre capillaire grâce au revêtement céramique tourmaline et technologie ionique anti-frisottis.
• Chauffage ultra-rapide en 30 secondes avec température réglable adaptée à tous types de cheveux (afro, crépus, défrisés, lisses).
• Cordon rotatif 360° ergonomique empêchant tout nœud lors de l'utilisation.`,
      problemsSolved: `• Heures interminables et coûteuses passées au salon de coiffure chaque week-end.
• Brûlures et pointes abîmées causées par les fers à lisser métalliques traditionnels trop agressifs.
• Frustration des frisottis qui réapparaissent immédiatement à cause de l'humidité ambiante.`,
      whyItsWorthIt: `• Pouvoir d'achat et fidélité de la clientèle féminine : La beauté est un secteur prioritaire d'achat en Afrique de l'Ouest.
• Panier moyen élevé et marge brute nette généreuse (${formatFCFA(margin)}).
• Fort potentiel viral sur TikTok et Instagram avec vidéos de transformation capillaire "Avant / Après".`,
      criticalAttentionPoints: `• Prise secteur : Vérifier impérativement la prise européenne 220V adaptée au réseau local.
• Dents anti-brûlure : Vérifier que les pointes de la brosse restent tièdes au toucher pour éviter de brûler le cuir chevelu.
• Câble pivotant : Contrôler la souplesse du pivot rotatif à la base du manche.`,
      failureRisks: `• 💣 Température maximale insuffisante pour lisser efficacement les cheveux afros très denses.
• 💣 Élément chauffant bas de gamme qui met trop de temps à monter en température.
• 💣 Plastique dégageant une odeur de chaud désagréable lors des premières utilisations.`,
      buyerPersona: {
        targetAge: '18 - 45 ans',
        genderRatio: 'Femmes (90%) / Hommes (10%)',
        professionalCategory: 'Jeunes actives, Étudiantes, Cadres, Femmes soucieuses de leur élégance',
        psychologicalTrigger: 'Beauté rayonnante, Confiance en soi, Gain de temps matinal & Économie de salon',
      },
      topPositiveReviews: `• ⭐ "Mes cheveux crépus sont devenus lisses et soyeux en seulement 8 minutes !"
• ⭐ "Ne brûle pas le cuir chevelu grâce aux picots en silicone protecteurs."
• ⭐ "Je n'ai plus besoin d'aller au salon chaque samedi, rentabilisé en 2 semaines."`,
      topNegativeComplaints: `• ⚠️ "Bien sécher les cheveux avant de passer la brosse pour un résultat optimal."
• ⚠️ "Séparer les cheveux en petites mèches pour un lissage parfait de la racine aux pointes."
• ⚠️ "Le manche peut devenir légèrement tiède après 20 minutes d'utilisation continue."`,
      commonObjections: [
        {
          objection: 'Est-ce que ça marche vraiment sur les cheveux crépus ou naturels très épais ?',
          responseScript: '« Oui ! Notre modèle Pro monte jusqu\'à 230°C avec dents chauffantes en céramique ionique spécialement conçues pour dompter et lisser les cheveux afros les plus denses sans les brûler. »',
        },
        {
          objection: 'Est-ce que ça ne va pas brûler mes cheveux comme les vieux fers à lisser ?',
          responseScript: '« La technologie céramique tourmaline diffuse une chaleur constante et homogène qui scelle l\'écaille du cheveu au lieu de le brûler, laissant votre chevelure brillante et douce. »',
        },
      ],
      adAngle: 'UGC TikTok : Transformation en direct d\'une mèche de cheveux crépus en cheveux soyeux au premier passage de la brosse.',
      audienceSizeMillion: 7.2,
      seasonalityType: 'all_year',
      returnRisk: 'low',
      viralScoreBonus: 3,
    };
  }

  // 7. HIGH-TECH, SÉCURITÉ & MAISON PAR DÉFAUT
  return {
    reasonsToUse: `• Apporte une solution technologique moderne, rapide et pratique au quotidien.
• Économise du temps et de l'énergie en automatisant une corvée manuelle pénible.
• Ergonomie intuitive : prêt à l'emploi en quelques secondes sans configuration complexe.
• Conception compacte et robuste adaptée aux réalités d'utilisation quotidienne en Afrique.`,
    problemsSolved: `• Élimine la frustration quotidienne liée aux méthodes obsolètes, lentes ou inefficaces.
• Réduit les coûts d'entretien, de réparation ou de remplacement récurrents.
• Offre un confort et une sécurité immédiate dans le foyer ou l'activité professionnelle.`,
    whyItsWorthIt: `• Excellente rentabilité unitaire : Marge nette estimée à ${formatFCFA(margin)} pour un prix de vente de ${formatFCFA(sellingPrice)}.
• Fort coefficient de valeur perçue : Le client perçoit l'article comme une réelle opportunité qualité/prix.
• Vente facilitée en offre groupée (Bundle Duo / Pack Cadeau) permettant d'absorber facilement les frais de livraison COD.`,
    criticalAttentionPoints: `• Poids & Colisage (${weight} kg) : ${weight > 1.2 ? '⚠️ Poids modéré, privilégier le fret maritime pour optimiser la marge' : '✅ Poids léger adapté à la livraison express moto'}.
• Emballage renforcé : Exiger un calage intérieur solide pour sécuriser le transport lors des tournées livreurs.
• Contrôle Qualité usine : Tester les pièces à la réception pour garantir zéro défaut à la porte du client.`,
    failureRisks: `• 💣 Risque 1 (Qualité fournisseur) : Si l'article présente un défaut d'assemblage, le taux de retour livraison augmentera.
• 💣 Risque 2 (Démonstration pub) : Si la vidéo ne montre pas la solution concrète dans les 3 premières secondes, le coût par acquisition sera élevé.
• 💣 Risque 3 (Logistique) : Injoignabilité des clients lors de la confirmation téléphonique préalable des commandes.`,
    buyerPersona: {
      targetAge: '25 - 50 ans',
      genderRatio: 'Mixte (50% Hommes / 50% Femmes)',
      professionalCategory: 'Salariés, Cadres, Commerçants et familles urbaines',
      psychologicalTrigger: 'Gain de confort, Efficacité au quotidien & Modernité valorisante',
    },
    topPositiveReviews: `• ⭐ "Conforme à la description, fonctionne parfaitement et facilite grandement la vie."
• ⭐ "Très bon rapport qualité/prix par rapport aux magasins de la ville."
• ⭐ "Livraison rapide et produit bien protégé dans son carton d'origine."`,
    topNegativeComplaints: `• ⚠️ "Fournir un guide vidéo rapide sur WhatsApp pour une prise en main encore plus facile."
• ⚠️ "Bien vérifier que tous les accessoires sont inclus dans le carton à la livraison."
• ⚠️ "Emballage extérieur parfois un peu froissé par le transporteur maritime."`,
    commonObjections: [
      {
        objection: 'Est-ce que le produit correspond exactement à la vidéo vue sur Internet ?',
        responseScript: '« Oui tout à fait ! C\'est pour cela que nous pratiquons le paiement à la livraison : vous vérifiez le produit avec notre livreur avant de payer. »',
      },
      {
        objection: 'Avez-vous un service après-vente en cas de souci ?',
        responseScript: '« Absolument, notre service client local vous assiste par WhatsApp et garantit le remplacement express en cas de moindre anomalie sous 48h. »',
      },
    ],
    adAngle: 'Vidéo Publicitaire TikTok / Facebook : Démonstration visuelle claire du problème -> Déballage et solution immédiate -> Appel à l\'action Promo Limitée.',
    audienceSizeMillion: 5.2,
    seasonalityType: 'all_year',
    returnRisk: weight > 1.5 ? 'medium' : 'low',
    viralScoreBonus: 0,
  };
}

function generateDefaultMarketAnalysis(product: ProductData): MarketAnalysisData {
  const { noteNum: score } = calculateNoteFinale(product);
  const margin = calculateMargin(product);
  const cogs = calculateCOGS(product);
  const sellingPrice = Number(product.vente) || 15000;
  const name = product.produit || 'Produit EAA';
  const weight = Number(product.poids) || 0.5;
  const category = product.category || 'Maison & Confort';

  const niche = detectNicheProfile(name, category, weight, sellingPrice, margin);

  // 1. Return Risk
  const codReturnRisk = niche.returnRisk;

  // 2. Viral Factor Score (out of 10)
  const waouh = Number(product.waouh) || 3;
  const innovant = Number(product.innovant) || 3;
  const baseViral = Math.round(waouh * 1.1 + innovant * 0.9);
  const viralFactorScore = Math.min(10, Math.max(4, baseViral + niche.viralScoreBonus));

  // 3. Market Saturation & Competition Level
  let saturationScore: 'low' | 'medium' | 'high' = 'low';
  let competitionLevel: 'low' | 'medium' | 'high' = 'low';
  const competitorCount = Number(product.concurrent) || 0;

  if (competitorCount > 5) {
    saturationScore = 'high';
    competitionLevel = 'high';
  } else if (competitorCount >= 2) {
    saturationScore = 'medium';
    competitionLevel = 'medium';
  } else {
    saturationScore = 'low';
    competitionLevel = 'low';
  }

  // 4. Strategic Verdict
  let strategicVerdict = '🟢 FEU VERT : Excellent potentiel de scaling en COD avec marge nette solide.';
  if (margin < 3000) {
    strategicVerdict = '🔴 FEU ROUGE : Marge unitaire trop serrée pour absorber les coûts publicitaires et les retours livreurs.';
  } else if (saturationScore === 'high') {
    strategicVerdict = '🟡 FEU ORANGE : Forte concurrence. Vendre exclusivement en Pack Bundle 2-en-1 ou offre spéciale pour se démarquer.';
  } else if (score !== null && score < 25) {
    strategicVerdict = '🟡 FEU ORANGE : Score global modéré. Tester avec un budget publicitaire réduit (20 000 FCFA) avant achat de stock.';
  }

  // 5. Target Countries
  const targetCountries = [
    'Bénin (Cotonou / Calavi / Porto-Novo)',
    "Côte d'Ivoire (Abidjan / Bouaké / Yamoussoukro)",
    'Sénégal (Dakar / Thiès / Mbour)',
    'Togo (Lomé / Kara)',
    'Cameroun (Douala / Yaoundé)',
  ];

  // 6. Key Barrier
  const keyBarrierToEntry = weight <= 0.4
    ? `🪶 Poids très léger (${weight} kg) : Idéal pour fret aérien express et transport moto sans friction.`
    : `⚖️ Poids de ${weight} kg : Attention au coût du fret aérien. Privilégier le groupage maritime pour préserver la marge nette (${formatFCFA(margin)}).`;

  // 7. Projections
  const audienceSizeMillion = niche.audienceSizeMillion;
  const conservativeUnits = Math.round(audienceSizeMillion * 1000 * 0.00035);
  const conservativeRevenueFCFA = conservativeUnits * sellingPrice;
  const conservativeProfitFCFA = conservativeUnits * margin;

  const aggressiveUnits = Math.round(audienceSizeMillion * 1000 * 0.0014);
  const aggressiveRevenueFCFA = aggressiveUnits * sellingPrice;
  const aggressiveProfitFCFA = aggressiveUnits * margin;

  const marketProjections: MarketProjectionsData = {
    conservativeUnits: Math.max(180, conservativeUnits),
    conservativeRevenueFCFA: Math.max(180 * sellingPrice, conservativeRevenueFCFA),
    conservativeProfitFCFA: Math.max(180 * margin, conservativeProfitFCFA),
    aggressiveUnits: Math.max(750, aggressiveUnits),
    aggressiveRevenueFCFA: Math.max(750 * sellingPrice, aggressiveRevenueFCFA),
    aggressiveProfitFCFA: Math.max(750 * margin, aggressiveProfitFCFA),
  };

  // 8. Ad Benchmarks
  const estimatedCPMFCFA = 1600;
  const targetCTR = viralFactorScore >= 7 ? 3.4 : 2.6;
  const targetConversionRate = 11.5;
  const maxAllowedCPAFCFA = Math.max(2500, Math.round(margin * 0.45));

  const adBenchmarks: AdBenchmarksData = {
    estimatedCPMFCFA,
    targetCTR,
    targetConversionRate,
    maxAllowedCPAFCFA,
  };

  // 9. Spy Shortcuts
  const queryParam = encodeURIComponent(product.produit || 'gadget');
  const spyShortcuts: SpyShortcutsData = {
    facebookAdsUrl: `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${queryParam}&search_type=keyword_unordered&media_type=all`,
    tiktokSearchUrl: `https://www.tiktok.com/search?q=${queryParam}`,
    aliexpressReviewsUrl: `https://www.aliexpress.com/wholesale?SearchText=${queryParam}`,
    amazonReviewsUrl: `https://www.amazon.com/s?k=${queryParam}`,
    googleTrendsUrl: `https://trends.google.com/trends/explore?q=${queryParam}`,
  };

  return {
    saturationScore,
    competitionLevel,
    audienceSizeMillion,
    viralFactorScore,
    codReturnRisk,
    seasonalityType: niche.seasonalityType,
    strategicVerdict,
    targetCountries,
    keyBarrierToEntry,
    recommendedAdAngle: niche.adAngle,
    reasonsToUse: niche.reasonsToUse,
    problemsSolved: niche.problemsSolved,
    whyItsWorthIt: niche.whyItsWorthIt,
    criticalAttentionPoints: niche.criticalAttentionPoints,
    failureRisks: niche.failureRisks,
    buyerPersona: niche.buyerPersona,
    marketProjections,
    adBenchmarks,
    reviewsAndObjections: {
      topPositiveReviews: niche.topPositiveReviews,
      topNegativeComplaints: niche.topNegativeComplaints,
      commonObjections: niche.commonObjections,
    },
    spyShortcuts,
  };
}

export function getProductMarketAnalysis(product: ProductData): MarketAnalysisData {
  if (!product) {
    return {
      saturationScore: 'low',
      competitionLevel: 'low',
      audienceSizeMillion: 5,
      viralFactorScore: 5,
      codReturnRisk: 'low',
      seasonalityType: 'all_year',
      strategicVerdict: '🟢 FEU VERT',
      targetCountries: [],
      keyBarrierToEntry: '',
      recommendedAdAngle: '',
      reasonsToUse: '',
      problemsSolved: '',
      whyItsWorthIt: '',
      criticalAttentionPoints: '',
      failureRisks: '',
      buyerPersona: { targetAge: '', genderRatio: '', professionalCategory: '', psychologicalTrigger: '' },
      marketProjections: { conservativeUnits: 0, conservativeRevenueFCFA: 0, conservativeProfitFCFA: 0, aggressiveUnits: 0, aggressiveRevenueFCFA: 0, aggressiveProfitFCFA: 0 },
      adBenchmarks: { estimatedCPMFCFA: 1600, targetCTR: 2.5, targetConversionRate: 10, maxAllowedCPAFCFA: 3000 },
      reviewsAndObjections: { topPositiveReviews: '', topNegativeComplaints: '', commonObjections: [] },
      spyShortcuts: { facebookAdsUrl: '', tiktokSearchUrl: '', aliexpressReviewsUrl: '', amazonReviewsUrl: '', googleTrendsUrl: '' },
    };
  }

  const defaults = generateDefaultMarketAnalysis(product);
  if (!product.marketAnalysis) {
    return defaults;
  }

  const custom = product.marketAnalysis;

  const buyerPersona: BuyerPersonaData = {
    targetAge: custom.buyerPersona?.targetAge || defaults.buyerPersona?.targetAge || '25 - 50 ans',
    genderRatio: custom.buyerPersona?.genderRatio || defaults.buyerPersona?.genderRatio || 'Mixte (50% H / 50% F)',
    professionalCategory: custom.buyerPersona?.professionalCategory || defaults.buyerPersona?.professionalCategory || 'Salariés, Cadres & Commerçants',
    psychologicalTrigger: custom.buyerPersona?.psychologicalTrigger || defaults.buyerPersona?.psychologicalTrigger || 'Gain de confort & Fierté',
  };

  const marketProjections: MarketProjectionsData = {
    conservativeUnits: custom.marketProjections?.conservativeUnits ?? defaults.marketProjections?.conservativeUnits ?? 250,
    conservativeRevenueFCFA: custom.marketProjections?.conservativeRevenueFCFA ?? defaults.marketProjections?.conservativeRevenueFCFA ?? 3750000,
    conservativeProfitFCFA: custom.marketProjections?.conservativeProfitFCFA ?? defaults.marketProjections?.conservativeProfitFCFA ?? 1875000,
    aggressiveUnits: custom.marketProjections?.aggressiveUnits ?? defaults.marketProjections?.aggressiveUnits ?? 1200,
    aggressiveRevenueFCFA: custom.marketProjections?.aggressiveRevenueFCFA ?? defaults.marketProjections?.aggressiveRevenueFCFA ?? 18000000,
    aggressiveProfitFCFA: custom.marketProjections?.aggressiveProfitFCFA ?? defaults.marketProjections?.aggressiveProfitFCFA ?? 9000000,
  };

  const adBenchmarks: AdBenchmarksData = {
    estimatedCPMFCFA: custom.adBenchmarks?.estimatedCPMFCFA ?? defaults.adBenchmarks?.estimatedCPMFCFA ?? 1600,
    targetCTR: custom.adBenchmarks?.targetCTR ?? defaults.adBenchmarks?.targetCTR ?? 2.8,
    targetConversionRate: custom.adBenchmarks?.targetConversionRate ?? defaults.adBenchmarks?.targetConversionRate ?? 11.5,
    maxAllowedCPAFCFA: custom.adBenchmarks?.maxAllowedCPAFCFA ?? defaults.adBenchmarks?.maxAllowedCPAFCFA ?? 3500,
  };

  const reviewsAndObjections: ReviewsAndObjectionsData = {
    topPositiveReviews: custom.reviewsAndObjections?.topPositiveReviews || defaults.reviewsAndObjections?.topPositiveReviews || '',
    topNegativeComplaints: custom.reviewsAndObjections?.topNegativeComplaints || defaults.reviewsAndObjections?.topNegativeComplaints || '',
    commonObjections:
      custom.reviewsAndObjections?.commonObjections && custom.reviewsAndObjections.commonObjections.length > 0
        ? custom.reviewsAndObjections.commonObjections
        : defaults.reviewsAndObjections?.commonObjections || [],
  };

  const spyShortcuts: SpyShortcutsData = {
    facebookAdsUrl: custom.spyShortcuts?.facebookAdsUrl || defaults.spyShortcuts?.facebookAdsUrl || '',
    tiktokSearchUrl: custom.spyShortcuts?.tiktokSearchUrl || defaults.spyShortcuts?.tiktokSearchUrl || '',
    aliexpressReviewsUrl: custom.spyShortcuts?.aliexpressReviewsUrl || defaults.spyShortcuts?.aliexpressReviewsUrl || '',
    amazonReviewsUrl: custom.spyShortcuts?.amazonReviewsUrl || defaults.spyShortcuts?.amazonReviewsUrl || '',
    googleTrendsUrl: custom.spyShortcuts?.googleTrendsUrl || defaults.spyShortcuts?.googleTrendsUrl || '',
  };

  return {
    ...defaults,
    ...custom,
    targetCountries: custom.targetCountries && custom.targetCountries.length > 0
      ? custom.targetCountries
      : defaults.targetCountries,
    buyerPersona,
    marketProjections,
    adBenchmarks,
    reviewsAndObjections,
    spyShortcuts,
  };
}

export function getCategoryIcon(category?: string): string {
  switch (category) {
    case 'Maison & Confort': return '🏠';
    case 'Santé & Bien-être': return '🩺';
    case 'Beauté & Cosmétique': return '💄';
    case 'High-Tech & Gadgets': return '⚡';
    case 'Cuisine & Électroménager': return '🍳';
    case 'Auto & Moto': return '🚗';
    case 'Sécurité & Surveillance': return '🛡️';
    case 'Enfants & Bébés': return '👶';
    case 'Mode & Accessoires': return '👗';
    case 'Bricolage & Outillage': return '🔨';
    case 'Sport & Fitness': return '🏋️';
    default: return '📦';
  }
}
