export function FixedTextSection() {
  return (
    <section className="bg-secondary px-6 py-12 md:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2
          className="mb-4 text-2xl font-semibold text-med-nav md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Votre sante, notre priorite
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-med-nav/80 md:text-lg">
          MediShop est votre partenaire sante en ligne. Nous proposons une large gamme de produits
          medicaux, d'equipements de soin et de bien-etre, selectionnes avec soin par nos
          pharmaciens. Livraison rapide, prix competitifs et conseils personnalises pour repondre
          a tous vos besoins.
        </p>
      </div>
    </section>
  );
}
