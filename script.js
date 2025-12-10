/**
 * 数据可视化综合展示平台 - JavaScript核心代码
 * 实现所有图表的数据生成、创建和交互功能
 */

// 全局图表对象存储
const charts = {};

// 颜色主题配置
const colorThemes = {
    primary: ['rgba(102, 126, 234, 1)', 'rgba(118, 75, 162, 1)', 'rgba(240, 147, 251, 1)'],
    secondary: ['rgba(240, 147, 251, 1)', 'rgba(245, 87, 108, 1)', 'rgba(102, 126, 234, 1)'],
    gradients: [
        'rgba(102, 126, 234, 0.8)',
        'rgba(118, 75, 162, 0.8)',
        'rgba(240, 147, 251, 0.8)',
        'rgba(245, 87, 108, 0.8)',
        'rgba(255, 193, 7, 0.8)',
        'rgba(40, 167, 69, 0.8)'
    ]
};

/**
 * 生成时间序列数据
 * @returns {Object} 包含标签和数据的对象
 */
function generateTimeSeriesData() {
    const labels = [];
    const data = [];
    const startDate = new Date('2025-01-01 00:00:00');
    const endDate = new Date('2025-01-02 20:00:00');
    
    for (let d = new Date(startDate); d <= endDate; d.setHours(d.getHours() + 1)) {
        labels.push(d.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }));
        
        // 生成合理波动的数据，考虑日夜周期
        const hour = d.getHours();
        let baseValue = 101;
        
        // 凌晨4点最低，下午16点最高
        if (hour >= 2 && hour <= 6) {
            baseValue = 100.2; // 凌晨低值
        } else if (hour >= 14 && hour <= 18) {
            baseValue = 102.3; // 下午高值
        } else if (hour >= 20 || hour <= 1) {
            baseValue = 100.8; // 夜间中等
        } else {
            baseValue = 101.5; // 白天正常
        }
        
        const fluctuation = (Math.random() - 0.5) * 0.4;
        const value = baseValue + fluctuation;
        data.push(Math.min(103, Math.max(99.5, value)));
    }
    return { labels, data };
}

/**
 * 生成销量数据
 * @returns {Object} 包含月份和销量数据的对象
 */
function generateSalesData() {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const nationalSales = [];
    const eastChinaSales = [];
    
    for (let i = 0; i < 12; i++) {
        // 7-9月为旺季峰值
        let seasonalFactor = 1;
        if (i >= 6 && i <= 8) {
            seasonalFactor = 1.4; // 旺季
        } else if (i >= 0 && i <= 1 || i >= 10 && i <= 11) {
            seasonalFactor = 0.8; // 淡季
        } else {
            seasonalFactor = 1.1; // 平季
        }
        
        const baseNational = 70;
        const baseEast = 30;
        
        nationalSales.push(baseNational * seasonalFactor + (Math.random() - 0.5) * 8);
        eastChinaSales.push(baseEast * seasonalFactor + (Math.random() - 0.5) * 4);
    }
    
    return { months, nationalSales, eastChinaSales };
}

/**
 * 获取编程语言数据
 * @returns {Object} 包含语言、票数和占比的对象
 */
function getProgrammingLanguageData() {
    const languages = ['Python', 'JavaScript', 'Java', 'C#', 'Go', 'TypeScript'];
    const votes = [450, 380, 290, 180, 120, 90];
    const total = votes.reduce((sum, v) => sum + v, 0);
    const percentages = votes.map(v => ((v / total) * 100).toFixed(1));
    
    return { languages, votes, percentages };
}

/**
 * 生成二次函数数据
 * @returns {Object} 包含x和y坐标数组的对象
 */
function generateQuadraticData() {
    const xValues = [];
    const yValues = [];
    
    for (let x = -2; x <= 2; x += 0.05) {
        xValues.push(x);
        yValues.push(x * x);
    }
    
    return { xValues, yValues };
}

/**
 * 生成正切函数数据
 * @returns {Object} 包含x和y坐标数组的对象
 */
function generateTanData() {
    const xValues = [];
    const yValues = [];
    
    for (let x = -Math.PI/2 + 0.1; x < Math.PI/2 - 0.1; x += 0.05) {
        const y = Math.tan(x);
        if (y >= -3 && y <= 3) {
            xValues.push(x);
            yValues.push(y);
        }
    }
    
    return { xValues, yValues };
}

