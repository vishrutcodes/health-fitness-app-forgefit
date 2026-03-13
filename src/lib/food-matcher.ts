import { LOCAL_NUTRITION_DB, NutritionFact } from './nutrition-db';

// ============================================================================
// ADVANCED FUZZY FOOD MATCHING ENGINE v2.0
// Multi-strategy matching with n-gram, compound decomposition, phonetic,
// category boosting, and food-specific synonym mapping.
// ============================================================================

export interface MatchResult {
    foodId: string;
    food: NutritionFact;
    confidence: number; // 0–1
    matchMethod: 'exact_id' | 'exact_name' | 'alias' | 'token' | 'ngram' | 'compound' | 'synonym' | 'levenshtein' | 'none';
}

// ============================================================================
// FOOD-SPECIFIC SYNONYM MAP
// Maps common colloquial names → canonical DB-recognizable terms.
// ============================================================================
const FOOD_SYNONYMS: Record<string, string[]> = {
    // Regional name variations
    'chips': ['fries', 'french fries', 'potato fries'],
    'fries': ['chips', 'french fries'],
    'curd': ['yogurt', 'dahi'],
    'dahi': ['yogurt', 'curd'],
    'yoghurt': ['yogurt'],
    'capsicum': ['bell pepper', 'pepper'],
    'aubergine': ['eggplant', 'brinjal'],
    'brinjal': ['eggplant', 'aubergine'],
    'courgette': ['zucchini'],
    'coriander': ['cilantro'],
    'cilantro': ['coriander'],
    'cornflour': ['cornstarch'],
    'prawns': ['shrimp'],
    'shrimps': ['shrimp'],
    'rocket': ['arugula'],
    'spring onion': ['green onion', 'scallion'],
    'scallion': ['green onion', 'spring onion'],

    // Protein aliases
    'beef': ['steak', 'ground beef', 'beef mince'],
    'steak': ['beef steak', 'sirloin', 'ribeye'],
    'mutton': ['goat', 'lamb'],
    'lamb': ['mutton', 'goat'],
    'pork': ['ham', 'bacon'],

    // Indian food
    'roti': ['chapati', 'chapatti', 'flatbread'],
    'chapati': ['roti', 'chapatti'],
    'naan': ['naan bread', 'tandoori bread'],
    'dal': ['daal', 'dhal', 'lentil curry'],
    'daal': ['dal', 'dhal'],
    'panir': ['paneer'],
    'chole': ['chana masala', 'chickpea curry'],
    'rajma': ['kidney bean curry'],
    'sabzi': ['vegetable curry', 'subzi'],
    'poori': ['puri'],
    'puri': ['poori'],
    'idly': ['idli'],
    'dosa': ['dosai', 'thosai'],
    'paratha': ['parantha', 'prantha'],
    'biryani': ['biriyani', 'briyani'],
    'sambar': ['sambhar'],

    // Common abbreviations
    'pb': ['peanut butter'],
    'oj': ['orange juice'],
    'mac n cheese': ['macaroni and cheese', 'mac and cheese'],
    'pb&j': ['peanut butter jelly sandwich'],

    // Drink aliases
    'coke': ['coca cola', 'cola'],
    'soda': ['cola', 'soft drink'],
    'chai': ['tea', 'masala chai'],

    // Dessert aliases
    'ice cream': ['gelato', 'frozen dessert'],
    'cake': ['pastry', 'gateau'],
    'biscuit': ['cookie'],
    'cookie': ['biscuit'],
};

