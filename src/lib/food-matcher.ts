import { LOCAL_NUTRITION_DB, NutritionFact } from './nutrition-db';

// ============================================================================
// FUZZY FOOD MATCHING ENGINE
// Replaces basic includes() with intelligent multi-strategy matching
// ============================================================================

export interface MatchResult {
    foodId: string;
    food: NutritionFact;
    confidence: number; // 0–1
    matchMethod: 'exact_id' | 'exact_name' | 'alias' | 'token' | 'levenshtein' | 'none';
}

/** Compute Levenshtein edit distance between two strings */
function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;

    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[m][n];
}

/** Normalize a food name: lowercase, strip plurals, suffixes, cooking states */
function normalize(input: string): string {
    let s = input.toLowerCase().trim();

    // Remove common noise words
    const noiseWords = ['cooked', 'raw', 'fried', 'grilled', 'baked', 'steamed', 'boiled',
        'roasted', 'sauteed', 'sautéed', 'pan-fried', 'deep-fried', 'fresh',
        'dried', 'canned', 'frozen', 'sliced', 'chopped', 'diced', 'minced',
        'whole', 'plain', 'with', 'and', 'in', 'on', 'the', 'a', 'an'];

    const tokens = s.split(/[\s,\-_()]+/).filter(t => t.length > 0);
    const cleaned = tokens.filter(t => !noiseWords.includes(t));
    s = cleaned.length > 0 ? cleaned.join(' ') : tokens.join(' ');

    // Strip plural suffixes
    s = s.replace(/\bies\b/g, 'y')  // berries → berry
        .replace(/\b(\w{3,})es\b/g, '$1')  // tomatoes → tomato
        .replace(/\b(\w{3,})s\b/g, '$1');  // bananas → banana

    return s.trim();
}

/** Tokenize a string into meaningful tokens */
function tokenize(s: string): string[] {
    return normalize(s).split(/[\s,\-_()&]+/).filter(t => t.length > 1);
}

/** Compute a token overlap score between 0–1 */
function tokenScore(queryTokens: string[], targetTokens: string[]): number {
    if (queryTokens.length === 0 || targetTokens.length === 0) return 0;

    let matches = 0;
    for (const qt of queryTokens) {
        for (const tt of targetTokens) {
            // Exact token match
            if (qt === tt) { matches += 1; break; }
            // Substring match (one contains the other)
            if (qt.length >= 3 && tt.length >= 3 && (qt.includes(tt) || tt.includes(qt))) {
                matches += 0.7; break;
            }
            // Close edit distance for tokens
            if (qt.length >= 3 && tt.length >= 3) {
                const dist = levenshtein(qt, tt);
                const maxLen = Math.max(qt.length, tt.length);
                if (dist <= Math.ceil(maxLen * 0.3)) {
                    matches += 0.5; break;
                }
            }
        }
    }

    // Score based on proportion of query tokens matched, weighted by target coverage
    const queryCoverage = matches / queryTokens.length;
    const targetCoverage = Math.min(matches, targetTokens.length) / targetTokens.length;
    return (queryCoverage * 0.7) + (targetCoverage * 0.3);
}

/** Extract cooking method from a food description */
export function detectCookingMethod(name: string): string | null {
    const lower = name.toLowerCase();
    const methods: [string, string][] = [
        ['deep-fried', 'fried'], ['deep fried', 'fried'], ['pan-fried', 'fried'],
        ['stir-fried', 'fried'], ['stir fried', 'fried'], ['fried', 'fried'],
        ['grilled', 'grilled'], ['grilling', 'grilled'],
        ['baked', 'baked'], ['baking', 'baked'],
        ['steamed', 'steamed'], ['steaming', 'steamed'],
        ['boiled', 'boiled'], ['poached', 'boiled'],
        ['roasted', 'roasted'], ['roast', 'roasted'],
        ['sauteed', 'sauteed'], ['sautéed', 'sauteed'],
        ['smoked', 'smoked'],
        ['raw', 'raw'], ['fresh', 'raw'],
        ['braised', 'braised'],
        ['blanched', 'steamed'],
    ];
    for (const [keyword, method] of methods) {
        if (lower.includes(keyword)) return method;
    }
    return null;
}

/**
 * Find the best matching food in our DB for a given query string.
 * Uses a multi-strategy approach and returns the best match with confidence.
 */
