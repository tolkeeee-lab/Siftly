import { ProductData } from '../types/product';
import { VideoScript, MarketingAngle } from '../types/adsStudio';
import { formatFCFA } from './formatters';

export function generateProductVideoScripts(product: ProductData | null): VideoScript[] {
  const name = product?.produit?.trim() || 'Ce produit innovant';
  const price = Number(product?.vente) || 12500;
  const target = product?.cible?.trim() || 'tout le monde à Cotonou et Abidjan';
  const angle = product?.angle?.trim() || 'La solution indispensable pour en finir avec ce calvaire';

  return [
    {
      id: 'script-problem-solution',
      format: 'problem_solution',
      title: 'Script #1 : Problème Aigu $\\to$ Soulagement Immédiat',
      badge: '🔥 Fort Taux de Clic (CTR)',
      hookHeadline: `« Si vous en avez marre de souffrir de ça tous les jours, regardez bien cette vidéo jusqu'à la fin ! »`,
      callToAction: `Commandez maintenant et payez à la livraison chez vous à Cotonou/Abidjan ! Stock limité !`,
      scenes: [
        {
          id: 'sc-1',
          timing: '0:00 - 0:03 (HOOK)',
          visual: 'Gros plan sur une personne frustrée ou montrant le problème en situation réelle, visage crispé.',
          audio: `Arrêtez de gaspiller votre argent dans des fausses solutions ! Si vous faites partie des ${target}, voici ce qui va changer vos journées.`,
          tip: 'Rythme rapide, texte rouge percutant en haut de l’écran.',
        },
        {
          id: 'sc-2',
          timing: '0:03 - 0:15 (DOULEUR)',
          visual: 'Zoom sur le problème quotidien et les conséquences si rien n’est fait.',
          audio: `Combien de fois vous avez perdu du temps ou de l’énergie à cause de ce souci ? La plupart des gens ignorent qu’il existe une solution simple et durable.`,
          tip: 'Musique de tension, transition sonore (whoosh).',
        },
        {
          id: 'sc-3',
          timing: '0:15 - 0:30 (RÉVÉLATION DU PRODUIT)',
          visual: `Déballage et utilisation immédiate de ${name}. Démonstration claire du fonctionnement en 5 secondes.`,
          audio: `Voici ${name}. ${angle}. En seulement quelques secondes d'utilisation, le résultat est visible et garanti.`,
          tip: 'Plan lumineux, montrer le produit en action dans les mains.',
        },
        {
          id: 'sc-4',
          timing: '0:30 - 0:45 (OFFRE & CALL TO ACTION)',
          visual: `Affichage du prix promo (${formatFCFA(price)}) avec badge "Paiement à la Livraison" et livraison express.`,
          audio: `Profitez de notre promotion exclusive à seulement ${formatFCFA(price)}. Cliquez sur le lien en bas, recevez votre colis et payez uniquement après vérification !`,
          tip: 'Flèche animée pointant vers le bouton "Commander".',
        },
      ],
    },
    {
      id: 'script-wow-demo',
      format: 'wow_demonstration',
      title: 'Script #2 : Effet Waouh & Démonstration Choc',
      badge: '✨ Viral TikTok / Reels',
      hookHeadline: `« Regardez ce qui se passe quand j'allume ce petit appareil... C'est incroyable ! »`,
      callToAction: `Offre spéciale valable aujourd'hui seulement. Livraison express disponible !`,
      scenes: [
        {
          id: 'sc-2-1',
          timing: '0:00 - 0:03 (HOOK CHOC)',
          visual: `Démonstration ultra-rapide de l'effet le plus impressionnant de ${name}. Zoom avant très rapide.`,
          audio: `Attendez deux secondes ! Vous n'avez jamais vu un accessoire aussi puissant et pratique que celui-ci.`,
          tip: 'Couper le premier souffle, son énergique.',
        },
        {
          id: 'sc-2-2',
          timing: '0:03 - 0:15 (TEST EXTRÊME)',
          visual: 'Mise à l’épreuve du produit dans des conditions difficiles (résistance, efficacité immédiate).',
          audio: `On l'a testé dans les pires conditions. Regardez la différence avant et après : c'est net, sans bavure et sans effort.`,
          tip: 'Écran divisé (Split Screen) Avant / Après.',
        },
        {
          id: 'sc-2-3',
          timing: '0:15 - 0:30 (POURQUOI C’EST SUPÉRIEUR)',
          visual: 'Gros plan sur les matériaux solides et la simplicité de manipulation.',
          audio: `Conçu avec des composants haute qualité, ${name} est portable, autonome et ultra résistant.`,
          tip: 'Montrer les détails de finition sous un bon éclairage.',
        },
        {
          id: 'sc-2-4',
          timing: '0:30 - 0:45 (URGENCE & COMMANDE)',
          visual: 'Montrer le livreur remettant le colis avec le sourire + bouton d’achat.',
          audio: `Seulement quelques unités disponibles pour cette semaine à ${formatFCFA(price)}. Cliquez ci-dessous pour réserver le vôtre maintenant !`,
          tip: 'Mention "Paiement à la réception 100% sécurisé".',
        },
      ],
    },
    {
      id: 'script-anti-counterfeit',
      format: 'anti_counterfeit',
      title: 'Script #3 : Comparatif Qualité Authentique vs Marché Local',
      badge: '🛡️ Forte Confiance & Conversion',
      hookHeadline: `« Ne faites pas l'erreur d'acheter les imitations à bas prix qui se gâtent après 2 jours ! »`,
      callToAction: `Garantie 7 jours satisfaits ou remboursés. Commandez l'original ici !`,
      scenes: [
        {
          id: 'sc-3-1',
          timing: '0:00 - 0:03 (HOOK MISE EN GARDE)',
          visual: 'Comparaison côte-à-côte : à gauche un produit cassé/médiocre, à droite notre produit robuste.',
          audio: `Attention ! Beaucoup achètent des copies bon marché au marché et le regrettent dès la première semaine.`,
          tip: 'Croix rouge sur la mauvaise copie, coche verte sur notre produit.',
        },
        {
          id: 'sc-3-2',
          timing: '0:03 - 0:18 (LA DIFFÉRENCE DE QUALITÉ)',
          visual: `Démontrer la solidité et les finitions de ${name} par rapport aux contrefaçons fragiles.`,
          audio: `Notre version originale de ${name} dispose d'un moteur renforcé et de matériaux certifiés qui durent des années.`,
          tip: 'Toucher les boutons, montrer la robustesse.',
        },
        {
          id: 'sc-3-3',
          timing: '0:18 - 0:30 (GARANTIE & TRANQUILLITÉ)',
          visual: 'Affichage du badge de garantie 7 jours et du service client local.',
          audio: `Vous bénéficiez d'une garantie totale avec assistance directe sur WhatsApp et échange immédiat si nécessaire.`,
          tip: 'Logo WhatsApp officiel avec numéro de support.',
        },
        {
          id: 'sc-3-4',
          timing: '0:30 - 0:45 (COMMANDE SÉCURISÉE)',
          visual: `Pack complet avec accessoires + prix spécial (${formatFCFA(price)}).`,
          audio: `Ne prenez aucun risque : recevez l'original directement chez vous et payez le livreur uniquement à la remise du colis !`,
          tip: 'Appel à l’action franc et direct.',
        },
      ],
    },
  ];
}