// ============================================================================
// EXPANDED NOISE WORDS — cooking states, prep methods, qualifiers
// ============================================================================
const NOISE_WORDS = new Set([
    // Cooking methods
    'cooked', 'raw', 'fried', 'grilled', 'baked', 'steamed', 'boiled',
    'roasted', 'sauteed', 'sautéed', 'pan-fried', 'deep-fried', 'stir-fried',
    'braised', 'poached', 'smoked', 'blanched', 'charred', 'broiled',
    'toasted', 'seared', 'caramelized', 'glazed', 'marinated', 'seasoned',
    'breaded', 'battered', 'crusted', 'stuffed', 'wrapped', 'layered',
    'slow-cooked', 'pressure-cooked', 'air-fried', 'griddled', 'barbecued',
    'bbq', 'tandoori', 'tempura',
    // Preparation states
    'fresh', 'dried', 'canned', 'frozen', 'sliced', 'chopped', 'diced',
    'minced', 'grated', 'shredded', 'julienned', 'cubed', 'mashed',
    'pureed', 'blended', 'ground', 'crushed', 'peeled', 'pitted',
    'whole', 'halved', 'quartered', 'filleted', 'deboned', 'boneless',
    'skinless', 'skin-on', 'bone-in', 'trimmed', 'untrimmed',
    // Qualifiers
    'plain', 'organic', 'homemade', 'store-bought', 'restaurant', 'takeout',
    'fast-food', 'gourmet', 'traditional', 'authentic', 'classic',
    'large', 'medium', 'small', 'regular', 'extra', 'big', 'mini', 'tiny',
    'hot', 'cold', 'warm', 'chilled', 'lukewarm', 'room-temperature',
    'light', 'heavy', 'thick', 'thin', 'crispy', 'crunchy', 'soft',
    'creamy', 'spicy', 'mild', 'sweet', 'sour', 'savory', 'tangy',
    // Articles / conjunctions
    'with', 'and', 'in', 'on', 'the', 'a', 'an', 'of', 'from', 'for',
    'style', 'type', 'kind', 'like', 'made', 'served', 'topped',
]);

// ============================================================================
// CORE UTILITY FUNCTIONS
// ============================================================================

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

/** Normalize a food name: lowercase, strip noise words, strip plurals */
function normalize(input: string): string {
    let s = input.toLowerCase().trim();

    const tokens = s.split(/[\s,\-_()&/]+/).filter(t => t.length > 0);
    const cleaned = tokens.filter(t => !NOISE_WORDS.has(t));
    s = cleaned.length > 0 ? cleaned.join(' ') : tokens.join(' ');

    // Strip plural suffixes
    s = s.replace(/\bies\b/g, 'y')      // berries → berry
        .replace(/\b(\w{3,})es\b/g, '$1') // tomatoes → tomato
        .replace(/\b(\w{3,})s\b/g, '$1'); // bananas → banana

    return s.trim();
}

/** Tokenize a string into meaningful tokens */
function tokenize(s: string): string[] {
    return normalize(s).split(/[\s,\-_()&/]+/).filter(t => t.length > 1);
}

// ============================================================================
// N-GRAM ENGINE
// Generates character n-grams for fuzzy partial matching
// ============================================================================

/** Generate character n-grams from a string */
function generateNgrams(s: string, n: number = 2): Set<string> {
    const ngrams = new Set<string>();
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (let i = 0; i <= cleaned.length - n; i++) {
        ngrams.add(cleaned.substring(i, i + n));
    }
    return ngrams;
}

/** Compute Jaccard similarity between two n-gram sets */
function ngramSimilarity(a: Set<string>, b: Set<string>): number {
    if (a.size === 0 || b.size === 0) return 0;

    let intersection = 0;
    for (const gram of a) {
        if (b.has(gram)) intersection++;
    }
    const union = a.size + b.size - intersection;
    return union === 0 ? 0 : intersection / union;
}

// ============================================================================
// TOKEN-BASED SCORING (improved)
// ============================================================================

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
                matches += 0.75; break;
            }
            // Close edit distance for tokens
            if (qt.length >= 3 && tt.length >= 3) {
                const dist = levenshtein(qt, tt);
                const maxLen = Math.max(qt.length, tt.length);
                if (dist <= 1) { matches += 0.85; break; }
                if (dist <= Math.ceil(maxLen * 0.3)) { matches += 0.5; break; }
            }
        }
    }

    // Score based on proportion of query tokens matched, weighted by target coverage
    const queryCoverage = matches / queryTokens.length;
    const targetCoverage = Math.min(matches, targetTokens.length) / targetTokens.length;
    return (queryCoverage * 0.65) + (targetCoverage * 0.35);
}

// ============================================================================
// SYNONYM EXPANSION
// ============================================================================

/** Expand a query using the synonym map — returns the original + all synonyms */
function expandSynonyms(query: string): string[] {
    const lower = query.toLowerCase().trim();
    const results = [lower];

    for (const [key, synonyms] of Object.entries(FOOD_SYNONYMS)) {
        if (lower.includes(key)) {
            for (const syn of synonyms) {
                results.push(lower.replace(key, syn));
            }
        }
        // Also check if any synonym matches the query → map back to key
        for (const syn of synonyms) {
            if (lower.includes(syn)) {
                results.push(lower.replace(syn, key));
            }
        }
    }

    return [...new Set(results)];
}

