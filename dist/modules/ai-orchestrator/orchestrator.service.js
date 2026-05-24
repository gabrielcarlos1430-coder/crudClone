"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestratorService = void 0;
const learning_engine_1 = require("../auto-learning/learning.engine");
const strategy_service_1 = require("../strategy-engine/strategy.service");
const decision_service_1 = require("../decision-engine/decision.service");
const generator_service_1 = require("../generator/generator.service");
const analytics_service_1 = require("../analytics/analytics.service");
const system_health_engine_1 = require("../self-improvement/system-health.engine");
const exploration_balance_engine_1 = require("../self-improvement/exploration-balance.engine");
const strategy_retirement_engine_1 = require("../self-improvement/strategy-retirement.engine");
const strategy_evolution_engine_1 = require("../self-improvement/strategy-evolution.engine");
const mutation_factory_engine_1 = require("../self-improvement/mutation-factory.engine");
const football_provider_1 = require("../football/football.provider");
const football_analytics_1 = require("../football/football.analytics");
// ==========================================
// 🧠 AI ORCHESTRATOR
// ==========================================
class OrchestratorService {
    static async run(history) {
        console.log('🚀 ORCHESTRATOR START');
        const start = Date.now();
        // ==========================================
        // VALIDATION
        // ==========================================
        if (!history ||
            !Array.isArray(history)) {
            throw new Error('History inválido');
        }
        // ==========================================
        // FAST SYSTEMS
        // ==========================================
        console.log('📊 ANALYTICS');
        const analytics = analytics_service_1.AnalyticsService.getStats(history.map(Number));
        console.log('🧠 HEALTH');
        const health = system_health_engine_1.SystemHealthEngine.analyze();
        console.log('⚖️ BALANCE');
        const balance = exploration_balance_engine_1.ExplorationBalanceEngine.analyze();
        console.log('☠️ RETIREMENT');
        const retirement = strategy_retirement_engine_1.StrategyRetirementEngine.analyze();
        // ==========================================
        // PARALLEL ENGINES
        // ==========================================
        console.log('⚡ RUNNING PARALLEL ENGINES');
        const [evolution, mutations, generated, learning, footballLive] = await Promise.all([
            strategy_evolution_engine_1.StrategyEvolutionEngine.analyze(),
            mutation_factory_engine_1.MutationFactoryEngine
                .createMutations(),
            generator_service_1.GeneratorService.generate({
                quantity: 20,
                size: 4,
                exploration: balance.exploration,
                exploitation: balance.exploitation,
                mode: balance.mode
            }),
            learning_engine_1.LearningEngine.learn(history),
            football_provider_1.FootballProvider
                .getLiveMatches()
        ]);
        // ==========================================
        // ⚽ FOOTBALL
        // ==========================================
        let football = {
            enabled: false,
            totalMatches: 0,
            topTeams: []
        };
        try {
            if (footballLive.success) {
                const analyzed = football_analytics_1.FootballAnalytics.analyze(footballLive.matches);
                football = {
                    enabled: true,
                    totalMatches: footballLive.total,
                    topTeams: analyzed.slice(0, 10)
                };
                console.log('⚽ Football Engine ativo');
            }
        }
        catch (error) {
            console.log('⚠️ Football Engine offline');
        }
        // ==========================================
        // STRATEGIES
        // ==========================================
        console.log('🎯 STRATEGIES');
        const strategies = strategy_service_1.StrategyService.runAll(history);
        // ==========================================
        // DECISION
        // ==========================================
        console.log('🧠 DECISION');
        const decision = decision_service_1.DecisionService.decide(history);
        // ==========================================
        // SUMMARY
        // ==========================================
        const bestRanking = decision.ranking?.[0];
        const alertLevel = health.status === 'critical'
            ? 'HIGH'
            : health.status === 'warning'
                ? 'MEDIUM'
                : 'LOW';
        console.log('✅ ORCHESTRATOR FINISHED IN:', Date.now() - start, 'ms');
        // ==========================================
        // OUTPUT
        // ==========================================
        return {
            football,
            analytics,
            generated,
            strategies,
            decision,
            learning,
            health,
            balance,
            retirement,
            evolution,
            mutations,
            system: {
                status: health.status,
                alertLevel,
                alerts: health.alerts,
                recommendations: [
                    ...health.recommendations,
                    ...balance.recommendations,
                    ...retirement.recommendations,
                    ...evolution.recommendations,
                    ...mutations.recommendations
                ]
            },
            summary: {
                bestStrategy: decision.bestStrategy,
                totalStrategies: strategies.length,
                bestScore: bestRanking?.score || 0,
                bestAccuracy: bestRanking?.accuracy || 0,
                bestCoverage: bestRanking?.coverage || 0,
                bestDiversity: bestRanking?.diversity || 0,
                systemHealth: health.health,
                exploration: balance.exploration,
                exploitation: balance.exploitation,
                mode: balance.mode,
                retiredStrategies: retirement.retiredCount,
                evolvedStrategies: evolution.bestStrategies.length,
                mutationsCreated: mutations.created.length
            }
        };
    }
}
exports.OrchestratorService = OrchestratorService;
