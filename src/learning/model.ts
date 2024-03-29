import * as tf from '@tensorflow/tfjs'
import { Tensor3D, SymbolicTensor, Tensor } from '@tensorflow/tfjs'

class CustomPooler2d extends tf.layers.Layer {
    constructor() {
        super({});
    }

    computeOutputShape(inputShape) { return [inputShape[0], inputShape[1], inputShape[2]]; }

    call(input, kwargs) {
        if (Array.isArray(input)) {
            return input[0].mean([3]);
        } else {
            throw new Error("Expected array but got something that wasnt")
        }
    }

    getClassName() { return 'CustomPooler2dHackz'; }

}

export function getModel(num_actions: number, input_channels: number) {
    const input = tf.input({ shape: [48, 48, input_channels] })
    const featureExtractor = tf.sequential({
        layers: [
            tf.layers.zeroPadding2d({
                inputShape: [48, 48, input_channels],
                padding: 3
            }),
            tf.layers.conv2d({
                kernelSize: 3,
                filters: 32,
                strides: 1,
                activation: 'relu',
                kernelInitializer: 'varianceScaling'
            }),
            tf.layers.averagePooling2d({ poolSize: 2 }),
            tf.layers.conv2d({
                kernelSize: 3,
                filters: 32,
                strides: 1,
                activation: 'relu',
                kernelInitializer: 'varianceScaling'
            }),
            tf.layers.averagePooling2d({ poolSize: 2 }),
            tf.layers.conv2d({
                kernelSize: 3,
                filters: 32,
                strides: 1,
                activation: 'relu',
                kernelInitializer: 'varianceScaling'
            }),
            tf.layers.flatten()
        ]
    })

    const features = featureExtractor.apply(input)

    const valueHidden = tf.layers.dense({
        units: 512,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    })

    const valueHead = tf.layers.dense({
        units: 1,
        activation: 'linear',
        kernelInitializer: 'varianceScaling'
    })

    const value = valueHead.apply(valueHidden.apply(features)) as SymbolicTensor

    const advantagesHidden = tf.layers.dense({
        units: 512,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    })

    const advantagesHead = tf.layers.dense({
        units: num_actions,
        activation: 'linear',
        kernelInitializer: 'varianceScaling'
    })

    const advantages = advantagesHead.apply(advantagesHidden.apply(features)) as SymbolicTensor

    const dualingModel = tf.model({ inputs: input, outputs: [value, advantages] })

    const getQvals = inp => {
        return tf.tidy(() => {
            const [value, advantages] = dualingModel.predict(inp) as tf.Tensor[]
            const advantagesMean = advantages.mean(1).expandDims(1)
            const centeredAdvantages = advantages.sub(advantagesMean)
            const qvals = value.add(centeredAdvantages)
            return qvals
        })
    }

    const model = {
        predict: getQvals,
        weights: dualingModel.weights
    }

    return model
}

export function cloneModel(m, modelToCopy) {
    for (var i = 0; i < modelToCopy.weights.length; i++) {
        m.weights[i].val.dispose()
        m.weights[i].val = tf.clone(modelToCopy.weights[i].val)
    }
    return m
}

export function softUpdate(laggedModel, modelToCopy, TAU = 1e-3) {
    return tf.tidy(() => {
        for (var i = 0; i < modelToCopy.weights.length; i++) {
            const laggedWeights = laggedModel.weights[i].val.mul(1 - TAU)
            const targetWeights = modelToCopy.weights[i].val.mul(TAU)
            const newWeights = laggedWeights.addStrict(targetWeights)
            laggedModel.weights[i].val.dispose()
            laggedModel.weights[i].val = newWeights
        }
        return laggedModel
    })
}