/**
 * 创建时间序列波动图
 * @param {string} type - 图表类型（line/area）
 */
function createChart1(type) {
    const { labels, data } = generateTimeSeriesData();
    
    if (charts.chart1) {
        charts.chart1.destroy();
    }
    
    const ctx = document.getElementById('chart1-canvas').getContext('2d');
    charts.chart1 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '时间序列数值',
                data: data,
                borderColor: colorThemes.primary[0],
                backgroundColor: type === 'area' ? 
                    'rgba(102, 126, 234, 0.3)' : 
                    'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: type === 'area',
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 8,
                pointBackgroundColor: colorThemes.primary[0],
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: { 
                    display: true, 
                    position: 'top',
                    labels: {
                        font: { size: 14, weight: 'bold' },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: 15,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return `时间: ${context[0].label}`;
                        },
                        label: function(context) {
                            return `数值: ${context.parsed.y.toFixed(3)}`;
                        }
                    }
                }
            },
            scales: {
                x: { 
                    display: true,
                    ticks: { 
                        maxRotation: 45, 
                        minRotation: 45,
                        font: { size: 11 }
                    },
                    grid: {
                        display: false
                    }
                },
                y: { 
                    display: true,
                    min: 99.5,
                    max: 103,
                    title: {
                        display: true,
                        text: '数值',
                        font: { size: 14, weight: 'bold' }
                    },
                    ticks: {
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

/**
 * 创建销量双轴对比图
 * @param {string} type - 图表类型（line/bar）
 */
function createChart2(type) {
    const { months, nationalSales, eastChinaSales } = generateSalesData();
    
    if (charts.chart2) {
        charts.chart2.destroy();
    }
    
    const ctx = document.getElementById('chart2-canvas').getContext('2d');
    
    const config = type === 'line' ? {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '全国总销量',
                    data: nationalSales,
                    borderColor: colorThemes.primary[0],
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    yAxisID: 'y',
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8
                },
                {
                    label: '华东区销量',
                    data: eastChinaSales,
                    borderColor: colorThemes.secondary[0],
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }
            ]
        }
    } : {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: '全国总销量',
                    data: nationalSales,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    yAxisID: 'y'
                },
                {
                    label: '华东区销量',
                    data: eastChinaSales,
                    backgroundColor: 'rgba(240, 147, 251, 0.8)',
                    borderColor: 'rgba(240, 147, 251, 1)',
                    borderWidth: 2,
                    yAxisID: 'y1',
                    type: 'line'
                }
            ]
        }
    };
    
    config.options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: { 
                display: true, 
                position: 'top',
                labels: {
                    font: { size: 14, weight: 'bold' },
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: 15,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                callbacks: {
                    title: function(context) {
                        return `${context[0].label}销量数据`;
                    },
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}万件`;
                    }
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                min: 50,
                max: 90,
                title: {
                    display: true,
                    text: '全国总销量(万件)',
                    font: { size: 14, weight: 'bold' },
                    color: colorThemes.primary[0]
                },
                ticks: {
                    color: colorThemes.primary[0]
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 20,
                max: 40,
                title: {
                    display: true,
                    text: '华东区销量(万件)',
                    font: { size: 14, weight: 'bold' },
                    color: colorThemes.secondary[0]
                },
                ticks: {
                    color: colorThemes.secondary[0]
                },
                grid: {
                    drawOnChartArea: false
                }
            },
            x: {
                ticks: {
                    font: { size: 12 }
                }
            }
        }
    };
    
    charts.chart2 = new Chart(ctx, config);
}

/**
 * 创建编程语言统计图
 * @param {string} type - 图表类型（bar/horizontalBar/pie）
 */
function createChart3(type) {
    const { languages, votes, percentages } = getProgrammingLanguageData();
    
    if (charts.chart3) {
        charts.chart3.destroy();
    }
    
    const ctx = document.getElementById('chart3-canvas').getContext('2d');
    
    let config;
    
    if (type === 'pie') {
        config = {
            type: 'pie',
            data: {
                labels: languages.map((lang, i) => `${lang} (${percentages[i]}%)`),
                datasets: [{
                    data: votes,
                    backgroundColor: colorThemes.gradients,
                    borderColor: '#fff',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { size: 12 },
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        padding: 15,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `得票数: ${context.parsed}票 (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };
    } else {
        config = {
            type: type === 'horizontalBar' ? 'bar' : 'bar',
            data: {
                labels: languages,
                datasets: [{
                    label: '得票数',
                    data: votes,
                    backgroundColor: colorThemes.gradients,
                    borderColor: colorThemes.gradients.map(color => color.replace('0.8', '1')),
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: type === 'horizontalBar' ? 'y' : 'x',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        padding: 15,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed.y || context.parsed.x) / total * 100).toFixed(1);
                                return [
                                    `得票数: ${context.parsed.y || context.parsed.x}票`,
                                    `占比: ${percentage}%`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: { 
                        display: true,
                        title: {
                            display: type === 'horizontalBar',
                            text: type === 'horizontalBar' ? '得票数' : '编程语言',
                            font: { size: 14, weight: 'bold' }
                        },
                        ticks: {
                            font: { size: 12 },
                            maxRotation: type === 'horizontalBar' ? 0 : 45,
                            minRotation: type === 'horizontalBar' ? 0 : 45
                        }
                    },
                    y: { 
                        display: true,
                        title: {
                            display: type !== 'horizontalBar',
                            text: type !== 'horizontalBar' ? '得票数' : '编程语言',
                            font: { size: 14, weight: 'bold' }
                        },
                        ticks: {
                            font: { size: 12 }
                        }
                    }
                }
            }
        };
    }
    
    charts.chart3 = new Chart(ctx, config);
}

