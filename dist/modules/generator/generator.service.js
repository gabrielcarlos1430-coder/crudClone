"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorService = void 0;
const learning_memory_1 = require("../auto-learning/learning.memory");
const prediction_confidence_engine_1 = require("../prediction/prediction-confidence.engine");
const history_memory_1 = require("../history/history.memory");
const cluster_coverage_engine_1 = require("./cluster-coverage.engine");
const pattern_detection_engine_1 = require("../pattern/pattern-detection.engine");
const frequency_analysis_engine_1 = require("../analytics/frequency-analysis.engine");
const football_provider_1 = require("../football/football.provider");
const football_analytics_1 = require("../football/football.analytics");
// ==========================================
// 🧠 GENERATOR SERVICE
// ==========================================
class GeneratorService {
    // ==========================================
    // 📊 STRATEGY WEIGHTS
    // ==========================================
    static getWeights() {
        const memory = learning_memory_1.LearningMemory.getAll();
        return {
            hot: memory.find(m => m.name === 'hot')?.weight || 1,
            cold: memory.find(m => m.name === 'cold')?.weight || 1,
            random: memory.find(m => m.name === 'random')?.weight || 1
        };
    }
    // ==========================================
    // 🔥 HOT NUMBER
    // ==========================================
    static async generateHot() {
        const hot = await frequency_analysis_engine_1.FrequencyAnalysisEngine
            .getHotNumbers(30);
        if (!hot.length) {
            return '1234';
        }
        return hot[Math.floor(Math.random() *
            hot.length)].number;
    }
    // ==========================================
    // ❄️ COLD NUMBER
    // ==========================================
    static async generateCold() {
        const cold = await frequency_analysis_engine_1.FrequencyAnalysisEngine
            .getColdNumbers(30);
        if (!cold.length) {
            return '0000';
        }
        return cold[Math.floor(Math.random() *
            cold.length)].number;
    }
    // ==========================================
    // 🎲 RANDOM CLUSTER
    // ==========================================
    static async generateBalancedRandom() {
        const existingData = await history_memory_1.HistoryMemory.getAll();
        const existing = existingData.map(h => h.number);
        const lightest = cluster_coverage_engine_1.ClusterCoverageEngine
            .getLightestCluster(existing);
        const generated = cluster_coverage_engine_1.ClusterCoverageEngine
            .generateInsideCluster(lightest.min, lightest.max);
        return {
            number: generated
                .toString()
                .padStart(4, '0'),
            cluster: lightest.cluster
        };
    }
    // ==========================================
    // 🚀 MAIN GENERATOR
    // ==========================================
    static async generate(params) {
        const { quantity, exploration = 50, exploitation = 50, mode = 'balanced' } = params;
        const weights = this.getWeights();
        const historyData = await history_memory_1.HistoryMemory.getAll();
        const history = historyData.map(h => h.number);
        const results = [];
        // ==========================================
        // ⚽ FOOTBALL ANALYTICS
        // ==========================================
        let footballBoost = 0;
        try {
            const footballData = await football_provider_1.FootballProvider
                .getLiveMatches();
            if (footballData.success) {
                const footballStats = football_analytics_1.FootballAnalytics.analyze(footballData.matches);
                footballBoost =
                    footballStats.length > 0
                        ? 5
                        : 0;
                console.log('⚽ Football analytics ativo');
            }
        }
        catch (error) {
            console.log('⚠️ Football analytics offline');
        }
        const totalWeight = weights.hot +
            weights.cold +
            weights.random;
        // ==========================================
        // 🎲 GENERATION LOOP
        // ==========================================
        for (let i = 0; i < quantity; i++) {
            let roll = Math.random() *
                totalWeight;
            // exploration
            if (mode === 'exploration') {
                roll +=
                    weights.hot +
                        weights.cold;
            }
            // exploitation
            if (mode === 'exploitation') {
                roll *= 0.6;
            }
            let number = '';
            let source = '';
            let weight = 1;
            let cluster = '';
            // ==========================================
            // 🔥 HOT
            // ==========================================
            if (roll < weights.hot) {
                number =
                    await this.generateHot();
                source = 'hot';
                weight =
                    weights.hot;
            }
            // ==========================================
            // ❄️ COLD
            // ==========================================
            else if (roll <
                (weights.hot +
                    weights.cold)) {
                number =
                    await this.generateCold();
                source = 'cold';
                weight =
                    weights.cold;
            }
            // ==========================================
            // 🎲 RANDOM
            // ==========================================
            else {
                const balanced = await this.generateBalancedRandom();
                number =
                    balanced.number;
                cluster =
                    balanced.cluster;
                source = 'random';
                weight =
                    weights.random;
            }
            // ==========================================
            // 📊 CLUSTER DETECTION
            // ==========================================
            if (!cluster) {
                const detected = cluster_coverage_engine_1.ClusterCoverageEngine
                    .analyze([number])[0];
                cluster =
                    detected.cluster;
            }
            // ==========================================
            // 🧠 PATTERN ANALYSIS
            // ==========================================
            const pattern = pattern_detection_engine_1.PatternDetectionEngine
                .analyze(number);
            // ==========================================
            // 📊 CONFIDENCE
            // ==========================================
            const confidenceData = await prediction_confidence_engine_1.PredictionConfidenceEngine
                .calculate(number, history, source);
            // ==========================================
            // 🧠 FINAL SCORE
            // ==========================================
            const finalConfidence = Math.max(0, Math.min(100, (confidenceData.confidence *
                (pattern.score / 100)) + footballBoost));
            // ==========================================
            // 📊 RESULT
            // ==========================================
            results.push({
                number,
                source,
                weight,
                cluster,
                confidence: Number(finalConfidence.toFixed(2)),
                patternScore: pattern.score,
                patternTags: pattern.tags,
                factors: confidenceData.factors
            });
        }
        // ==========================================
        // 🏆 SORT
        // ==========================================
        results.sort((a, b) => b.confidence -
            a.confidence);
        // ==========================================
        // 📊 COVERAGE
        // ==========================================
        const coverage = cluster_coverage_engine_1.ClusterCoverageEngine
            .analyze(results.map(r => r.number));
        // ==========================================
        // 📊 PATTERN SUMMARY
        // ==========================================
        const patternSummary = {
            repetitive: results.filter(r => r.patternTags.includes('repetitive')).length,
            sequential: results.filter(r => r.patternTags.includes('sequential')).length,
            mirrored: results.filter(r => r.patternTags.includes('mirrored')).length,
            highDiversity: results.filter(r => r.patternTags.includes('high-diversity')).length
        };
        // ==========================================
        // 🚀 FINAL
        // ==========================================
        return {
            total: results.length,
            numbers: results,
            weights,
            exploration,
            exploitation,
            mode,
            coverage,
            patternSummary
        };
    }
}
exports.GeneratorService = GeneratorService;
