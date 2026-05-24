"use strict";
// src/modules/generator/cluster-coverage.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterCoverageEngine = void 0;
// ==========================================
// 🧠 CLUSTER COVERAGE ENGINE
// ==========================================
class ClusterCoverageEngine {
    // ==========================================
    // 📊 ANALYZE
    // ==========================================
    static analyze(numbers) {
        const total = numbers.length;
        const result = [];
        for (const cluster of this.clusters) {
            const count = numbers.filter(n => {
                const value = Number(n);
                return (value >=
                    cluster.min
                    &&
                        value <=
                            cluster.max);
            }).length;
            result.push({
                cluster: cluster.cluster,
                min: cluster.min,
                max: cluster.max,
                count,
                percentage: total > 0
                    ?
                        Number(((count / total) * 100).toFixed(2))
                    : 0
            });
        }
        return result;
    }
    // ==========================================
    // 🧠 GET LIGHTEST CLUSTER
    // ==========================================
    static getLightestCluster(numbers) {
        const analyzed = this.analyze(numbers);
        return analyzed.sort((a, b) => a.count - b.count)[0];
    }
    // ==========================================
    // 🎲 GENERATE INSIDE CLUSTER
    // ==========================================
    static generateInsideCluster(min, max) {
        return Math.floor(Math.random() *
            (max - min)) + min;
    }
}
exports.ClusterCoverageEngine = ClusterCoverageEngine;
// ==========================================
// 🔥 CLUSTERS
// ==========================================
ClusterCoverageEngine.clusters = [
    {
        cluster: 'A',
        min: 0,
        max: 1999
    },
    {
        cluster: 'B',
        min: 2000,
        max: 3999
    },
    {
        cluster: 'C',
        min: 4000,
        max: 5999
    },
    {
        cluster: 'D',
        min: 6000,
        max: 7999
    },
    {
        cluster: 'E',
        min: 8000,
        max: 9999
    }
];
