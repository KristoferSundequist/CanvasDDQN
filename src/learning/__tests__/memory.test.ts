import ExperienceReplayBuffer from '../memory'
import * as tf from '@tensorflow/tfjs'

describe('memory init', () => {
    it('true is true', () => {
        expect(true).toEqual(true)
    })

    it('size is size', () => {
        const memory = new ExperienceReplayBuffer(1000,3)
        expect(memory.size).toEqual(1000)
    })
    
})

describe('preparStates', () => {
    it('padAndCrop - Returns same size', () => {
        const memory = new ExperienceReplayBuffer(1000,3)
        const inputState = tf.zeros([28,28,4])

        const cropped = memory.padAndCrop(inputState, 0, 1, 2)

        expect(cropped.shape).toEqual([28,28,4])
        
    })

    it('padAndCrop - moves pixel correctly when zero crop', () => {
        const memory = new ExperienceReplayBuffer(1000,3)
        const inputState = tf.randomGamma([3,3,2], 0.5)

        const cropped = memory.padAndCrop(inputState, 0, 0, 2)
        
        const inputData = inputState.dataSync()
        const croppedData = cropped.dataSync()

        expect(croppedData[0]).toEqual(0)
        expect(croppedData[16]).toEqual(inputData[0])
        expect(croppedData[17]).toEqual(inputData[1])
        
    })

    it('padAndCrop - moves pixel correctly when little x crop crop', () => {
        const memory = new ExperienceReplayBuffer(1000,3)
        const inputState = tf.randomGamma([3,3,2], 0.5)

        const cropped = memory.padAndCrop(inputState, 1, 0, 2)
        
        const inputData = inputState.dataSync()
        const croppedData = cropped.dataSync()

        expect(croppedData[0]).toEqual(0)
        expect(croppedData[10]).toEqual(inputData[0])
        expect(croppedData[11]).toEqual(inputData[1])
        expect(croppedData[16]).toEqual(inputData[6])
        expect(croppedData[17]).toEqual(inputData[7])
    })

    it('padAndCrop - moves pixel correctly when little y crop crop', () => {
        const memory = new ExperienceReplayBuffer(1000,3)
        const inputState = tf.randomGamma([3,3,2], 0.5)

        const cropped = memory.padAndCrop(inputState, 0, 1, 2)
        
        const inputData = inputState.dataSync()
        const croppedData = cropped.dataSync()

        expect(croppedData[0]).toEqual(0)
        expect(croppedData[14]).toEqual(inputData[0])
        expect(croppedData[15]).toEqual(inputData[1])
        expect(croppedData[16]).toEqual(inputData[2])
    })
})
