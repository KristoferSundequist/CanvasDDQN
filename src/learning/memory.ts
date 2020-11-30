import * as tf from '@tensorflow/tfjs'
import { Range, RandInt } from '../utils'
import { Tensor3D } from '@tensorflow/tfjs'

interface Memory {
    state: tf.Tensor3D
    action: number
    reward: number
    terminal: boolean
}

interface InternalMemory {
    state: Float32Array
    action: number
    reward: number
    terminal: boolean
}

export default class ExperienceReplayBuffer {
    size: number
    pivot: number
    memory: InternalMemory[]
    state_length: number
    terminals: number[]
    _width: number
    _height: number

    constructor(size: number, state_length: number, width: number, height: number) {
        this.size = size
        this.pivot = 0
        this.memory = []
        this.state_length = state_length
        this.terminals = []

        this._width = width
        this._height = height
    }

    // takes ownership over the memory
    push(transition: Memory) {
        if (this.memory.length < this.size) {
            this.memory.push(null)
        }

        const internalMemory = {
            state: transition.state.dataSync() as Float32Array,
            action: transition.action,
            reward: transition.reward,
            terminal: transition.terminal
        }

        transition.state.dispose()

        this.memory[this.pivot] = internalMemory
        this.pivot = (this.pivot + 1) % this.size
    }

    tensorifyMemory(mem: tf.Tensor3D[]) {
        return tf.tidy(() => tf.stack(mem, 2).squeeze())
    }

    _padAndCrop(state: tf.Tensor, xCrop: number, yCrop: number, padding: number): tf.Tensor {
        return tf.tidy(() => {
            const padded = state.pad([[padding, padding], [padding, padding], [0, 0]])
            return padded.slice([xCrop, yCrop], [state.shape[0], state.shape[1]])
        })
    }

    getMemory(memoryIndex: number, len: number = this.state_length): Tensor3D[] {
        try {
            return Range(len).map((_, i) => {
                let index = memoryIndex - i
                if (index < 0) {
                    index = this.size + index
                }
                return tf.tensor(this.memory[index].state, [this._width, this._height, 1])
            })
        } catch (e) {
            console.log("----------- Exception in getMemory --------------")
            console.log(e)
            console.log(memoryIndex)
            console.log(len)
            console.log(this.memory.length)
            throw e;
        }
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

    _getForbiddenIndices(nsteps: number): number[] {
        let forbidden = Range(nsteps).map(v => this.pivot - v - 1)

        // forbid memories at the start of the buffer since they are not nstep long
        for (let i = 0; i < nsteps; i++) {
            forbidden.push(i)
        }

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

    _prepareStates(index: number, nsteps: number, augment: boolean, padding: number = 2): [tf.Tensor, tf.Tensor] {
        return tf.tidy(() => {
            const state = this.tensorifyMemory(this.getMemory(index))

            const next_state_index = (index + nsteps) % this.size
            const next_state = this.tensorifyMemory(this.getMemory(next_state_index))

            if (!augment) {
                return [state, next_state]
            }

            const xCrop = RandInt(0, padding * 2)
            const yCrop = RandInt(0, padding * 2)
            const augmented_state = this._padAndCrop(state, xCrop, yCrop, padding)
            const augmented_next_state = this._padAndCrop(next_state, xCrop, yCrop, padding)

            return [augmented_state, augmented_next_state]
        })
    }

    getBatch(batchsize: number, discount: number, nsteps: number) {
        const indices = this._randomIndices(batchsize, this.memory.length, this._getForbiddenIndices(nsteps))
        return tf.tidy(() => {
            let states = []
            let next_states = []
            for (let i of indices) {
                const [state, next_state] = this._prepareStates(i, nsteps, true)
                states.push(state)
                next_states.push(next_state)
            }

            const actions = indices.map(i => this.memory[i].action)


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
}