export function findBestMatch(query: string): MatchResult {
    const noMatch: MatchResult = {
        foodId: '',
        food: {} as NutritionFact,
        confidence: 0,
        matchMethod: 'none'
    };

    if (!query || query.trim().length === 0) return noMatch;

    const queryLower = query.toLowerCase().trim();
    const queryNormalized = normalize(query);
    const queryTokens = tokenize(query);

    let bestMatch: MatchResult = noMatch;

    for (const [key, food] of Object.entries(LOCAL_NUTRITION_DB)) {
        // ── Strategy 1: Exact key match ──────────────────────────────────
        const keyNorm = key.replace(/_/g, ' ');
        if (queryLower.replace(/[\s\-_]+/g, '_') === key || queryNormalized === keyNorm) {
            return { foodId: key, food, confidence: 1.0, matchMethod: 'exact_id' };
        }

        // ── Strategy 2: Exact name match ─────────────────────────────────
        const nameNormalized = normalize(food.name);
        if (queryNormalized === nameNormalized) {
            return { foodId: key, food, confidence: 0.98, matchMethod: 'exact_name' };
        }

        // ── Strategy 3: Alias match ─────────────────────────────────────
        if (food.aliases && food.aliases.length > 0) {
            for (const alias of food.aliases) {
                const aliasNorm = normalize(alias);
                if (queryNormalized === aliasNorm || queryLower === alias.toLowerCase()) {
                    return { foodId: key, food, confidence: 0.95, matchMethod: 'alias' };
                }
                // Partial alias match
                if (queryNormalized.includes(aliasNorm) || aliasNorm.includes(queryNormalized)) {
                    const coverage = Math.min(queryNormalized.length, aliasNorm.length) / Math.max(queryNormalized.length, aliasNorm.length);
                    if (coverage > 0.6) {
                        const score = 0.75 + (coverage * 0.15);
                        if (score > bestMatch.confidence) {
                            bestMatch = { foodId: key, food, confidence: score, matchMethod: 'alias' };
                        }
                    }
                }
            }
        }

        // ── Strategy 4: Token-based scoring ──────────────────────────────
        const nameTokens = tokenize(food.name);
        const aliasTokenSets = (food.aliases || []).map(a => tokenize(a));

        let bestTokenScore = tokenScore(queryTokens, nameTokens);
        for (const aliasTokens of aliasTokenSets) {
            const s = tokenScore(queryTokens, aliasTokens);
            if (s > bestTokenScore) bestTokenScore = s;
        }

        if (bestTokenScore > 0.5) {
            const confidence = 0.4 + (bestTokenScore * 0.5); // Maps 0.5–1.0 → 0.65–0.90
            if (confidence > bestMatch.confidence) {
                bestMatch = { foodId: key, food, confidence: Math.min(confidence, 0.90), matchMethod: 'token' };
            }
        }

        // ── Strategy 5: Levenshtein on normalized names ──────────────────
        const dist = levenshtein(queryNormalized, nameNormalized);
        const maxLen = Math.max(queryNormalized.length, nameNormalized.length);
        if (maxLen > 0) {
            const similarity = 1 - (dist / maxLen);
            if (similarity > 0.6) {
                const confidence = similarity * 0.85;
                if (confidence > bestMatch.confidence) {
                    bestMatch = { foodId: key, food, confidence, matchMethod: 'levenshtein' };
                }
            }
        }

        // Also check aliases with Levenshtein
        for (const alias of (food.aliases || [])) {
            const aliasNorm = normalize(alias);
            const aDist = levenshtein(queryNormalized, aliasNorm);
            const aMaxLen = Math.max(queryNormalized.length, aliasNorm.length);
            if (aMaxLen > 0) {
                const similarity = 1 - (aDist / aMaxLen);
                if (similarity > 0.6) {
                    const confidence = similarity * 0.85;
                    if (confidence > bestMatch.confidence) {
                        bestMatch = { foodId: key, food, confidence, matchMethod: 'levenshtein' };
                    }
                }
            }
        }

        // ── Strategy 6: Substring containment (improved includes()) ──────
        if (queryLower.includes(food.name.toLowerCase()) || food.name.toLowerCase().includes(queryLower)) {
            const coverage = Math.min(queryLower.length, food.name.toLowerCase().length) / Math.max(queryLower.length, food.name.toLowerCase().length);
            const confidence = 0.5 + (coverage * 0.35);
            if (confidence > bestMatch.confidence) {
                bestMatch = { foodId: key, food, confidence, matchMethod: 'token' };
            }
        }
    }

    return bestMatch;
}
