import * as tf from '@tensorflow/tfjs'

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

    constructor(size: number) {
        this.size = size
        this.pivot = 0
        this.memory = []
        this.state_length = 3
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

    getMemory(memoryIndex: number, len: number = this.state_length) {
        let arr = []
        for (let i = 0; i < len; i++) {
            let index = memoryIndex - i
            if (index < 0) {
                index = this.size + index
            }
            arr.push(this.memory[index].state)
        }
        return arr
    }

    getCurrentState(state: tf.Tensor3D): tf.Tensor3D[] {
        let arr = this.getMemory(this.pivot - 1, this.state_length - 1)
        arr.unshift(state)
        return arr
    }

    _randomIndices(
        batchsize: number,
        domainsize: number,
        forbidden: number[]
    ): number[] {
        let arr = []
        while (arr.length < batchsize) {
            let randomnumber = Math.floor(Math.random() * domainsize)
            if (
                !forbidden.includes(randomnumber) &&
                !arr.includes(randomnumber)
            ) {
                arr.push(randomnumber)
            }
        }
        return arr
    }

    // TODO: add more forbidden indices (disjoint states)
    getForbiddenIndices(): number[] {
        let forbidden = []

        // push states before pivot since they will be disjoint
        for (let i = 1; i < this.state_length; i++) {
            forbidden.push(this.pivot - i)
        }
        return forbidden
    }

    getBatch(batchsize = 32) {
        const indices = this._randomIndices(
            batchsize,
            this.memory.length,
            this.getForbiddenIndices()
        )
        return tf.tidy(() => {
            const states = indices.map(i =>
                this.tensorifyMemory(this.getMemory(i))
            )
            const actions = indices.map(i => this.memory[i].action)

            const next_states = indices.map(i => {
                const next_state_index = (i + 1) % this.size
                return this.tensorifyMemory(this.getMemory(next_state_index))
            })

            const rewards = indices.map(i => this.memory[i].reward)
            const terminals = indices.map(i => this.memory[i].terminal)

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