/**
 * 创建二次函数曲线
 * @param {string} type - 图表类型（line/scatter）
 */
function createChart4(type) {
    const { xValues, yValues } = generateQuadraticData();
    
    if (charts.chart4) {
        charts.chart4.destroy();
    }
    
    const ctx = document.getElementById('chart4-canvas').getContext('2d');
    
    charts.chart4 = new Chart(ctx, {
        type: type === 'scatter' ? 'scatter' : 'line',
        data: {
            labels: type === 'line' ? xValues.map(x => x.toFixed(2)) : undefined,
            datasets: [{
                label: 'y = x²',
                data: type === 'scatter' ? 
                    xValues.map((x, i) => ({ x: x, y: yValues[i] })) :
                    yValues,
                borderColor: colorThemes.primary[0],
                backgroundColor: type === 'scatter' ? 
                    'rgba(102, 126, 234, 0.8)' :
                    'rgba(102, 126, 234, 0.2)',
                borderWidth: 3,
                fill: type === 'line',
                tension: 0.4,
                pointRadius: type === 'scatter' ? 4 : 0,
                pointHoverRadius: 8,
                pointBackgroundColor: 'rgba(102, 126, 234, 0.8)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true, 
                    position: 'top',
                    labels: {
                        font: { size: 14, weight: 'bold' }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: 15,
                    callbacks: {
                        title: function(context) {
                            return `函数值`;
                        },
                        label: function(context) {
                            if (type === 'scatter') {
                                return `坐标: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(3)})`;
                            } else {
                                const xIndex = context.dataIndex;
                                const x = xValues[xIndex];
                                const y = yValues[xIndex];
                                return `坐标: (${x.toFixed(2)}, ${y.toFixed(3)})`;
                            }
                        }
                    }
                }
            },
            scales: {
                x: { 
                    display: true,
                    min: -2.2,
                    max: 2.2,
                    title: { 
                        display: true, 
                        text: 'x', 
                        font: { size: 14, weight: 'bold' }
                    },
                    ticks: {
                        font: { size: 12 },
                        callback: function(value) {
                            if (value === -2 || value === -1 || value === 0 || value === 1 || value === 2) {
                                return value;
                            }
                            return null;
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: { 
                    display: true,
                    min: -0.5,
                    max: 4.5,
                    title: { 
                        display: true, 
                        text: 'y = x²', 
                        font: { size: 14, weight: 'bold' }
                    },
                    ticks: {
                        font: { size: 12 },
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

/**
 * 创建正切函数曲线
 * @param {string} type - 图表类型（line/scatter）
 */
function createChart5(type) {
    const { xValues, yValues } = generateTanData();
    
    if (charts.chart5) {
        charts.chart5.destroy();
    }
    
    const ctx = document.getElementById('chart5-canvas').getContext('2d');
    
    charts.chart5 = new Chart(ctx, {
        type: type === 'scatter' ? 'scatter' : 'line',
        data: {
            labels: type === 'line' ? xValues.map(x => x.toFixed(3)) : undefined,
            datasets: [{
                label: 'y = tan(x)',
                data: type === 'scatter' ? 
                    xValues.map((x, i) => ({ x: x, y: yValues[i] })) :
                    yValues,
                borderColor: colorThemes.secondary[0],
                backgroundColor: type === 'scatter' ? 
                    'rgba(240, 147, 251, 0.8)' :
                    'rgba(240, 147, 251, 0.2)',
                borderWidth: 3,
                fill: type === 'line',
                tension: 0.4,
                pointRadius: type === 'scatter' ? 4 : 0,
                pointHoverRadius: 8,
                pointBackgroundColor: 'rgba(240, 147, 251, 0.8)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true, 
                    position: 'top',
                    labels: {
                        font: { size: 14, weight: 'bold' }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: 15,
                    callbacks: {
                        title: function(context) {
                            return `正切函数值`;
                        },
                        label: function(context) {
                            if (type === 'scatter') {
                                return `坐标: (${context.parsed.x.toFixed(3)}, ${context.parsed.y.toFixed(3)})`;
                            } else {
                                const xIndex = context.dataIndex;
                                const x = xValues[xIndex];
                                const y = yValues[xIndex];
                                return `坐标: (${x.toFixed(3)}, ${y.toFixed(3)})`;
                            }
                        },
                        afterBody: function(context) {
                            const x = context[0].parsed.x;
                            const pi = Math.PI;
                            if (Math.abs(x) < 0.01) {
                                return '\n定义域: (-π/2, π/2)\n值域: (-∞, +∞)';
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: { 
                    display: true,
                    min: -Math.PI/2 - 0.1,
                    max: Math.PI/2 + 0.1,
                    title: { 
                        display: true, 
                        text: 'x (弧度)', 
                        font: { size: 14, weight: 'bold' }
                    },
                    ticks: {
                        font: { size: 12 },
                        callback: function(value) {
                            const pi = Math.PI;
                            if (Math.abs(value - (-pi/2)) < 0.1) return '-π/2';
                            if (Math.abs(value - (pi/2)) < 0.1) return 'π/2';
                            if (Math.abs(value - (-pi/4)) < 0.1) return '-π/4';
                            if (Math.abs(value - (pi/4)) < 0.1) return 'π/4';
                            if (Math.abs(value) < 0.1) return '0';
                            return null;
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: { 
                    display: true,
                    min: -3.5,
                    max: 3.5,
                    title: { 
                        display: true, 
                        text: 'y = tan(x)', 
                        font: { size: 14, weight: 'bold' }
                    },
                    ticks: {
                        font: { size: 12 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

/**
 * 切换图表类型
 * @param {string} chartId - 图表ID
 * @param {string} type - 新的图表类型
 */
function switchChart(chartId, type) {
    // 更新按钮状态
    const buttons = document.querySelectorAll(`#${chartId} .chart-btn`);
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 重新创建图表
    switch(chartId) {
        case 'chart1':
            createChart1(type);
            break;
        case 'chart2':
            createChart2(type);
            break;
        case 'chart3':
            createChart3(type);
            break;
        case 'chart4':
            createChart4(type);
            break;
        case 'chart5':
            createChart5(type);
            break;
    }
}

/**
 * 初始化导航功能
 */
function initNavigation() {
    // 平滑滚动到目标图表
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 初始化所有图表
 */
function initCharts() {
    console.log('页面加载完成，开始初始化图表...');
    
    try {
        createChart1('line');
        createChart2('line');
        createChart3('bar');
        createChart4('line');
        createChart5('line');
        console.log('所有图表初始化成功！');
    } catch (error) {
        console.error('图表初始化失败:', error);
    }
}

/**
 * 响应式处理
 */
function handleResize() {
    window.addEventListener('resize', function() {
        Object.values(charts).forEach(chart => {
            if (chart) chart.resize();
        });
    });
}

/**
 * 页面加载完成后的初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCharts();
    handleResize();
});

// 导出主要函数供外部调用
window.DataVisualization = {
    switchChart,
    createChart1,
    createChart2,
    createChart3,
    createChart4,
    createChart5,
    generateTimeSeriesData,
    generateSalesData,
    getProgrammingLanguageData,
    generateQuadraticData,
    generateTanData
};