export type YokdeListing = {
  id: string;
  title: string;
  slug: string;
  image: string;
  priceUsd: number;
  featuredOrder?: number;
};

export const YOKDE_SHOP_URL = "https://www.etsy.com/shop/yokde";
export const YOKDE_IMPORTED_AT = "2026-10-01";

// One-time snapshot of the public Yokde Etsy storefront on 2026-10-01.
// Prices and availability can change on Etsy; visitors are directed there to buy.
export const YOKDE_LISTINGS: readonly YokdeListing[] = [
  {
    id: "4558313318",
    title: "Blue Butterfly T-Shirt | Minimal Chest Print, 100% Cotton Tee",
    slug: "blue-butterfly-t-shirt-minimal-chest",
    image: "https://i.etsystatic.com/22134857/r/il/6dc17e/8400190154/il_340x270.8400190154_5ads.jpg",
    priceUsd: 20.99,
  },
  {
    id: "4557042700",
    title: "Vintage Flying Geese Illustration T-Shirt, Nature Lover Bird Art Tee",
    slug: "vintage-flying-geese-illustration-t",
    image: "https://i.etsystatic.com/22134857/c/1219/1219/409/414/il/74a7d0/8438944109/il_340x270.8438944109_soue.jpg",
    priceUsd: 20.45,
  },
  {
    id: "4556564080",
    title: "Teddy Bear Picnic T-Shirt | Floral, Bee, Pumpkin Art (100% Cotton)",
    slug: "cute-pink-teddy-bear-picnic-t-shirt",
    image: "https://i.etsystatic.com/22134857/r/il/68500d/8435358621/il_340x270.8435358621_30dt.jpg",
    priceUsd: 25.74,
  },
  {
    id: "4556558974",
    title: "Pink Glitter Star T-Shirt | Hand-Painted Celestial Design, Soft Cotton Tee",
    slug: "pink-glitter-star-t-shirt-sparkle",
    image: "https://i.etsystatic.com/22134857/r/il/976efb/8387441688/il_340x270.8387441688_r0rd.jpg",
    priceUsd: 25.74,
  },
  {
    id: "4556517279",
    title: "Spartan Helmet Odyssey Tee | Painterly Silhouette, Mythic Adventure Shirt",
    slug: "spartan-helmet-silhouette-tee-odyssey",
    image: "https://i.etsystatic.com/22134857/r/il/d7dc30/8435133805/il_340x270.8435133805_iuwr.jpg",
    priceUsd: 24.3,
  },
  {
    id: "4556516335",
    title: "The Odyssey Spartan Helmet Ship Phone Case, MagSafe Compatible Dual-Layer Protection",
    slug: "the-odyssey-spartan-helmet-and-ship",
    image: "https://i.etsystatic.com/22134857/r/il/b7c792/8387246096/il_340x270.8387246096_s1o2.jpg",
    priceUsd: 28.76,
  },
  {
    id: "4556505957",
    title: "The Odyssey Graphic Tee | Greek Myth Ship Storm Art Shirt",
    slug: "the-odyssey-graphic-tee-greek-myth-ship",
    image: "https://i.etsystatic.com/22134857/r/il/b5cf51/8387181536/il_340x270.8387181536_nz0v.jpg",
    priceUsd: 24.3,
  },
  {
    id: "4556491711",
    title: "Nerdy Chick T-Shirt | Wide-Eyed Cartoon Chick Print, 100% Cotton Tee",
    slug: "cute-nerdy-chick-t-shirt-small-cartoon",
    image: "https://i.etsystatic.com/22134857/r/il/7d110d/8387085412/il_340x270.8387085412_neh4.jpg",
    priceUsd: 24.3,
  },
  {
    id: "4556463991",
    title: "The Universe Grows In Silence Embroidered Sweatshirt, Minimalist Floral Crewneck, Contemplative Apparel",
    slug: "the-universe-grows-in-silence-sweatshirt",
    image: "https://i.etsystatic.com/22134857/r/il/9b20be/8434768255/il_340x270.8434768255_dir3.jpg",
    priceUsd: 44.31,
  },
  {
    id: "4555687358",
    title: "La Catrina Skull T-Shirt | Día de los Muertos Street Art Tee (100% Cotton)",
    slug: "la-catrina-skull-illustration-t-shirt",
    image: "https://i.etsystatic.com/22134857/r/il/19f059/8429328029/il_340x270.8429328029_cuwd.jpg",
    priceUsd: 24.3,
  },
  {
    id: "4555672662",
    title: "Black Ford Truck Poster | Low-Angle, Lush Grass, Late-Afternoon Light (Giclée Print)",
    slug: "black-ford-truck-poster-rolled-poster",
    image: "https://i.etsystatic.com/22134857/r/il/a316f6/8429356753/il_340x270.8429356753_3m7m.jpg",
    priceUsd: 18.45,
  },
  {
    id: "4555278575",
    title: "Lineup Cat Sketch T-Shirt | Minimalist Pet Lover Gift, 100% Cotton Tee",
    slug: "row-of-cat-sketches-t-shirt-minimal-line",
    image: "https://i.etsystatic.com/22134857/r/il/e771aa/8439190111/il_340x270.8439190111_pvbl.jpg",
    priceUsd: 24.3,
  },
  {
    id: "4555278346",
    title: "Dog Listening to Gramophone T-Shirt | Vintage Music Lover Gift",
    slug: "dog-listening-to-gramophone-t-shirt",
    image: "https://i.etsystatic.com/22134857/r/il/571846/8391309586/il_340x270.8391309586_t3jd.jpg",
    priceUsd: 24.3,
  },
  {
    id: "4555126328",
    title: "Vintage Liberty Lady Waving Flag Tee, Patriotic Americana Cotton Shirt",
    slug: "vintage-liberty-lady-waving-american",
    image: "https://i.etsystatic.com/22134857/r/il/34aac5/8391309638/il_340x270.8391309638_3zp0.jpg",
    priceUsd: 24.3,
  },
  {
    id: "4554707901",
    title: "Line Art House Canvas | Minimalist Home Tree Art, Scandinavian Style",
    slug: "line-art-house-canvas-neutral",
    image: "https://i.etsystatic.com/22134857/c/1484/1484/489/84/il/ef4524/8373944664/il_340x270.8373944664_2398.jpg",
    priceUsd: 18.63,
  },
  {
    id: "4554484483",
    title: "Whimsical Pumpkin Witch Hat T-Shirt | Subtle Halloween Illustration, 100% Cotton",
    slug: "pumpkin-witch-hat-t-shirt-halloween",
    image: "https://i.etsystatic.com/22134857/r/il/6232d0/8374486870/il_340x270.8374486870_6frc.jpg",
    priceUsd: 24.3,
  },
  {
    id: "4554123170",
    title: "Vintage American Muscle Car Tee | Distressed Garage Art, Heavyweight Cotton Shirt",
    slug: "vintage-american-muscle-car-tee",
    image: "https://i.etsystatic.com/22134857/c/1024/1024/604/451/il/6805e8/8420659331/il_340x270.8420659331_knqr.jpg",
    priceUsd: 24.3,
  },
  {
    id: "4554094206",
    title: "Vintage Botanical Birds Floral Illustration Shirt, 100% Cotton Tee",
    slug: "vintage-botanical-birds-floral",
    image: "https://i.etsystatic.com/22134857/c/1024/1024/507/511/il/b38a4a/8372777280/il_340x270.8372777280_gmze.jpg",
    priceUsd: 24.3,
  },
  {
    id: "4554091930",
    title: "Watercolor Kissing Bunnies T-Shirt: Pastel Ribboned Rabbits, Vintage Charm Tee",
    slug: "watercolor-bunny-t-shirt-kissing-rabbits",
    image: "https://i.etsystatic.com/22134857/c/1119/1119/580/376/il/a35437/8372787634/il_340x270.8372787634_6629.jpg",
    priceUsd: 24.3,
  },
  {
    id: "4554080296",
    title: "Vintage Engraving Index Finger T-Shirt, Hand-Drawn Illustration, Midweight Cotton Tee",
    slug: "pointing-index-finger-illustration-t",
    image: "https://i.etsystatic.com/22134857/r/il/70ac58/8391310890/il_340x270.8391310890_gr7m.jpg",
    priceUsd: 24.3,
  },
  {
    id: "4553999281",
    title: "Brown Sparrow Illustration T-Shirt | Hand-Drawn Bird Art, 100% Cotton",
    slug: "small-sparrow-t-shirt-minimal-bird",
    image: "https://i.etsystatic.com/22134857/r/il/162c92/8391337538/il_340x270.8391337538_fkfv.jpg",
    priceUsd: 24.3,
    featuredOrder: 2,
  },
  {
    id: "4553957007",
    title: "Open Book Wildflowers Tee | Botanical Novel Design, 100% Cotton Shirt",
    slug: "book-lover-t-shirt-open-book-with",
    image: "https://i.etsystatic.com/22134857/r/il/870712/8391309440/il_340x270.8391309440_k4ty.jpg",
    priceUsd: 16.45,
  },
  {
    id: "4553964272",
    title: "Minimalist Flying Birds Hoodie | Soft Cotton-Poly Blend, Nature-Inspired Design",
    slug: "flying-birds-hoodie-minimal-flock",
    image: "https://i.etsystatic.com/22134857/r/il/b93201/8439188395/il_340x270.8439188395_pt0u.jpg",
    priceUsd: 50.45,
  },
  {
    id: "4553935659",
    title: "Uncle Sam Pointing Mug | Patriotic Americana Ceramic Coffee Cup (11oz/15oz)",
    slug: "uncle-sam-pointing-mug-patriotic",
    image: "https://i.etsystatic.com/22134857/r/il/35ef29/8439188211/il_340x270.8439188211_ihp0.jpg",
    priceUsd: 20.45,
  },
  {
    id: "4553903547",
    title: "Black Ink Lily T-Shirt | Minimalist Floral Cotton Tee (100% Ring-Spun Cotton)",
    slug: "black-ink-lily-t-shirt-minimal-floral",
    image: "https://i.etsystatic.com/22134857/r/il/bae4d4/8439188103/il_340x270.8439188103_n34j.jpg",
    priceUsd: 24.93,
  },
  {
    id: "4553535753",
    title: "Hero Cat T-Shirt | Orange Illustration, Cape, Armor, Gift for Cat Lovers",
    slug: "hero-cat-t-shirt-orange-cat-in-cape",
    image: "https://i.etsystatic.com/22134857/c/1024/1024/422/92/il/77341d/8420677375/il_340x270.8420677375_ft1n.jpg",
    priceUsd: 41,
  },
  {
    id: "4553514748",
    title: "Superhero Mouse Phone Case, Magnetic Impact, Polycarbonate TPU, MagSafe Compatible",
    slug: "superhero-mouse-phone-case-magnetic",
    image: "https://i.etsystatic.com/22134857/r/il/c7cca1/8413332295/il_340x270.8413332295_4lkx.jpg",
    priceUsd: 40,
  },
  {
    id: "4553507960",
    title: "Wonder Mouse Superhero T-Shirt | Ring-Spun Cotton, Softstyle Tee",
    slug: "wonder-mouse-superhero-costume-t-shirt",
    image: "https://i.etsystatic.com/22134857/c/1024/1024/392/125/il/294bff/8372800740/il_340x270.8372800740_k3wy.jpg",
    priceUsd: 34,
  },
  {
    id: "4553489738",
    title: "Timeless Joy Birthday Cake T-Shirt: Nostalgic Celebration Tee (100% Cotton)",
    slug: "birthday-cake-t-shirt-timeless-joy-retro",
    image: "https://i.etsystatic.com/22134857/r/il/88a051/8365416192/il_340x270.8365416192_gsbo.jpg",
    priceUsd: 41,
  },
  {
    id: "4553486586",
    title: "Masked Moonlight Smugglers Halloween T-Shirt: Spooky Neon Cemetery Graphic Tee",
    slug: "halloween-skeleton-t-shirt-masked",
    image: "https://i.etsystatic.com/22134857/c/1024/1024/507/511/il/77835f/8372802436/il_340x270.8372802436_20n6.jpg",
    priceUsd: 41,
  },
  {
    id: "4553471513",
    title: "Hand-Drawn Pumpkin Halloween T-Shirt, Cozy Autumn Night Art (100% Cotton)",
    slug: "jack-o-lantern-pumpkin-halloween-t",
    image: "https://i.etsystatic.com/22134857/c/1024/1024/464/197/il/93740c/8420682981/il_340x270.8420682981_h8z1.jpg",
    priceUsd: 41,
  },
  {
    id: "4553434148",
    title: "Botanical Floral Crewneck Sweatshirt: Navy White Flower Print, Unisex Pullover",
    slug: "botanical-floral-crewneck-sweatshirt",
    image: "https://i.etsystatic.com/22134857/c/1024/1024/507/511/il/e36096/8372807452/il_340x270.8372807452_c5jh.jpg",
    priceUsd: 62,
    featuredOrder: 3,
  },
  {
    id: "4553414944",
    title: "Colorful Songbird T-Shirt: Row of Birds, Nature Lover Gift",
    slug: "small-sparrow-t-shirt-minimal-bird",
    image: "https://i.etsystatic.com/22134857/r/il/058f18/8429394589/il_340x270.8429394589_c0i2.jpg",
    priceUsd: 44,
    featuredOrder: 1,
  },
  {
    id: "4553411018",
    title: "Retro 80s Collage T-Shirt | Cassette, Boombox, Roller Skates (Cotton Tee)",
    slug: "retro-vibes-collage-t-shirt-80s",
    image: "https://i.etsystatic.com/22134857/c/1024/1024/476/431/il/e43139/8372812992/il_340x270.8372812992_7fid.jpg",
    priceUsd: 41,
  },
  {
    id: "4553397617",
    title: "Retro Tech Collage T-Shirt | Vintage Gadgets, Pixelated Screens (Ring-Spun Cotton)",
    slug: "retro-tech-collage-t-shirt-vintage",
    image: "https://i.etsystatic.com/22134857/c/1024/1024/520/354/il/665102/8372815184/il_340x270.8372815184_5yp1.jpg",
    priceUsd: 41,
  },
  {
    id: "4553393557",
    title: "90s Electronics Graphic Tee, Cassette Mixtape Vibes, Vintage Gadgets Shirt",
    slug: "90s-electronics-graphic-tee-vintage",
    image: "https://i.etsystatic.com/22134857/c/1024/1024/520/451/il/9f71e5/8372820056/il_340x270.8372820056_etww.jpg",
    priceUsd: 34,
    featuredOrder: 4,
  },
] as const;

export const YOKDE_FEATURED_LISTINGS = YOKDE_LISTINGS
  .filter((listing) => listing.featuredOrder !== undefined)
  .slice()
  .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));

export function yokdeListingUrl(listing: YokdeListing): string {
  return `https://www.etsy.com/listing/${listing.id}/${listing.slug}`;
}
