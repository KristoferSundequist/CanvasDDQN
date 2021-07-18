import Chart from 'chart.js'

//////////////////////////////////////////
/////////////// CHART 1 ///////////////////
/////////////////////////////////////////////

export const statisticsContext1 = (document.getElementById(
    'statisticsCanvas1'
) as HTMLCanvasElement).getContext('2d')

const chart1 = new Chart(statisticsContext1, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'sum of reward per interval',
                data: [],
                borderWidth: 1,
                pointRadius: 1,
                borderColor: 'green',
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        }
    }
})

window['rewardschart'] = chart1
export function setChartData1(rewards, intervalSize) {
    chart1.data.labels = rewards.map((_, i) => intervalSize + intervalSize * i)
    chart1.data.datasets[0].data = rewards
    chart1.update()
}

window['setChartData1'] = setChartData1
//chart.data.datasets

//////////////////////////////////////////
/////////////// CHART 2 ///////////////////
/////////////////////////////////////////////

export const statisticsContext2 = (document.getElementById(
    'statisticsCanvas2'
) as HTMLCanvasElement).getContext('2d')

const chart2 = new Chart(statisticsContext2, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'mean max Q-value per interval',
                data: [],
                borderWidth: 1,
                pointRadius: 1,
                borderColor: 'blue',
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        }
    }
})

window['qvalueschart'] = chart2
export function setChartData2(qvalues, intervalSize) {
    chart2.data.labels = qvalues.map((_, i) => intervalSize + intervalSize * i)
    chart2.data.datasets[0].data = qvalues
    chart2.update()
}

window['setChartData2'] = setChartData2