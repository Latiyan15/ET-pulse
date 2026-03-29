/**
 * Returns a personalisation prompt string based on user profile.
 * This is appended to every briefing prompt to tailor content.
 */
export function getBriefingPersonalisation(profile) {
  const rules = {
    investor: `
      Include a portfolio implication section naming ${(profile.stocks || []).join(', ')} specifically.
      Use analytical investor vocabulary.
      Include earnings, valuation, and macro angles.`,

    student: `
      After each complex term, add a brief plain-English definition in brackets.
      End with a "Why students should care" note.
      Keep vocabulary accessible.`,

    founder: `
      Include a "startup implication" section focused on ${(profile.startup_sector || []).join(', ')} sector.
      Frame everything through the lens of building, fundraising, and regulation.`,

    professional: `
      Be dense and data-heavy. No basic definitions.
      Include a key metrics strip with relevant financial ratios and flow data.
      Assume advanced financial literacy.`,

    business_owner: `
      Include a "business impact" section focused on ${(profile.business_challenges || []).join(', ')}.
      Frame through EMIs, input costs, GST, and practical business decisions.`,

    reader: `
      Use simple everyday language.
      End with a "what this means for everyday Indians" practical takeaway.
      No jargon. No complex financial terms.`,
  };

  return rules[profile.user_type] || rules.reader;
}
