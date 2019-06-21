import ExperienceReplayBuffer from '../memory'

describe('memory', () => {
    it('true is true', () => {
        expect(true).toEqual(true)
    })

    it('size is size', () => {
        const memory = new ExperienceReplayBuffer(1000,3)
        expect(memory.size).toEqual(1000)
    })
})
