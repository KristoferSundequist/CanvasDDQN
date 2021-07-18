import { Range, Sum, Average } from '../utils'
import { setChartData1, setChartData2 } from '../charts'

export default class Logger {
    private rewards: number[]
    private qvalues: number[]

    private intervalRewardBuffer: number[]
    private intervalQvalueBuffer: number[]

    private intervalSize: number

    constructor(intervalSize: number) {
        this.rewards = []
        this.qvalues = []

        this.intervalRewardBuffer = []
        this.intervalQvalueBuffer = []

        this.intervalSize = intervalSize
    }

    pushReward(r: number): void {
        this.intervalRewardBuffer.push(r)
    }

    pushQvalue(qv: number): void {
        this.intervalQvalueBuffer.push(qv)
    }

    processInterval(): void {
        this.rewards.push(Sum(this.intervalRewardBuffer))
        this.qvalues.push(Average(this.intervalQvalueBuffer))
        this.resetBuffers()
    }

    private resetBuffers(): void {
        this.intervalQvalueBuffer = []
        this.intervalRewardBuffer = []
    }

    plot(): void {
        setChartData1(this.rewards, this.intervalSize)
        setChartData2(this.qvalues, this.intervalSize)
    }
}