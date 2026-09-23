import { describe, it, expect } from "vitest";
import { itemListLd, productLd, ingredientLd, faqLd, orgLd } from "../schema";

const P: any = { product_id:"1", name:"Acne Serum", brand:"X", url:"https://www.konvy.com/x-1.html",
  image_url:"https://img/x.jpg", description:"d", price_thb:300, konvy_rating:4.6, konvy_review_count:200,
  review_summary:{ samples:[{rating:5,body:"good",author:"a"}] } };

describe("schema", () => {
  it("itemList has ordered items", () => {
    const ld = itemListLd("https://site/th/acne", [P], (p)=>`https://site/th/product/${p.product_id}`);
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.itemListElement[0].position).toBe(1);
  });
  it("product carries no third-party rating markup", () => {
    const ld = productLd(P, "https://site/th/product/1");
    expect(ld["@type"]).toBe("Product");
    // No rating markup: the stars and review text on these pages come from
    // Konvy and Watsons, and Google's review-snippet policy only allows markup
    // for reviews the site collected itself.
    expect(ld.aggregateRating).toBeUndefined();
    expect(ld.review).toBeUndefined();
  });
  it("ingredient is DefinedTerm", () => {
    expect(ingredientLd({inci:"Niacinamide",en_name:"Niacinamide",mechanism_en:"m"} as any,"https://site/th/ingredient/niacinamide")["@type"]).toBe("DefinedTerm");
  });
  it("faq + org typed", () => {
    expect(faqLd([{q:"a",a:"b"}])["@type"]).toBe("FAQPage");
    expect(orgLd("https://site")["@type"]).toBe("Organization");
  });
});