// ============================================================================
// COMPOUND FOOD DECOMPOSITION
// Breaks "chicken biryani plate" → tries matching sub-phrases
// ============================================================================

/** Generate meaningful sub-phrases from a multi-word query */
function generateSubPhrases(tokens: string[]): string[] {
    const phrases: string[] = [];
    const len = tokens.length;

    // Full phrase first
    if (len >= 2) phrases.push(tokens.join(' '));

    // Generate contiguous sub-phrases (largest first)
    for (let size = Math.min(len, 4); size >= 2; size--) {
        for (let start = 0; start <= len - size; start++) {
            const phrase = tokens.slice(start, start + size).join(' ');
            if (!phrases.includes(phrase)) phrases.push(phrase);
        }
    }

    // Individual significant tokens (only if 4+ chars, likely food names)
    for (const t of tokens) {
        if (t.length >= 4 && !phrases.includes(t)) phrases.push(t);
    }

    return phrases;
}

// ============================================================================
// COOKING METHOD DETECTION (unchanged but expanded)
// ============================================================================

/** Extract cooking method from a food description */
export function detectCookingMethod(name: string): string | null {
    const lower = name.toLowerCase();
    const methods: [string, string][] = [
        ['deep-fried', 'fried'], ['deep fried', 'fried'], ['pan-fried', 'fried'],
        ['stir-fried', 'fried'], ['stir fried', 'fried'], ['air-fried', 'fried'],
        ['fried', 'fried'],
        ['grilled', 'grilled'], ['grilling', 'grilled'], ['chargrilled', 'grilled'],
        ['baked', 'baked'], ['baking', 'baked'], ['oven-baked', 'baked'],
        ['steamed', 'steamed'], ['steaming', 'steamed'],
        ['boiled', 'boiled'], ['poached', 'boiled'],
        ['roasted', 'roasted'], ['roast', 'roasted'],
        ['sauteed', 'sauteed'], ['sautéed', 'sauteed'],
        ['smoked', 'smoked'],
        ['raw', 'raw'], ['fresh', 'raw'],
        ['braised', 'braised'],
        ['blanched', 'steamed'],
        ['broiled', 'grilled'],
        ['tandoori', 'roasted'],
        ['barbecued', 'grilled'], ['bbq', 'grilled'],
    ];
    for (const [keyword, method] of methods) {
        if (lower.includes(keyword)) return method;
    }
    return null;
}

// ============================================================================
// PRE-COMPUTED INDEX for fast matching
// Built once on first call, cached for subsequent lookups.
// ============================================================================

interface FoodIndex {
    key: string;
    food: NutritionFact;
    keyNorm: string;
    nameNorm: string;
    nameTokens: string[];
    aliasNorms: string[];
    aliasTokenSets: string[][];
    nameBigrams: Set<string>;
    nameTrigrams: Set<string>;
}

let _foodIndex: FoodIndex[] | null = null;

function getFoodIndex(): FoodIndex[] {
    if (_foodIndex) return _foodIndex;

    _foodIndex = [];
    for (const [key, food] of Object.entries(LOCAL_NUTRITION_DB)) {
        const keyNorm = key.replace(/_/g, ' ');
        const nameNorm = normalize(food.name);
        const nameTokens = tokenize(food.name);
        const aliasNorms = (food.aliases || []).map(a => normalize(a));
        const aliasTokenSets = (food.aliases || []).map(a => tokenize(a));
        const nameBigrams = generateNgrams(nameNorm, 2);
        const nameTrigrams = generateNgrams(nameNorm, 3);

        _foodIndex.push({
            key, food, keyNorm, nameNorm, nameTokens,
            aliasNorms, aliasTokenSets, nameBigrams, nameTrigrams
        });
    }
    return _foodIndex;
}

/** Invalidate the cache (call if DB changes at runtime, normally never needed) */
export function invalidateFoodIndex(): void {
    _foodIndex = null;
}

// ============================================================================
// MAIN MATCHING: findBestMatch (backward-compatible) + findTopMatches (new)
// ============================================================================

/**
 * Find the best matching food in our DB for a given query string.
 * Uses a multi-strategy approach and returns the best match with confidence.
 */
export function findBestMatch(query: string, categoryHint?: string): MatchResult {
    const results = findTopMatches(query, 1, categoryHint);
    return results[0];
}

/**
 * Find top N matches for a food query.
 * Uses 7 strategies in parallel and returns the best N results sorted by confidence.
 */
