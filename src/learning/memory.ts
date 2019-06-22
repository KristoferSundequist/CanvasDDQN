import * as tf from '@tensorflow/tfjs'
import { Range } from '../utils'
import { Tensor3D } from '@tensorflow/tfjs'

interface Memory {
    state: tf.Tensor3D
    action: number
    reward: number
    terminal: boolean
}

export default class ExperienceReplayBuffer {
    size: number
    pivot: number
    memory: Memory[]
    state_length: number
    terminals: number[]

    constructor(size: number, state_length: number) {
        this.size = size
        this.pivot = 0
        this.memory = []
        this.state_length = state_length
        this.terminals = []
    }

    push(transition: Memory) {
        if (this.memory.length < this.size) {
            this.memory.push(null)
        } else {
            this.memory[this.pivot].state.dispose()
        }
        this.memory[this.pivot] = transition
        this.pivot = (this.pivot + 1) % this.size
    }

    tensorifyMemory(mem: tf.Tensor3D[]) {
        return tf.tidy(() => tf.stack(mem, 2).squeeze())
    }

    getMemory(memoryIndex: number, len: number = this.state_length): Tensor3D[] {
        return Range(len).map((_, i) => {
            let index = memoryIndex - i
            if (index < 0) {
                index = this.size + index
            }
            return this.memory[index].state
        })
    }

    getCurrentState(state: tf.Tensor3D, forRender: boolean = false): tf.Tensor3D[] {
        let arr = forRender ? this.getMemory(this.pivot - 1, 2) : this.getMemory(this.pivot - 1, this.state_length - 1)
        arr.unshift(state)
        return arr
    }

    _randomIndices(batchsize: number, domainsize: number, forbidden: number[]): number[] {
        let arr = []
        while (arr.length < batchsize) {
            let randomnumber = Math.floor(Math.random() * domainsize)
            if (!forbidden.includes(randomnumber) && !arr.includes(randomnumber)) {
                arr.push(randomnumber)
            }
        }
        return arr
    }

    getForbiddenIndices(nsteps: number): number[] {
        let forbidden = Range(nsteps).map(v => this.pivot - v - 1)

        // forbid indices just after terminal states, since the state will then span different episodes (since getMemory stacks
        // this.state_length number of states backwards)
        const terminalIndices = this.memory.map((m, i) => (m.terminal ? i : null)).filter(v => v != null)
        for (let i = 0; i < terminalIndices.length; i++) {
            for (let j = 1; j <= this.state_length; j++) {
                forbidden.push(terminalIndices[i] + j)
            }
        }

        return forbidden
    }

    getBatch(batchsize: number, discount: number, nsteps: number) {
        const indices = this._randomIndices(batchsize, this.memory.length, this.getForbiddenIndices(nsteps))
        return tf.tidy(() => {
            const states = indices.map(i => this.tensorifyMemory(this.getMemory(i)))

            const actions = indices.map(i => this.memory[i].action)

            // get state nsteps away from current state
            const next_states = indices.map(memoryIndex => {
                const next_state_index = (memoryIndex + nsteps) % this.size
                return this.tensorifyMemory(this.getMemory(next_state_index))
            })

            //const rewards = indices.map(i => this.memory[i].reward)
            const rewards = indices.map(memoryIndex => {
                let current_discount = 1
                let accReward = 0
                let take = true
                for (let nstepOffset = 0; nstepOffset < nsteps; nstepOffset++) {
                    const currentMemory = this.memory[(memoryIndex + nstepOffset) % this.size]
                    accReward += Number(take) * current_discount * currentMemory.reward
                    current_discount *= discount
                    // if state is terminal -> ignore rest of rewards
                    if (currentMemory.terminal) {
                        take = false
                    }
                }
                return accReward
            })

            //const terminals = indices.map(i => this.memory[i].terminal)
            const terminals = indices.map(memoryIndex =>
                Range(nsteps).reduce(
                    (terminal, nstepOffset) =>
                        this.memory[(memoryIndex + nstepOffset) % this.size].terminal ? true : terminal,
                    false
                )
            )

            return {
                states: tf.stack(states),
                actions: tf.tensor(actions).cast('int32'),
                next_states: tf.stack(next_states),
                rewards: tf.tensor(rewards),
                terminals: tf.tensor(terminals)
            }
        })
    }

    get(ith: number) {
        return this.memory[ith]
    }

    length(): number {
        return this.memory.length
    }
}
