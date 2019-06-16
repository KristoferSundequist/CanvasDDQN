import { Breakout, BreakoutSettings, actions } from '../breakout'
// import { Flappy, FlappySettings, actions} from '../flappybird';
//import { Circlegame, CirclegameSettings, actions} from '../circlegame';

import { canvas, ctx, resizeCanvas } from '../core/utils/canvas'
import * as tf from '@tensorflow/tfjs'
import ExperienceReplayBuffer from './memory'
import { getModel, cloneModel } from './model'
import { Rank, Tensor3D, tidy } from '@tensorflow/tfjs'

//tf.setBackend('webgl')

const num_actions = actions.ACTIONS_LIST.length
const memory_size = 50000
const input_channels = 5
export const memory = new ExperienceReplayBuffer(memory_size, input_channels)
export const model = getModel(num_actions, input_channels)
export let lagged_model = getModel(num_actions, input_channels)
cloneModel(lagged_model, model)

export const optimizer = tf.train.rmsprop(0.0003)

export function startProgrammaticControlledGame() {
    const game = new Breakout({
        settings: new BreakoutSettings({
            width: 28,
            height: 28,

            brickHeight: 1,
            brickColumnCount: 5,
            brickRowCount: 3,
            brickOffsetLeft: 0,
            brickPadding: 0,
            brickOffsetTop: 2,

            paddleHeight: 2,
            paddleWidth: 9,
            paddleVelocity: 50,

            ballRadius: 0.6,
            ballVelocity: 60
        })
    })

    game.reset()

    return game
}

// export function startProgrammaticControlledGame() {
//     const game = new Flappy();
//     game.reset();
//     return game;
// }
/*
export function startProgrammaticControlledGame() {
    const game = new Circlegame();
    game.reset();
    return game;
}
*/
export function tensorifyMemory(mem): tf.Tensor3D {
    return tf.tidy(() => tf.stack(mem, 2).squeeze())
}

export function getState(): Tensor3D {
    const raw = ctx.getImageData(0, 0, canvas.width, canvas.height)
    return tf.tidy(() =>
        tf.browser
            .fromPixels(raw, 1)
            .cast('float32')
            .div(tf.scalar(255))
    )
    //return tf.tidy(() => tf.browser.fromPixels(raw,1).cast('float32'));
}

window['ctx'] = ctx
window['canvas'] = canvas
window['model'] = model
window['tf'] = tf
window['getState'] = getState
window['getAction'] = getAction

export const qlog = []

export function getAction(current_state, log = false) {
    return tf.tidy(() => {
        const stacked_state = tensorifyMemory(
            memory.getCurrentState(current_state)
        )
        const pred = model.predict(stacked_state.expandDims())
        if (log) {
            qlog.push(pred.max().dataSync()[0])
        }
        const data = pred.argMax(1).dataSync()
        return data[0]
    })
}

export async function renderloop(iters: number, epsilon: number) {
    for (var i = 0; i < iters; i++) {
        await sleep(30)
        const [state, action, reward, terminal] = tf.tidy(() => {
            const state = getState()
            const action =
                Math.random() < epsilon
                    ? Math.floor(Math.random() * num_actions)
                    : getAction(state)

            const [reward, terminal] = g.step(action)
            if (terminal) console.log('terminal', terminal)
            if (reward != 0) {
                console.log(reward)
            }
            return [state, action, reward, terminal]
        })
        memory.push({
            state: state,
            action: action,
            reward: reward,
            terminal: terminal
        })
    }
}

async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

export const raw = ctx.getImageData(0, 0, canvas.width, canvas.height)
let g = startProgrammaticControlledGame()
window['g'] = g

export async function loop(n) {
    for (let i = 0; i < n; i++) {
        await sleep(10)
        g.step(Math.floor(Math.random() * num_actions))
    }
}

export function init(iters = memory_size) {
    g.step(0)
    for (var i = 0; i < iters; i++) {
        const state = getState()
        const action = Math.floor(Math.random() * num_actions)
        const [reward, terminal] = g.step(action)
        memory.push({
            state: state,
            action: action,
            reward: reward,
            terminal: terminal
        })
        if (i % 1000 == 0) {
            console.log('Init: ', (i / iters) * 100, '%')
        }
    }
    console.log('done')
}

export function renderCurrentState() {
    const state = getState()
    const stack = tensorifyMemory(memory.getCurrentState(state))
    tf.browser.toPixels(stack.cast('int32'), canvas)
}

export async function renderMemory(start, stop) {
    for (var i = start; i < stop; i++) {
        await sleep(100)
        tf.browser.toPixels(
            tensorifyMemory(memory.getMemory(i, 3)).cast('int32'),
            canvas
        )
    }
}

export function doubleTrainOnBatch(discount: number) {
    const batch = memory.getBatch()
    tf.tidy(() => {
        const next_actions = model.predict(batch.next_states).argMax(1)
        const next_action_mask = tf
            .oneHot(next_actions, num_actions)
            .cast('float32')
        const next_q_values = lagged_model
            .predict(batch.next_states)
            .mul(next_action_mask)
            .sum(1)

        const discounted_next_state_value = next_q_values
            .mul(tf.scalar(discount))
            .mul(batch.terminals.logicalNot())

        const target = discounted_next_state_value.add(batch.rewards)

        const current_action_mask = tf
            .oneHot(batch.actions, num_actions)
            .cast('float32')

        optimizer.minimize(() => {
            const current_q_values = model.predict(batch.states)
            const q_values_of_actions_taken = current_q_values
                .mul(current_action_mask)
                .sum(1)

            return tf.losses.huberLoss(target, q_values_of_actions_taken)
        })
    })

    batch.states.dispose()
    batch.actions.dispose()
    batch.next_states.dispose()
    batch.rewards.dispose()
}

export let reward_arr = []

export async function train(
    iters: number,
    epsilon: number,
    discount: number,
    updateFreq: number,
    render: boolean = false
) {
    let totalreward = 0

    const start = performance.now()
    for (var i = 0; i < iters; i++) {
        const state = getState()
        const action =
            Math.random() < epsilon
                ? Math.floor(Math.random() * num_actions)
                : getAction(state, true)
        const [reward, terminal] = g.step(action)
        totalreward += reward

        memory.push({
            state: state,
            action: action,
            reward: reward,
            terminal: terminal
        })

        doubleTrainOnBatch(discount)

        if (i % 1000 == 0) {
            reward_arr.push(totalreward)
            console.log(
                'Progress: ',
                (i / iters) * 100,
                '%',
                'Reward: ',
                totalreward
            )
            console.log(reward_arr)
            console.log(JSON.stringify(reward_arr))
            totalreward = 0
        }

        if (i % updateFreq === 0) {
            cloneModel(lagged_model, model)
        }

        if (render) await sleep(1)
    }
    console.log((performance.now() - start) / 1000)
}

export async function trainwrapper() {
    window['g'] = startProgrammaticControlledGame()
    console.log(num_actions)
    console.log('initializing...')
    init()
    console.log('training...')
    //await train(100001, 0.1, 0.99, 2000)
}