export function findTopMatches(query: string, topN: number = 3, categoryHint?: string): MatchResult[] {
    const noMatch: MatchResult = {
        foodId: '',
        food: {} as NutritionFact,
        confidence: 0,
        matchMethod: 'none'
    };

    if (!query || query.trim().length === 0) return [noMatch];

    const queryLower = query.toLowerCase().trim();
    const queryNormalized = normalize(query);
    const queryTokens = tokenize(query);
    const queryBigrams = generateNgrams(queryNormalized, 2);
    const queryTrigrams = generateNgrams(queryNormalized, 3);

    // Expand synonyms
    const expandedQueries = expandSynonyms(queryNormalized);

    const index = getFoodIndex();
    const candidates: MatchResult[] = [];

    for (const entry of index) {
        let bestConfidence = 0;
        let bestMethod: MatchResult['matchMethod'] = 'none';

        // ── Strategy 1: Exact key match ──────────────────────────────────
        if (queryLower.replace(/[\s\-_]+/g, '_') === entry.key || queryNormalized === entry.keyNorm) {
            return [{ foodId: entry.key, food: entry.food, confidence: 1.0, matchMethod: 'exact_id' }];
        }

        // ── Strategy 2: Exact name match ─────────────────────────────────
        if (queryNormalized === entry.nameNorm) {
            return [{ foodId: entry.key, food: entry.food, confidence: 0.98, matchMethod: 'exact_name' }];
        }

        // ── Strategy 3: Alias match ─────────────────────────────────────
        for (const aliasNorm of entry.aliasNorms) {
            if (queryNormalized === aliasNorm || queryLower === aliasNorm) {
                return [{ foodId: entry.key, food: entry.food, confidence: 0.96, matchMethod: 'alias' }];
            }
            // Partial alias match
            if (queryNormalized.includes(aliasNorm) || aliasNorm.includes(queryNormalized)) {
                const coverage = Math.min(queryNormalized.length, aliasNorm.length) / Math.max(queryNormalized.length, aliasNorm.length);
                if (coverage > 0.55) {
                    const score = 0.72 + (coverage * 0.2);
                    if (score > bestConfidence) { bestConfidence = score; bestMethod = 'alias'; }
                }
            }
        }

        // ── Strategy 4: Synonym expansion match ─────────────────────────
        for (const expanded of expandedQueries) {
            if (expanded === queryNormalized) continue; // Skip original, already checked
            const expandedNorm = normalize(expanded);
            if (expandedNorm === entry.nameNorm) {
                const score = 0.92;
                if (score > bestConfidence) { bestConfidence = score; bestMethod = 'synonym'; }
            }
            for (const aliasNorm of entry.aliasNorms) {
                if (expandedNorm === aliasNorm) {
                    const score = 0.90;
                    if (score > bestConfidence) { bestConfidence = score; bestMethod = 'synonym'; }
                }
            }
        }

        // ── Strategy 5: Token-based scoring ──────────────────────────────
        let bestTokScore = tokenScore(queryTokens, entry.nameTokens);
        for (const aliasTokens of entry.aliasTokenSets) {
            const s = tokenScore(queryTokens, aliasTokens);
            if (s > bestTokScore) bestTokScore = s;
        }

        if (bestTokScore > 0.45) {
            const confidence = 0.35 + (bestTokScore * 0.55); // Maps 0.45–1.0 → 0.60–0.90
            if (confidence > bestConfidence) { bestConfidence = confidence; bestMethod = 'token'; }
        }

        // ── Strategy 6: N-gram similarity (bigram + trigram) ─────────────
        const bigramSim = ngramSimilarity(queryBigrams, entry.nameBigrams);
        const trigramSim = ngramSimilarity(queryTrigrams, entry.nameTrigrams);
        const ngramScore = (bigramSim * 0.4) + (trigramSim * 0.6);

        if (ngramScore > 0.35) {
            const confidence = 0.30 + (ngramScore * 0.60); // Maps 0.35–1.0 → 0.51–0.90
            if (confidence > bestConfidence) { bestConfidence = confidence; bestMethod = 'ngram'; }
        }

        // ── Strategy 7: Levenshtein on normalized names ──────────────────
        const dist = levenshtein(queryNormalized, entry.nameNorm);
        const maxLen = Math.max(queryNormalized.length, entry.nameNorm.length);
        if (maxLen > 0) {
            const similarity = 1 - (dist / maxLen);
            if (similarity > 0.55) {
                const confidence = similarity * 0.88;
                if (confidence > bestConfidence) { bestConfidence = confidence; bestMethod = 'levenshtein'; }
            }
        }

        // Also check aliases with Levenshtein
        for (const aliasNorm of entry.aliasNorms) {
            const aDist = levenshtein(queryNormalized, aliasNorm);
            const aMaxLen = Math.max(queryNormalized.length, aliasNorm.length);
            if (aMaxLen > 0) {
                const similarity = 1 - (aDist / aMaxLen);
                if (similarity > 0.55) {
                    const confidence = similarity * 0.88;
                    if (confidence > bestConfidence) { bestConfidence = confidence; bestMethod = 'levenshtein'; }
                }
            }
        }

        // ── Strategy 8: Substring containment ────────────────────────────
        const nameLower = entry.food.name.toLowerCase();
        if (queryLower.includes(nameLower) || nameLower.includes(queryLower)) {
            const coverage = Math.min(queryLower.length, nameLower.length) / Math.max(queryLower.length, nameLower.length);
            const confidence = 0.50 + (coverage * 0.38);
            if (confidence > bestConfidence) { bestConfidence = confidence; bestMethod = 'token'; }
        }

        // ── Category boost ───────────────────────────────────────────────
        if (categoryHint && entry.food.category === categoryHint && bestConfidence > 0.4) {
            bestConfidence = Math.min(bestConfidence + 0.08, 0.98);
        }

        if (bestConfidence > 0.3) {
            candidates.push({
                foodId: entry.key,
                food: entry.food,
                confidence: Math.min(bestConfidence, 0.98),
                matchMethod: bestMethod
            });
        }
    }

    // ── Compound decomposition pass ──────────────────────────────────
    if (queryTokens.length >= 2 && (candidates.length === 0 || candidates[0]?.confidence < 0.7)) {
        const subPhrases = generateSubPhrases(queryTokens);
        for (const phrase of subPhrases) {
            if (phrase === queryNormalized) continue; // already checked
            const phraseNorm = normalize(phrase);
            const phraseTokens = tokenize(phrase);
            const phraseBigrams = generateNgrams(phraseNorm, 2);

            for (const entry of index) {
                // Token match on sub-phrase
                let subTokScore = tokenScore(phraseTokens, entry.nameTokens);
                for (const aliasTokens of entry.aliasTokenSets) {
                    const s = tokenScore(phraseTokens, aliasTokens);
                    if (s > subTokScore) subTokScore = s;
                }

                if (subTokScore > 0.6) {
                    // Scale by how much of the original query this sub-phrase covers
                    const coverageFactor = phraseTokens.length / queryTokens.length;
                    const confidence = Math.min((0.35 + subTokScore * 0.50) * (0.7 + coverageFactor * 0.3), 0.88);

                    const existingIdx = candidates.findIndex(c => c.foodId === entry.key);
                    if (existingIdx >= 0) {
                        if (confidence > candidates[existingIdx].confidence) {
                            candidates[existingIdx] = {
                                foodId: entry.key,
                                food: entry.food,
                                confidence,
                                matchMethod: 'compound'
                            };
                        }
                    } else {
                        candidates.push({
                            foodId: entry.key,
                            food: entry.food,
                            confidence,
                            matchMethod: 'compound'
                        });
                    }
                }

                // N-gram on sub-phrase
                const subNgramSim = ngramSimilarity(phraseBigrams, entry.nameBigrams);
                if (subNgramSim > 0.5) {
                    const coverageFactor = phraseTokens.length / queryTokens.length;
                    const confidence = Math.min((0.30 + subNgramSim * 0.55) * (0.7 + coverageFactor * 0.3), 0.85);

                    const existingIdx = candidates.findIndex(c => c.foodId === entry.key);
                    if (existingIdx >= 0) {
                        if (confidence > candidates[existingIdx].confidence) {
                            candidates[existingIdx] = {
                                foodId: entry.key,
                                food: entry.food,
                                confidence,
                                matchMethod: 'compound'
                            };
                        }
                    } else {
                        candidates.push({
                            foodId: entry.key,
                            food: entry.food,
                            confidence,
                            matchMethod: 'compound'
                        });
                    }
                }
            }
        }
    }

    // Sort by confidence descending
    candidates.sort((a, b) => b.confidence - a.confidence);

    // Return top N (pad with noMatch if not enough)
    const results: MatchResult[] = [];
    for (let i = 0; i < topN; i++) {
        results.push(candidates[i] || noMatch);
    }
    return results;
}