export function generateMarketingAngles(product: ProductData | null): MarketingAngle[] {
  const name = product?.produit?.trim() || 'Ce produit';
  const target = product?.cible?.trim() || 'Particuliers et professionnels';
  const angle = product?.angle?.trim() || 'Performance et confort au quotidien';

  return [
    {
      id: 'ang-1',
      name: 'Angle Douleur & Frustration',
      icon: '⚡',
      hook: `« Marre de perdre votre temps avec des solutions inefficaces ? »`,
      targetAudience: target,
      coreBenefit: `Élimine la cause du problème en quelques minutes sans effort.`,
    },
    {
      id: 'ang-2',
      name: 'Angle Économie & Rentabilité',
      icon: '💰',
      hook: `« Pourquoi dépenser une fortune quand un seul appareil peut tout régler ? »`,
      targetAudience: `Personnes soucieuses de leur budget et anti-gaspillage.`,
      coreBenefit: `Rentabilisé dès la première semaine d'utilisation.`,
    },
    {
      id: 'ang-3',
      name: 'Angle Rapidité & Confort',
      icon: '⏱️',
      hook: `« Obtenez des résultats impeccables en moins de 60 secondes ! »`,
      targetAudience: `Gens pressés, cadres, parents actifs.`,
      coreBenefit: `Gain de temps considérable et zéro complication.`,
    },
    {
      id: 'ang-4',
      name: 'Angle Tendance & Statut',
      icon: '🌟',
      hook: `« Le nouvel accessoire tendance dont tout le monde parle enfin disponible ! »`,
      targetAudience: `Jeunes branchés, passionnés d'innovation.`,
      coreBenefit: `Design élégant et effet Waouh garanti devant vos proches.`,
    },
  ];
}
