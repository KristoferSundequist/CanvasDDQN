import * as tf from '@tensorflow/tfjs'

export function getModel(num_actions, input_channels) {
    return tf.sequential({
        layers: [
            tf.layers.zeroPadding2d({
                inputShape: [28, 28, input_channels],
                padding: 4
            }),
            tf.layers.conv2d({
                kernelSize: 3,
                filters: 16,
                strides: 1,
                activation: 'relu',
                kernelInitializer: 'varianceScaling'
            }),
            tf.layers.maxPooling2d({ poolSize: 2 }),
            tf.layers.conv2d({
                kernelSize: 3,
                filters: 32,
                strides: 1,
                activation: 'relu',
                kernelInitializer: 'varianceScaling'
            }),
            tf.layers.maxPooling2d({ poolSize: 2 }),
            tf.layers.conv2d({
                kernelSize: 3,
                filters: 32,
                strides: 1,
                activation: 'relu',
                kernelInitializer: 'varianceScaling'
            }),
            tf.layers.flatten(),
            tf.layers.dense({
                units: 512,
                kernelInitializer: 'varianceScaling',
                activation: 'relu'
            }),
            tf.layers.dense({
                units: num_actions,
                kernelInitializer: 'varianceScaling',
                activation: 'linear'
            })
        ]
    })
}

function getModelOld(num_actions) {
    return tf.sequential({
        layers: [
            tf.layers.zeroPadding2d({
                inputShape: [28, 28, 3],
                padding: 2
            }),
            tf.layers.conv2d({
                kernelSize: 4,
                filters: 16,
                strides: 2,
                activation: 'relu',
                kernelInitializer: 'varianceScaling'
            }),
            tf.layers.conv2d({
                kernelSize: 4,
                filters: 32,
                strides: 2,
                activation: 'relu',
                kernelInitializer: 'varianceScaling'
            }),
            tf.layers.flatten(),
            tf.layers.dense({
                units: 256,
                kernelInitializer: 'varianceScaling',
                activation: 'relu'
            }),
            tf.layers.dense({
                units: 256,
                kernelInitializer: 'varianceScaling',
                activation: 'relu'
            }),
            tf.layers.dense({
                units: num_actions,
                kernelInitializer: 'varianceScaling',
                activation: 'linear'
            })
        ]
    })
}

export function cloneModel(m, modelToCopy) {
    for (var i = 0; i < modelToCopy.weights.length; i++) {
        m.weights[i].val.dispose()
        m.weights[i].val = tf.clone(modelToCopy.weights[i].val)
    }
    return m
}
